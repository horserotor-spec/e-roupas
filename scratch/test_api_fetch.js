import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Função simples para ler .env manualmente
function parseEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  content.split("\n").forEach(line => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim().replace(/(^['"]|['"]$)/g, "");
      env[key] = val;
    }
  });
  return env;
}

const env = parseEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas no arquivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  console.log("=== TESTANDO CONEXÃO E TABELAS DE SUGESTÕES ===");

  const { data: models, error: errModels } = await supabase.from("product_models").select("*").limit(5);
  console.log("product_models:", errModels ? `Erro: ${errModels.message}` : `${models ? models.length : 0} registros encontrados`, models);

  const { data: fabrics, error: errFabrics } = await supabase.from("fabrics").select("*").limit(5);
  console.log("fabrics:", errFabrics ? `Erro: ${errFabrics.message}` : `${fabrics ? fabrics.length : 0} registros encontrados`, fabrics);

  const { data: colors, error: errColors } = await supabase.from("canonical_colors").select("*").limit(5);
  console.log("canonical_colors:", errColors ? `Erro: ${errColors.message}` : `${colors ? colors.length : 0} registros encontrados`, colors);

  const { data: suppliers, error: errSuppliers } = await supabase.from("suppliers").select("*").limit(5);
  console.log("suppliers:", errSuppliers ? `Erro: ${errSuppliers.message}` : `${suppliers ? suppliers.length : 0} registros encontrados`, suppliers);

  console.log("\n=== TESTANDO QUERY DE PRODUTOS COM JOIN ===");
  const { data: products, error: errProducts } = await supabase
    .from("products")
    .select(`
      id,
      name,
      sku,
      model_id,
      models:product_models(name),
      fabrics(name),
      canonical_colors(name)
    `)
    .limit(5);

  if (errProducts) {
    console.error("Erro na query de products:", errProducts.message, errProducts.details);
  } else {
    console.log(`products: ${products ? products.length : 0} registros encontrados`);
    if (products) {
      products.forEach(p => {
        console.log(`- Produto: ${p.name} (SKU: ${p.sku})`);
        console.log(`  Modelagem vinculada (model_id): ${p.model_id}`);
        console.log(`  Model:`, p.models);
        console.log(`  Fabric:`, p.fabrics);
        console.log(`  Color:`, p.canonical_colors);
      });
    }
  }
}

testFetch();
