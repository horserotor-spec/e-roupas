const fs = require('fs');
let content = fs.readFileSync('src/components/inventory/MovementModal.tsx', 'utf8');

// Update isExit logic
content = content.replace(
  'const isExit = movementType === "ajuste_saida" || movementType === "perda";',
  'const isExit = movementType === "ajuste_saida" || movementType === "perda" || movementType === "excluir_produto";'
);

// Add movement_type to mutation
content = content.replace(
  'adjustment: adjustAmount,\n          reason: ${movementType.toUpperCase()}: ',
  'adjustment: adjustAmount,\n          reason: reason,\n          movement_type: movementType'
);

// Add options to SelectContent
content = content.replace(
  '<SelectItem value="ajuste_entrada">Entrada (Ajuste)</SelectItem>',
  '<SelectItem value="inserir_produto">Inserir Produto</SelectItem>\n                    <SelectItem value="ajuste_entrada">Entrada (Ajuste)</SelectItem>'
);

content = content.replace(
  '<SelectItem value="transferencia">Transferência Interna</SelectItem>',
  '<SelectItem value="transferencia">Transferência Interna</SelectItem>\n                    <SelectItem value="excluir_produto">Excluir Produto</SelectItem>'
);

fs.writeFileSync('src/components/inventory/MovementModal.tsx', content);
