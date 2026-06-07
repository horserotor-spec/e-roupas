const fs = require('fs');
const path = 'src/routes/_authenticated.pedidos.$orderId.tsx';
let content = fs.readFileSync(path, 'utf8');

const brokenBlock = `    if (existing) {
        unit_price: item.unit_price || 0,
        customizations: item.customizations || [],
        notes: item.notes,
        totalQty: item.quantity || 0,
        sizes,
        itemIds: [item.id]
      });
    }
  });`;

const correctBlock = `    if (existing) {
      if (item.size) {
        existing.sizes[item.size] = (existing.sizes[item.size] || 0) + (item.quantity || 0);
      }
      existing.totalQty += item.quantity || 0;
      existing.itemIds.push(item.id);
    } else {
      const sizes = {
        "2": 0, "4": 0, "6": 0, "8": 0, "10": 0, "12": 0, "14": 0, "16": 0,
        PP: 0, P: 0, M: 0, G: 0, GG: 0, XG: 0, G1: 0, G2: 0, G3: 0, G4: 0
      };
      if (item.size) {
        sizes[item.size] = item.quantity || 0;
      }
      let baseSku = item.sku || "";
      let artCode = "";
      const parts = baseSku.split("-");
      
      if (parts.length > 1 && !parts[0].startsWith("PF") && !parts[0].startsWith("PA")) {
        artCode = parts.shift() || "";
        baseSku = parts.join("-");
      }
      
      if (parts.length >= 4 && parts[0] === "PF") {
        baseSku = parts.slice(0, -2).join("-");
        baseSku = baseSku.replace("PF-", "PA-");
      }

      groupedItems.push({
        product_id: item.product_id,
        product_name: item.product_name,
        sku: baseSku,
        art_code: artCode,
        gender: item.gender || "Unissex",
        model: item.model,
        line: item.line,
        fabric: item.fabric,
        color: item.color,
        list_price: item.list_price || 0,
        unit_price: item.unit_price || 0,
        customizations: item.customizations || [],
        notes: item.notes,
        totalQty: item.quantity || 0,
        sizes,
        itemIds: [item.id]
      });
    }
  });`;

content = content.replace(brokenBlock, correctBlock);

// Also update the kanban display to show both badges
const oldDisplay = `<div className="text-xs font-mono text-muted-foreground mt-1">SKU Base: {group.sku || "-"}</div>`;
const newDisplay = `<div className="mt-1.5 flex flex-wrap gap-2">
                            <div className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-green-700 bg-green-50 border border-green-300">
                              CÓD. ARTE: {group.art_code || "N/A"}
                            </div>
                            <div className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-700 bg-white border border-slate-300">
                              CÓD. BASE: {group.sku || "N/A"}
                            </div>
                          </div>`;

content = content.replace(oldDisplay, newDisplay);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed groupedItems in order kanban!');
