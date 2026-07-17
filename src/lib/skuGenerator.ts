import { SkuRule } from "./api/skuRules";

interface SkuContext {
  format: string; // "MP", "PA", "PF"
  modelName?: string | null;
  fabricName?: string | null;
  colorName?: string | null;
  modelCode?: string | null;
  fabricCode?: string | null;
  colorCode?: string | null;
  artCode?: string | null; // Para PF
}

export function generateSku(context: SkuContext, rules: SkuRule[]): string {
  // Encontra as abreviações correspondentes, com fallback de pegar as 3 primeiras consoantes/letras
  const getAbbr = (type: SkuRule['rule_type'], name: string | null | undefined, code: string | null | undefined): string => {
    if (code) return code.toUpperCase();
    if (!name) return "XXX";
    const rule = rules.find(r => r.rule_type === type && r.name === name);
    if (rule) return rule.abbreviation;
    
    // Fallback: pega 3 primeiras consoantes ou 3 primeiras letras
    const consonants = name.replace(/[^A-Za-z]/g, '').replace(/[aeiouAEIOU]/g, '').toUpperCase();
    return (consonants.length >= 3 ? consonants : name.replace(/[^A-Za-z]/g, '').toUpperCase()).slice(0, 3).padEnd(3, 'X');
  };

  const { format, modelName, fabricName, colorName, modelCode, fabricCode, colorCode, artCode } = context;

  if (format === "PF") {
    // PF = [ARTE]-[PA] = [ARTE]-PA-MOD-MAL-COR
    const paCode = `PA-${getAbbr('model', modelName, modelCode)}-${getAbbr('fabric', fabricName, fabricCode)}-${getAbbr('color', colorName, colorCode)}`;
    return `${artCode || 'ARTEXXX'}-${paCode}`;
  }

  if (format === "MP" || format === "PA") {
    // MP-MOD-MAL-COR ou PA-MOD-MAL-COR
    return `${format}-${getAbbr('model', modelName, modelCode)}-${getAbbr('fabric', fabricName, fabricCode)}-${getAbbr('color', colorName, colorCode)}`;
  }

  // Insumo ou Serviço podem ter formatos livres ou manter o SKU atual
  return "";
}

export function generateTechnicalName(context: SkuContext): string {
  const { format, modelName, fabricName, colorName } = context;
  
  if (format !== "MP" && format !== "PA" && format !== "PF") {
    return "";
  }

  // Ex: "Camiseta Regular Poliamida E&L Preto"
  // Nós assumimos que "Camiseta Regular" é o modelName. 
  // Na verdade o modelName na aplicação vem de ProductModels, que costuma ter "Camiseta Regular" ou apenas "Regular".
  const parts = [];
  if (modelName) parts.push(modelName);
  if (fabricName) parts.push(fabricName);
  if (colorName) parts.push(colorName);
  
  return parts.join(" ");
}
