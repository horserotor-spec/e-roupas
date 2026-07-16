const fs = require('fs');
const content = fs.readFileSync('src/lib/api/orders.ts', 'utf8');

const regex = /export async function bipSeparationItem\([\s\S]*?(?=export async function bipExpeditionItem)/;
const match = content.match(regex);
if (!match) {
    console.error("Not found");
    process.exit(1);
}

const originalBip = match[0];
const newBip = `export async function bipSeparationItem(
  orderId: string,
  orderItemId: string,
  barcodeBipado: string,
  operatorId?: string
): Promise<BipSeparationResult> {
  // 1. Obter o item do pedido
  const { data: item, error: itemError } = await supabase
    .from("order_items")
    .select(\`
      id,
      product_id,
      product_name,
      sku,
      size,
      gender,
      quantity,
      quantity_separated,
      scanned_labels,
      products:product_id (
        model_id,
        fabric_id,
        color_id,
        models:model_id (name),
        fabrics:fabric_id (name, code),
        canonical_colors:color_id (name, code)
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

  // Barcode esperado gerado com o prefixo da arte, conforme a etiqueta operacional da peça
  const artCode = (item.sku?.split('-')[0] || "ART").toUpperCase();
  const fabricCode = (prod?.fabrics?.code || "GEN").toUpperCase();
  const colorCode = (prod?.canonical_colors?.code || "GEN").toUpperCase();
  const sizeCode = expectedSize.toUpperCase();
  const expectedBarcodeOld = \`\${artCode}-REG-\${fabricCode}-\${colorCode}-\${sizeCode}\`;
  const expectedBarcodeNew = item.id.split('-')[0].toUpperCase();

  // Normalizar bipagem
  const cleanBiped = barcodeBipado.trim().toUpperCase();
  const lastDotIndex = cleanBiped.lastIndexOf('.');
  const bipedBase = lastDotIndex !== -1 ? cleanBiped.substring(0, lastDotIndex) : cleanBiped;

  let finalItemId = orderItemId;
  let finalItem: any = item;
  let tScanned: string[] = [];

  // ── NOVO FORMATO: código numérico de 12 dígitos (Code 128C) ─────────────
  if (/^\\d{12}$/.test(cleanBiped)) {
    const bipOrderSeq = cleanBiped.substring(0, 4);
    const bipItemDec  = cleanBiped.substring(4, 9);
    const bipItemHex  = parseInt(bipItemDec, 10).toString(16).toUpperCase().padStart(4, '0');

    const { data: orderData2 } = await supabase.from("orders").select("code").eq("id", orderId).single();
    const orderCodeForBip = orderData2?.code || "";
    const orderSeq = orderCodeForBip.replace(/\\D/g, '').slice(-4).padStart(4, '0');

    // Barcode de outro pedido?
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
      .select("id, product_name, size, quantity, quantity_separated, scanned_labels")
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
    finalItem = targetItem;
    tScanned = (finalItem.scanned_labels as string[] || []);

    if (tScanned.includes(cleanBiped)) {
      return { success: false, message: "ERRO: Esta etiqueta já foi bipada anteriormente." };
    }

    if ((Number(finalItem.quantity_separated) || 0) >= Number(finalItem.quantity)) {
      return { success: false, message: \`🔴 ITEM JÁ COMPLETO: \${finalItem.product_name} (\${finalItem.size}) já tem todas as peças separadas.\` };
    }
  } 
  // ── FLUXO LEGADO: formatos antigos de barcode (não-numérico) ────────────
  else {
    tScanned = (item.scanned_labels as string[] || []);
    if (tScanned.includes(cleanBiped)) {
      return { success: false, message: \`ERRO: Esta etiqueta específica já foi conferida nesta etapa.\` };
    }

    if (bipedBase !== expectedBarcodeNew && bipedBase !== expectedBarcodeOld && bipedBase !== item.sku?.toUpperCase()) {
      const parts = bipedBase.split('-');
      let bipedDetails = bipedBase;
      if (parts.length >= 5) {
        const bipedFabric = parts[2];
        const bipedColor = parts[3];
        const bipedSize = parts[4];
        bipedDetails = \`Regular / Malha: \${bipedFabric} / Cor: \${bipedColor} / Tam: \${bipedSize}\`;
      }

      await supabase.from("separation_errors").insert([{
        order_id: orderId,
        order_item_id: orderItemId,
        expected_barcode: expectedBarcodeNew,
        biped_barcode: cleanBiped,
        operator_id: operatorId || null
      }]);

      return {
        success: false,
        message: "🔴 MP INCORRETO",
        expected: {
          model: expectedModel,
          fabric: expectedFabric,
          color: expectedColor,
          size: expectedSize,
          barcode: expectedBarcodeNew
        },
        biped: {
          details: bipedDetails,
          barcode: cleanBiped
        }
      };
    }
    
    if ((Number(finalItem.quantity_separated) || 0) >= Number(finalItem.quantity)) {
      return { success: false, message: \`🔴 ITEM JÁ COMPLETO: \${finalItem.product_name} (\${finalItem.size}) já tem todas as peças separadas.\` };
    }
  }

  // 3. Executar baixa real de estoque do lote associado a reserva
  const { data: reservations } = await supabase
    .from("stock_reservations")
    .select("id, batch_id, quantity")
    .eq("order_item_id", finalItemId)
    .limit(1);

  if (!reservations || reservations.length === 0) {
    return { success: false, message: "Nenhuma reserva de estoque encontrada para este item." };
  }

  const reservation = reservations[0];
  const qtyToConsume = 1; // 1 bip = 1 saída

  // Buscar lote
  const { data: batch } = await supabase
    .from("inventory_batches")
    .select("quantity_available, quantity_reserved")
    .eq("id", reservation.batch_id)
    .single();

  if (!batch) {
    return { success: false, message: "Lote associado à reserva não encontrado." };
  }

  // Devolver logicamente 1 unidade da reserva para o disponível porque a trigger do inventory_movements vai subtrair de tudo
  await supabase
    .from("inventory_batches")
    .update({
      quantity_available: Number(batch.quantity_available) + qtyToConsume,
      quantity_reserved: Math.max(0, Number(batch.quantity_reserved || 0) - qtyToConsume)
    })
    .eq("id", reservation.batch_id);

  // Inserir movimento de consumo (saída de estoque real)
  await supabase
    .from("inventory_movements")
    .insert([{
      batch_id: reservation.batch_id,
      movement_type: "consumo",
      quantity: -qtyToConsume,
      reference_type: "pedido",
      reference_id: orderId,
      notes: \`Consumo físico unitário na separação anti-erro (Reserva ID: \${reservation.id})\`
    }]);

  // Atualizar a reserva decrementando 1 unidade ou excluindo se esgotar
  const currentResQty = Number(reservation.quantity);
  if (currentResQty <= qtyToConsume) {
    await supabase.from("stock_reservations").delete().eq("id", reservation.id);
  } else {
    await supabase
      .from("stock_reservations")
      .update({ quantity: currentResQty - qtyToConsume })
      .eq("id", reservation.id);
  }

  // Incrementar quantidade separada do item
  const newSeparated = (Number(finalItem.quantity_separated) || 0) + qtyToConsume;
  const newScannedLabels = [...tScanned, cleanBiped];
  await supabase
    .from("order_items")
    .update({ 
      quantity_separated: newSeparated,
      scanned_labels: newScannedLabels
    })
    .eq("id", finalItemId);

  // Registrar log de separação
  await supabase.from("separation_logs").insert([{
    order_id: orderId,
    order_item_id: finalItemId,
    barcode: cleanBiped,
    quantity: qtyToConsume,
    operator_id: operatorId || null
  }]);

  // Gerar identidade única da peça (ex: ER-20260609-0042-01)
  const { data: orderData } = await supabase.from("orders").select("code").eq("id", orderId).single();
  const orderCode = orderData?.code || "ER-TEMP";
  const pieceCode = \`\${orderCode}-\${finalItemId.substring(0, 4)}-\${newSeparated}\`;

  await supabase.from("piece_identities").insert([{
    piece_code: pieceCode,
    order_id: orderId,
    order_item_id: finalItemId,
    status: 'separado'
  }]);

  // Timeline
  await supabase.from("order_timeline").insert([{
    order_id: orderId,
    user_id: operatorId || null,
    event_type: "separacao_validada",
    description: \`Separação validada: 1 un. de \${finalItem.product_name} (\${finalItem.size || expectedSize}) via barcode \${cleanBiped}.\`
  }]);

  return {
    success: true,
    message: \`🟢 MP VALIDADO — \${finalItem.product_name} (\${finalItem.size || expectedSize}) · Peça \${newSeparated}/\${finalItem.quantity}\`
  };
}
`;

fs.writeFileSync('src/lib/api/orders.ts', content.replace(originalBip, newBip), 'utf8');
