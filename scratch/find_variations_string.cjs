const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/Users/Usuario/.antigravity/Project/e-roupas/src');

const targets = ['"Com Variação"', "'Com Variação'", '"Simples"', "'Simples'"];

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    targets.forEach(target => {
      if (content.includes(target)) {
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes(target)) {
            console.log(`${file}:${idx + 1}: ${line.trim()}`);
          }
        });
      }
    });
  } catch (err) {
    // ignore
  }
});
