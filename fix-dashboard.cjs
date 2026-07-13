const fs = require('fs');
const path = 'src/routes/_authenticated.estoque.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('function DashboardTab() {', 'function DashboardTab({ onNavigate }: { onNavigate: (tabId: string) => void }) {');
content = content.replace('{activeTab === "dashboard" && <DashboardTab />}', '{activeTab === "dashboard" && <DashboardTab onNavigate={setActiveTab} />}');

content = content.replace(
  /<div className="bg-white border rounded-xl p-5 shadow-sm">\s*<div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Baixo Estoque/g,
  '<div onClick={() => onNavigate("lotes")} className="bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:border-amber-400 hover:shadow-md transition-all">\n            <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Baixo Estoque'
);

content = content.replace(
  /<div className="bg-white border rounded-xl p-5 shadow-sm">\s*<div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Ruptura/g,
  '<div onClick={() => onNavigate("lotes")} className="bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:border-red-400 hover:shadow-md transition-all">\n            <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Ruptura'
);

content = content.replace(
  /<div className="bg-white border rounded-xl p-5 shadow-sm">\s*<div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Estoque Reservado/g,
  '<div onClick={() => onNavigate("lotes")} className="bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all">\n            <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Estoque Reservado'
);

content = content.replace(
  /<div className="bg-white border rounded-xl p-5 shadow-sm">\s*<div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Variantes Ativas/g,
  '<div onClick={() => onNavigate("variantes")} className="bg-white border rounded-xl p-5 shadow-sm cursor-pointer hover:border-slate-400 hover:shadow-md transition-all">\n            <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">Variantes Ativas'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Success');
