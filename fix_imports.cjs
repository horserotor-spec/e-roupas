const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Fix duplicate imports
  let lines = content.split('\n');
  let filteredLines = [];
  let foundUseClients = false;

  for (let line of lines) {
    if (line.includes('import { useClients } from "@/lib/api/clients";') || 
        line.includes('import { useClients, useBrands } from "@/lib/api/clients";')) {
      if (!foundUseClients) {
        filteredLines.push('import { useClients, useBrands } from "@/lib/api/clients";');
        foundUseClients = true;
      }
    } else {
      filteredLines.push(line);
    }
  }

  fs.writeFileSync(path, filteredLines.join('\n'), 'utf8');
  console.log('Fixed imports in', path);
}

processFile('src/routes/_authenticated.pedidos.novo.tsx');
processFile('src/routes/_authenticated.pedidos.$id.tsx');
