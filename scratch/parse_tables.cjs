const fs = require('fs');

const content = fs.readFileSync('c:/Users/Usuario/.antigravity/Project/e-roupas/supabase/schema.sql', 'utf8');

const tableRegex = /CREATE TABLE (?:IF NOT EXISTS )?([\w.]+)\s*\(([\s\S]*?)\);/g;
let match;
while ((match = tableRegex.exec(content)) !== null) {
  const tableName = match[1];
  const columns = match[2]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('--'))
    .slice(0, 5) // Mostra as primeiras 5 colunas
    .join(', ');
  console.log(`Table: ${tableName} (${columns} ...)`);
}
