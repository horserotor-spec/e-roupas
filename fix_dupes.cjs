const fs = require('fs');
const path = 'src/routes/_authenticated.pedidos.novo.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /    status: "confirmado",\n    salesperson_id: "",\n    seller_id: "",\n    items: \[\],/,
  `    status: "confirmado",\n    items: [],`
);

fs.writeFileSync(path, content);
console.log('Fixed dupes');
