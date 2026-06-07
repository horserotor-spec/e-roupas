const fs = require('fs');
const path = 'src/routes/__root.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('import { Toaster } from "@/components/ui/sonner"')) {
  content = content.replace(
    /import \{ AuthProvider \} from "\.\.\/lib\/auth";/,
    'import { AuthProvider } from "../lib/auth";\nimport { Toaster } from "@/components/ui/sonner";'
  );
  
  content = content.replace(
    /<Outlet \/>/,
    '<Outlet />\n          <Toaster />'
  );
  
  fs.writeFileSync(path, content);
  console.log('Added Toaster to __root.tsx');
} else {
  console.log('Toaster already exists');
}
