const fs = require('fs');

const path = 'src/lib/api/orders.ts';
let content = fs.readFileSync(path, 'utf8');

// Update Order interface
const orderFieldsToInject = `
    corte_faction?: string | null;
    corte_start_date?: string | null;
    corte_end_date?: string | null;
    costura_faction?: string | null;
    costura_start_date?: string | null;
    costura_end_date?: string | null;
`;

if (!content.includes('corte_faction')) {
    content = content.replace(
        /salesperson_name\?:\s*string;/,
        `salesperson_name?: string;\n${orderFieldsToInject}`
    );
}

// Add useDeleteOrder hook
const useDeleteOrderCode = `

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
`;

if (!content.includes('useDeleteOrder')) {
    content += useDeleteOrderCode;
}

fs.writeFileSync(path, content, 'utf8');
console.log('orders.ts updated');
