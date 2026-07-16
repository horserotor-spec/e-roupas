const fs = require('fs');
const content = fs.readFileSync('src/lib/api/orders.ts', 'utf8');

const regex = /export async function bipExpeditionItem\([\s\S]*?(?=export function useOrders)/;
const match = content.match(regex);
if (!match) {
    console.error("Not found");
    process.exit(1);
}

const originalBip = match[0];
const newBip = `export async function bipExpeditionItem(
  orderId: string,
  orderItemId: string,
  barcodeBipado: string,
  operatorId?: string
): Promise<BipSeparationResult> {
  // 1. Obter o item do pedido para validar
  const { data: item, error: itemError } = await supabase
    .from("order_items")
    .select(\`
      id,
      product_name,
      sku,
      size,
      quantity,
      quantity_dispatched,
      products (
        model_id,
        fabric_id,
        color_id,
        models (name),
        fabrics (name, code),
        canonical_colors (name, code)
      )
    \`)
    .eq("id", orderItemId)
    .single();

  if (itemError || !item) {
    return { success: false, message: "Item do pedido não encontrado." };
  }

  const prod = item.products as any;
  const expectedModel = prod?.models?.name || "";
  const expectedFabric = prod?.fabrics?.name || "";
  const expectedColor = prod?.canonical_colors?.name || "";
  const expectedSize = item.size || "";

  // O barcode esperado na Expedição é o próprio SKU do produto ou a regra ART-REG-MALHA-COR-TAMANHO
  const artCode = (item.sku?.split('-')[0] || "ART").toUpperCase();
  const fabricCode = (prod?.fabrics?.code || "GEN").toUpperCase();
  const colorCode = (prod?.canonical_colors?.code || "GEN").toUpperCase();
  const sizeCode = expectedSize.toUpperCase();
  const expectedBarcodeOld = \`\${artCode}-REG-\${fabricCode}-\${colorCode}-\${sizeCode}\`;
  const expectedBarcodeNew = item.id.split('-')[0].toUpperCase();

  const cleanBiped = barcodeBipado.trim().toUpperCase();
  const lastDotIndex = cleanBiped.lastIndexOf('.');
  const bipedBase = lastDotIndex !== -1 ? cleanBiped.substring(0, lastDotIndex) : cleanBiped;

  let finalItemId = orderItemId;

  // ── NOVO FORMATO: código numérico de 12 dígitos (Code 128C) ─────────────
  if (/^\\d{12}$/.test(cleanBiped)) {
    const bipOrderSeq = cleanBiped.substring(0, 4);
    const bipItemDec  = cleanBiped.substring(4, 9);
    const bipItemHex  = parseInt(bipItemDec, 10).toString(16).toUpperCase().padStart(4, '0');

    const { data: orderDataExp } = await supabase.from("orders").select("code").eq("id", orderId).single();
    const orderCodeForExp = orderDataExp?.code || "";
    const orderSeq = orderCodeForExp.replace(/\\D/g, '').slice(-4).padStart(4, '0');

    if (bipOrderSeq !== orderSeq) {
      return {
        success: false,
        message: "🔴 CÓDIGO DE OUTRO PEDIDO",
        biped: { details: \`Código pertence ao pedido seq. \${bipOrderSeq}\`, barcode: cleanBiped }
      };
    }

    // Localizar o item correto pelo hash do UUID
    const { data: allItems } = await supabase
      .from("order_items")
      .select("id")
      .eq("order_id", orderId);

    const targetItem = allItems?.find(i => i.id.substring(0, 4).toUpperCase() === bipItemHex);
    if (!targetItem) {
      return {
        success: false,
        message: "🔴 ETIQUETA NÃO RECONHECIDA",
        biped: { details: \`Item \${bipItemHex} não encontrado neste pedido\`, barcode: cleanBiped }
      };
    }
    
    finalItemId = targetItem.id;
  }
  // ── FLUXO LEGADO ────────────
  else {
    if (bipedBase !== expectedBarcodeNew && bipedBase !== expectedBarcodeOld && bipedBase !== item.sku?.toUpperCase()) {
      return {
        success: false,
        message: "🔴 PRODUTO INCORRETO",
        expected: {
          model: expectedModel,
          fabric: expectedFabric,
          color: expectedColor,
          size: expectedSize,
          barcode: expectedBarcodeNew
        },
        biped: {
          details: "Produto ou Variante diferente do esperado",
          barcode: cleanBiped
        }
      };
    }
  }

  // Chamar RPC para atualizar
  const { error: rpcError } = await supabase.rpc("bip_expedition_item", {
    p_order_id: orderId,
    p_order_item_id: finalItemId,
    p_operator_id: operatorId || null
  });

  if (rpcError) {
    return { success: false, message: rpcError.message || "Erro ao registrar conferência." };
  }

  return { success: true, message: "🟢 PRODUTO CONFERIDO" };
}
`;

fs.writeFileSync('src/lib/api/orders.ts', content.replace(originalBip, newBip), 'utf8');
console.log("Done");
