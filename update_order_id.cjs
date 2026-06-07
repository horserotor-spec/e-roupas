const fs = require('fs');

const path = 'src/routes/_authenticated.pedidos.$orderId.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Imports
if (!content.includes('useDeleteOrder')) {
  content = content.replace('useUpdateOrder, ', 'useUpdateOrder, useDeleteOrder, ');
}
if (!content.includes('useNavigate')) {
  content = content.replace('useParams', 'useParams, useNavigate'); // wait, the file imports from "@tanstack/react-router"
  content = content.replace('import { createFileRoute, Link, notFound }', 'import { createFileRoute, Link, notFound, useNavigate }');
}
if (!content.includes('Trash2')) {
  content = content.replace('ArrowLeft, ', 'ArrowLeft, Trash2, ');
}
if (!content.includes('AlertDialog')) {
  const alertDialogImport = `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";\n`;
  content = content.replace('import { Select, ', alertDialogImport + 'import { Select, ');
}

// 2. Hooks inside OrderPage
const hooksInsertion = `  const { data: timeline = [], isLoading: isLoadingTimeline } = useOrderTimeline(orderId);
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const navigate = useNavigate();`;
content = content.replace(
  /const { data: timeline = \[\], isLoading: isLoadingTimeline } = useOrderTimeline\(orderId\);\s*const updateOrder = useUpdateOrder\(\);/,
  hooksInsertion
);

// 3. The delete button inside the header
const headerRightSide = `<div className="flex items-center gap-4">`;
const headerRightSideReplacement = `<div className="flex items-center gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                  <Trash2 className="size-4 mr-1.5" /> Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Pedido</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir este pedido e todos os seus itens? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={async () => {
                    try {
                      await deleteOrder.mutateAsync(order.id);
                      toast.success("Pedido excluído com sucesso!");
                      navigate({ to: "/pedidos" });
                    } catch (e: any) {
                      toast.error("Erro ao excluir: " + e.message);
                    }
                  }}>
                    Sim, excluir pedido
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>`;

if (!content.includes('AlertDialogTrigger')) {
    content = content.replace(headerRightSide, headerRightSideReplacement);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
