const fs = require('fs');
const path = 'src/routes/_authenticated.pedidos.$id.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /<span className="font-bold text-purple-900">Calculada automaticamente<\/span>/,
  '<span className="font-bold text-purple-900">{new Intl.NumberFormat(\'pt-BR\', { style: \'currency\', currency: \'BRL\' }).format(formData.commissions_total || 0)}</span>'
);

fs.writeFileSync(path, content);
console.log('Fixed commission display');
