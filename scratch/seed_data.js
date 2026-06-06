import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Ler arquivo .env manualmente
const envPath = path.resolve(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach(line => {
  const parts = line.split("=");
  if (parts.length === 2) {
    envVars[parts[0].trim()] = parts[1].trim();
  }
});

const supabaseUrl = envVars["VITE_SUPABASE_URL"];
const supabaseAnonKey = envVars["VITE_SUPABASE_ANON_KEY"];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Credenciais do Supabase não encontradas no .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const suppliersList = [
  "Pettenati",
  "Menegotti",
  "Pemgir",
  "E&L",
  "Guimatex",
  "Santa Constancia"
];

const modelsList = [
  "CALÇA DE MOLETOM",
  "BERMUDA DE MOLETOM",
  "CAMISETA REGULAR",
  "CAMISETA OVERSIZED",
  "CAMISETA INFANTIL",
  "BABYLOOK",
  "REGATA FEMININA MACHÃO",
  "REGATA MASCULINA MACHÃO",
  "REGATA MASCULINA NADADOR",
  "REGATA FEMININA NADADOR",
  "CAMISETA MANGA LONGA",
  "CAMISETA RAGLAN",
  "MOLETOM COM CAPUZ E BOLSO CANGURU",
  "MOLETOM COM CAPUZ",
  "MOLETOM GOLA CARECA",
  "POLO MASCULINA",
  "POLO FEMININA",
  "POLO INFANTIL",
  "POLO GOLA PADRE MASCULINA",
  "POLO GOLA PADRE FEMININA",
  "CROPPED INFANTIL",
  "CROPPED FEMININO"
];

const fabricsList = [
  "100% ALGODÃO FIO 30.1 PENTEADO",
  "100% ALGODÃO FIO 26.1 PENTEADO",
  "100% ALGODÃO EGÍPCIO",
  "100% ALGODÃO PIMA PERUANO",
  "100% ALGODÃO SUEDINE EGÍPCIO",
  "67% POLIESTER 33% VISCOSE (PV)",
  "67% POLIESTER 33% ALGODÃO (PIQUET PA)",
  "50% POLIESTER 50% ALGODÃO (PA ANTIPILLING)",
  "50% POLIESTER 50% ALGODÃO (MOLETOM SEM FELPA)",
  "58% POLIESTER 42% ALGODÃO (MOLETOM COM FELPA)"
];

const customizationsList = [
  "DTF FRENTE",
  "DTF COSTAS",
  "DTF MANGA ESQUERDA",
  "DTF MANGA DIREITA",
  "DTF BARRA FRENTE",
  "DTF BARRA COSTAS",
  "DTF PEITO ESQUERDO",
  "DTF PEITO DIREITO",
  "ETIQUETA INTERNA",
  "NUCA",
  "SILK FRENTE",
  "SILK COSTAS",
  "SILK MANGA ESQUERDA",
  "SILK MANGA DIREITA",
  "SILK BARRA FRENTE",
  "SILK BARRA COSTAS",
  "SILK PEITO ESQUERDO",
  "SILK PEITO DIREITO",
  "BORDADO FRENTE",
  "BORDADO COSTAS",
  "BORDADO MANGA ESQUERDA",
  "BORDADO MANGA DIREITA",
  "BORDADO BARRA FRENTE",
  "BORDADO BARRA COSTAS",
  "BORDADO PEITO ESQUERDO",
  "BORDADO PEITO DIREITO",
  "SUBLIMAÇÃO FRENTE",
  "SUBLIMAÇÃO COSTAS",
  "SUBLIMAÇÃO MANGA DIREITA",
  "SUBLIMAÇÃO MANGA ESQUERDA",
  "SUBLIMAÇÃO TOTAL"
];

async function seed() {
  console.log("Iniciando seed de dados...");

  // 1. Cadastrar Fornecedores
  console.log("Processando fornecedores...");
  const { data: existingSuppliers } = await supabase.from("suppliers").select("name");
  const existingSuppliersSet = new Set((existingSuppliers || []).map(s => s.name.toLowerCase()));
  const suppliersToInsert = suppliersList
    .filter(name => !existingSuppliersSet.has(name.toLowerCase()))
    .map(name => ({ name, lead_time_days: 0, active: true }));

  if (suppliersToInsert.length > 0) {
    const { error } = await supabase.from("suppliers").insert(suppliersToInsert);
    if (error) console.error("Erro ao inserir fornecedores:", error.message);
    else console.log(`${suppliersToInsert.length} fornecedores inseridos.`);
  } else {
    console.log("Todos os fornecedores já cadastrados.");
  }

  // 2. Cadastrar Modelagens
  console.log("Processando modelagens...");
  const { data: existingModels } = await supabase.from("product_models").select("name");
  const existingModelsSet = new Set((existingModels || []).map(m => m.name.toLowerCase()));
  const modelsToInsert = modelsList
    .filter(name => !existingModelsSet.has(name.toLowerCase()))
    .map(name => ({ name, active: true }));

  if (modelsToInsert.length > 0) {
    const { error } = await supabase.from("product_models").insert(modelsToInsert);
    if (error) console.error("Erro ao inserir modelagens:", error.message);
    else console.log(`${modelsToInsert.length} modelagens inseridas.`);
  } else {
    console.log("Todas as modelagens já cadastradas.");
  }

  // 3. Cadastrar Malhas
  console.log("Processando malhas...");
  const { data: existingFabrics } = await supabase.from("fabrics").select("name");
  const existingFabricsSet = new Set((existingFabrics || []).map(f => f.name.toLowerCase()));
  const fabricsToInsert = fabricsList
    .filter(name => !existingFabricsSet.has(name.toLowerCase()))
    .map(name => ({
      name,
      supports_dtf: true,
      supports_silk: true,
      supports_embroidery: true,
      supports_sublimation: true,
      active: true
    }));

  if (fabricsToInsert.length > 0) {
    const { error } = await supabase.from("fabrics").insert(fabricsToInsert);
    if (error) console.error("Erro ao inserir malhas:", error.message);
    else console.log(`${fabricsToInsert.length} malhas inseridas.`);
  } else {
    console.log("Todas as malhas já cadastradas.");
  }

  // 4. Cadastrar Personalizações como produtos do tipo "Serviço"
  console.log("Processando personalizações...");
  const { data: existingProducts } = await supabase.from("products").select("name");
  const existingProductsSet = new Set((existingProducts || []).map(p => p.name.toLowerCase()));
  const customizationsToInsert = customizationsList
    .filter(name => !existingProductsSet.has(name.toLowerCase()))
    .map(name => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return {
        name,
        sku: `PERS-${slug.toUpperCase()}`,
        price: 0,
        cost_price: 0,
        format: "Serviço",
        unit: "UN",
        active: true
      };
    });

  if (customizationsToInsert.length > 0) {
    const { error } = await supabase.from("products").insert(customizationsToInsert);
    if (error) console.error("Erro ao inserir personalizações:", error.message);
    else console.log(`${customizationsToInsert.length} personalizações inseridas.`);
  } else {
    console.log("Todas as personalizações já cadastradas.");
  }

  console.log("Seed de dados concluído com sucesso!");
}

seed().catch(console.error);
