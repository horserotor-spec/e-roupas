/**
 * Formata o nome de exibição de um produto.
 * Dá prioridade ao Nome Técnico (technical_name) se preenchido e, caso contrário,
 * remove o prefixo indicativo "Matéria Prima" ou "Materia Prima" do nome principal.
 */
export function getProductDisplayName(product: { name: string; technical_name?: string | null }): string {
  if (product.technical_name && product.technical_name.trim() !== "") {
    return product.technical_name;
  }
  
  // Regex para capturar e remover "Matéria Prima" ou "Materia Prima" com ou sem hífen no início do nome
  return product.name.replace(/^(Mat[eé]ria[ -]Prima|MATERIA[ -]PRIMA)\s*/i, "");
}
