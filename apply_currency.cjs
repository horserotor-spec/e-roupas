const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Find patterns like: R$ {variable} or R$ {variable.toFixed(2)} or R$ {Number(variable).toLocaleString(...)}
  // Because the expressions can be complex, let's just do a simple regex for the most common ones:
  // 1. R$ {variable}
  // 2. R$ {variable.toFixed(2)}
  // 3. - R$ {variable}
  // 4. + R$ {variable}

  // To be safe, we'll replace:
  // /R\$\s*\{([^}]+)\}/g
  // However, some might be: R$ {val.toLocaleString(...)}
  // We will replace them with {formatCurrency($1)}
  
  let matchFound = false;

  // Regex for `R$ {expression}` ignoring ones that already have formatCurrency
  const regex = /(?:\+ |- |)R\$\s*\{([^}]+)\}/g;
  
  content = content.replace(regex, (match, p1) => {
    if (p1.includes('formatCurrency')) return match; // Already formatted
    matchFound = true;
    
    // Check if it has a prefix like "+ " or "- "
    let prefix = "";
    if (match.startsWith("+ ")) prefix = "+ ";
    if (match.startsWith("- ")) prefix = "- ";
    
    // If it's already using toLocaleString, strip it to avoid double formatting
    let cleanVar = p1;
    if (cleanVar.includes('.toLocaleString(')) {
        cleanVar = cleanVar.replace(/\.toLocaleString\([^)]*\)/g, '');
    }
    if (cleanVar.includes('.toFixed(2)')) {
        cleanVar = cleanVar.replace(/\.toFixed\(2\)/g, '');
    }

    return `${prefix}{formatCurrency(${cleanVar})}`;
  });

  // Regex for static R$ 0.00 or R$ 0 -> {formatCurrency(0)}
  const staticRegex = /(?:\+ |- |)R\$\s*([0-9.,]+)(?!\s*\{)/g;
  content = content.replace(staticRegex, (match, p1) => {
      // Avoid matching inside strings or existing JSX
      if (match.includes('{')) return match;
      matchFound = true;
      let prefix = "";
      if (match.startsWith("+ ")) prefix = "+ ";
      if (match.startsWith("- ")) prefix = "- ";
      let numStr = p1.replace(',', '.');
      return `${prefix}{formatCurrency(${numStr})}`;
  });

  if (matchFound) {
    if (!content.includes('formatCurrency')) {
        // Find last import
        const importMatch = content.match(/^import .*;$/m);
        if (importMatch) {
            content = content.replace(
                /^import .*;$/m,
                match => match + '\nimport { formatCurrency } from "@/lib/utils";'
            );
        } else {
            content = 'import { formatCurrency } from "@/lib/utils";\n' + content;
        }
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      processFile(p);
    }
  }
}

walk('src/routes');
walk('src/components');
console.log('Format currency script finished.');
