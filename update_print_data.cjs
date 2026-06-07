const fs = require('fs');
const path = 'src/routes/_authenticated.pedidos.$id.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace Pedido layout
const pedidoOld = `<p className="text-sm font-bold">e-roupas Confecções LTDA</p>
              <p className="text-xs text-gray-600">CNPJ: 00.000.000/0000-00</p>`;
const pedidoNew = `<p className="text-sm font-bold">e-roupas Confecções LTDA</p>
              <p className="text-xs text-gray-600">CNPJ: 18.288.318/0001-85 | (43) 3357-0809</p>
              <p className="text-xs text-gray-600">Rua Etienne Lenoir, 71 - Industrial - Londrina - PR - CEP 86063-380</p>`;

// Replace Etiqueta layout
const etiquetaOld = `<p className="text-xs font-bold mt-1">e-roupas Confecções LTDA</p>
            <p className="text-[10px] text-gray-600">CNPJ: 00.000.000/0000-00</p>`;
const etiquetaNew = `<p className="text-xs font-bold mt-1">e-roupas Confecções LTDA</p>
            <p className="text-[10px] text-gray-600">CNPJ: 18.288.318/0001-85 | (43) 3357-0809</p>
            <p className="text-[10px] text-gray-600">Rua Etienne Lenoir, 71 - Industrial</p>
            <p className="text-[10px] text-gray-600">Londrina - PR - CEP 86063-380</p>`;

content = content.replace(pedidoOld, pedidoNew);
content = content.replace(etiquetaOld, etiquetaNew);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed address and CNPJ data!');
