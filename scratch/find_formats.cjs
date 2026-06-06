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
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.sql')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/Users/Usuario/.antigravity/Project/e-roupas');

const targetWord = 'format';

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.toLowerCase().includes(targetWord)) {
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes(targetWord)) {
          console.log(`${file}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  } catch (err) {
    // ignore
  }
});
