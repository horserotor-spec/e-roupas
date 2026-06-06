const fs = require('fs');
const file = 'c:\\Users\\Usuario\\.antigravity\\Project\\e-roupas\\src\\routes\\_authenticated.pedidos.$id.tsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('status') || line.includes('confirmado') || line.includes('confirm')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
