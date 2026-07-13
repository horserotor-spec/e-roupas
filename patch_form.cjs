const fs = require('fs');
let content = fs.readFileSync('src/components/products/ProductFormDrawer.tsx', 'utf8');

// 1. Add minStockGrid state
content = content.replace(
  'const [initialStockGrid, setInitialStockGrid] = useState<Record<string, number>>({});',
  'const [initialStockGrid, setInitialStockGrid] = useState<Record<string, number>>({});\n  const [minStockGrid, setMinStockGrid] = useState<Record<string, number>>({});'
);

// 2. Clear state on close
content = content.replace(
  'setInitialStockGrid({});',
  'setInitialStockGrid({});\n        setMinStockGrid({});'
);

// 3. Pass to mutation
content = content.replace(
  'grid: initialStockGrid',
  'grid: initialStockGrid,\n            minStockGrid: minStockGrid'
);

// 4. Remove min_stock and max_stock from formData initialization
content = content.replace(
  'min_stock: 0,\n      max_stock: 0,',
  ''
);
content = content.replace(
  'min_stock: product.min_stock || 0,\n            max_stock: product.max_stock || 0,',
  ''
);
content = content.replace(
  'min_stock: 0,\n            max_stock: 0,',
  ''
);

fs.writeFileSync('src/components/products/ProductFormDrawer.tsx', content);
