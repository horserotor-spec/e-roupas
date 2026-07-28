import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { useOrders, Order, useUpdateOrder } from "@/lib/api/orders";
import { useClients } from "@/lib/api/clients";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Save, X, Plus, Trash2, FileText, Loader2, ArrowRight, Printer } from "lucide-react";
import { toast } from "sonner";

const ADULTO_SIZES = ["PP", "P", "M", "G", "GG", "XG", "G1", "G2", "G3", "G4"];
const INFANTIL_SIZES = ["2", "4", "6", "8", "10", "12", "14", "16"];

const COLOR_CODES: Record<string, string> = {
  "branco": "100",
  "natural": "101",
  "off white": "101",
  "off-white": "101",
  "verde agua": "102",
  "verde água": "102",
  "celeste": "103",
  "cinza claro": "105",
  "areia": "106",
  "lilás": "107",
  "lilas": "107",
  "rosa bb": "108",
  "creme": "109",
  "salmão": "114",
  "salmao": "114",
  "marinho": "201",
  "preto": "202",
  "limão": "203",
  "limao": "203",
  "seleção": "204",
  "selecao": "204",
  "chumbo": "206",
  "laranja": "207",
  "pink": "210",
  "barbie": "213",
  "ocre": "214",
  "royal": "301",
  "vermelho": "302",
  "bandeira": "303",
  "musgo": "304",
  "militar": "306",
  "turquesa": "307",
  "vinho": "308",
  "petróleo": "309",
  "petroleo": "309",
  "marrom": "310",
  "pitanga": "311",
  "jade": "312",
  "caramelo": "313",
  "roxo": "315",
  "botonê": "1101",
  "botone": "1101",
  "cinza mescla": "1001",
  "bananinha": "1100",
  "marinho mescla": "2011",
  "preto mescla": "2021",
};

const formatColorWithCode = (name: string, defaultCode?: string) => {
  if (!name) return "";
  const code = COLOR_CODES[name.toLowerCase()] || defaultCode;
  return `${name} ${code ? `(COD. ${code})` : ""}`;
};

interface GridRow {
  id: string;
  cor: string;
  kg: number | string;
  modelo: string;
  quantities: Record<string, number>;
  activeSizes?: string[];
}

interface CorteCosturaSheet {
  isCorte: boolean;
  isCostura: boolean;
  dataEntrada: string;
  entregaPrevista: string;
  malha: string;
  empresa: string;
  corteFaccao: string;
  costuraFaccao: string;
  molde: string;
  modelo: string;
  ribana: string;
  ribanaWidth: string;
  cobreGola: string;
  cobreGolaWidth: string;
  debrum: string;
  debrumWidth: string;
  pedido: string;
  responsavelPedido: string;
  telefoneContato: string;
  pedidoExato: boolean;
  cortarTudo: boolean;
  retiradoPor: string;
  aPagarCorte: number;
  aPagarCostura: number;
  gradePedido: GridRow[];
  rendimentoCorte: GridRow[];
  rendimentoCorteEntrada: string;
  rendimentoCorteEntrega: string;
  quantidadeCosturada: GridRow[];
  quantidadeCosturadaEntrada: string;
  quantidadeCosturadaEntrega: string;
  observacaoGradePedido?: string;
}

const defaultSheet = (): CorteCosturaSheet => ({
  isCorte: true,
  isCostura: true,
  dataEntrada: "",
  entregaPrevista: "",
  malha: "",
  empresa: "",
  corteFaccao: "",
  costuraFaccao: "",
  molde: "",
  modelo: "",
  ribana: "",
  ribanaWidth: "",
  cobreGola: "",
  cobreGolaWidth: "",
  debrum: "",
  debrumWidth: "",
  pedido: "",
  responsavelPedido: "",
  telefoneContato: "",
  pedidoExato: false,
  cortarTudo: false,
  retiradoPor: "",
  aPagarCorte: 0,
  aPagarCostura: 0,
  gradePedido: [],
  rendimentoCorte: [],
  rendimentoCorteEntrada: "",
  rendimentoCorteEntrega: "",
  quantidadeCosturada: [],
  quantidadeCosturadaEntrada: "",
  quantidadeCosturadaEntrega: "",
  observacaoGradePedido: "",
});

const syncTableRows = (source: GridRow[], target: GridRow[]): GridRow[] => {
  return source.map(srcRow => {
    const existingTargetRow = target.find(t => t.id === srcRow.id);
    return {
      id: srcRow.id,
      cor: srcRow.cor,
      kg: srcRow.kg,
      modelo: srcRow.modelo,
      activeSizes: srcRow.activeSizes || [],
      quantities: existingTargetRow ? existingTargetRow.quantities : {},
    };
  });
};

export function CorteCosturaTab() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading: isLoadingOrders } = useOrders();
  const { data: clients = [] } = useClients();
  const suppliers = clients.filter(c => c.entity_type === "fornecedor");
  const updateOrder = useUpdateOrder();

  const [activeMode, setActiveMode] = useState<"pedido" | "reposicao">("pedido");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // List filter states
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Form sheet state
  const [sheet, setSheet] = useState<CorteCosturaSheet>(defaultSheet());
  const [isSaving, setIsSaving] = useState(false);

  // Queries for DB autocomplete
  const { data: models = [] } = useQuery({
    queryKey: ["product_models"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_models").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data || [];
    }
  });

  const { data: fabrics = [] } = useQuery({
    queryKey: ["fabrics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fabrics").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data || [];
    }
  });

  const { data: colors = [] } = useQuery({
    queryKey: ["canonical_colors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("canonical_colors").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data || [];
    }
  });

  // Query for CMV configurations
  const { data: cmvCosts = {} } = useQuery({
    queryKey: ["cmv_costs_config"],
    queryFn: async () => {
      const { data } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "cmv_costs_config")
        .maybeSingle();
      return data?.value || {};
    }
  });

  // Cost calculator helper
  const getCostForModel = (type: "corte" | "costura", modelName: string) => {
    if (!modelName) return 0;
    const cleanModel = modelName.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // 1. Exact match: type + clean model name, e.g. "corteoversized"
    for (const [key, val] of Object.entries(cmvCosts)) {
      const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleanKey === `${type}${cleanModel}`) {
        return Number(val) || 0;
      }
    }
    // 2. Contains match: key starts with type and contains model name
    for (const [key, val] of Object.entries(cmvCosts)) {
      const keyLower = key.toLowerCase();
      if (keyLower.startsWith(type) && keyLower.includes(cleanModel)) {
        return Number(val) || 0;
      }
    }
    // 3. Fallback to general type name, e.g. "corte" or "costura" or "corte_default"
    for (const [key, val] of Object.entries(cmvCosts)) {
      const keyLower = key.toLowerCase();
      if (keyLower === type || keyLower === `${type}_default` || keyLower === `${type}default` || keyLower === `${type}_peca`) {
        return Number(val) || 0;
      }
    }
    return 0;
  };

  const selectedOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  // Load sheet from order notes if present, otherwise set basic details
  useEffect(() => {
    if (activeMode === "pedido" && selectedOrder) {
      let loadedSheet: CorteCosturaSheet | null = null;
      if (selectedOrder.internal_notes) {
        try {
          if (selectedOrder.internal_notes.trim().startsWith("{")) {
            loadedSheet = JSON.parse(selectedOrder.internal_notes);
            // Backward compatibility: map old 'rolos' to 'kg' if present
            if (loadedSheet && loadedSheet.gradePedido) {
              loadedSheet.gradePedido = loadedSheet.gradePedido.map(r => ({
                ...r,
                kg: r.kg !== undefined ? r.kg : (r as any).rolos !== undefined ? (r as any).rolos : "",
              }));
            }
            // Backward compatibility: map old aPagar to aPagarCorte
            if (loadedSheet && (loadedSheet as any).aPagar !== undefined && loadedSheet.aPagarCorte === undefined) {
              loadedSheet.aPagarCorte = (loadedSheet as any).aPagar;
            }
          }
        } catch (e) {
          console.warn("Notes are not JSON format:", selectedOrder.internal_notes);
        }
      }
      
      if (loadedSheet && loadedSheet.gradePedido) {
        // Guarantee sync of rendimento and costura tables
        loadedSheet.rendimentoCorte = syncTableRows(loadedSheet.gradePedido, loadedSheet.rendimentoCorte || []);
        loadedSheet.quantidadeCosturada = syncTableRows(loadedSheet.gradePedido, loadedSheet.quantidadeCosturada || []);
        setSheet(loadedSheet);
      } else {
        // No sheet saved yet: automatically load from order items in production DB!
        const fresh = defaultSheet();
        fresh.pedido = selectedOrder.code;

        if (selectedOrder.items && selectedOrder.items.length > 0) {
          // Group items by (model, color)
          const groups: Record<string, { model: string; color: string; quantities: Record<string, number>; activeSizes: string[] }> = {};
          
          selectedOrder.items.forEach(item => {
            const modelName = item.model || selectedOrder.items[0]?.product_name?.split(" - ")[0] || "";
            const colorName = item.color || "";
            const size = item.size || "";
            const qty = item.quantity || 0;
            
            const key = `${modelName}||${colorName}`;
            if (!groups[key]) {
              groups[key] = {
                model: modelName,
                color: colorName,
                quantities: {},
                activeSizes: []
              };
            }
            
            groups[key].quantities[size] = (groups[key].quantities[size] || 0) + qty;
            if (size && !groups[key].activeSizes.includes(size)) {
              groups[key].activeSizes.push(size);
            }
          });
          
          const gradePedidoRows: GridRow[] = Object.values(groups).map(g => ({
            id: Math.random().toString(36).substring(7),
            cor: g.color,
            kg: "",
            modelo: g.model,
            quantities: g.quantities,
            activeSizes: g.activeSizes.length > 0 ? g.activeSizes : ["P", "M", "G", "GG"],
          }));
          
          fresh.gradePedido = gradePedidoRows;
          fresh.rendimentoCorte = syncTableRows(gradePedidoRows, []);
          fresh.quantidadeCosturada = syncTableRows(gradePedidoRows, []);
          
          // Set first model as default sheet model if exists
          if (gradePedidoRows[0]?.modelo) {
            fresh.modelo = gradePedidoRows[0].modelo;
            // Pre-fill Ribana sizes
            const lower = fresh.modelo.toLowerCase();
            if (lower.includes("oversized")) {
              fresh.ribana = "6.5";
              fresh.ribanaWidth = "2.5";
            } else {
              fresh.ribana = "4";
              fresh.ribanaWidth = "1.5";
            }
          }
        }

        setSheet(fresh);
      }
    } else if (activeMode === "reposicao") {
      setSheet(defaultSheet());
    }
  }, [selectedOrder, activeMode]);

  // Recalculate A Pagar values automatically whenever quantities or costs configuration change
  useEffect(() => {
    if (!cmvCosts || Object.keys(cmvCosts).length === 0) return;

    let calculatedCorte = 0;
    sheet.rendimentoCorte.forEach(row => {
      const totalPecas = getRowTotal(row);
      const costPerPiece = getCostForModel("corte", row.modelo || sheet.modelo);
      calculatedCorte += totalPecas * costPerPiece;
    });

    let calculatedCostura = 0;
    sheet.quantidadeCosturada.forEach(row => {
      const totalPecas = getRowTotal(row);
      const costPerPiece = getCostForModel("costura", row.modelo || sheet.modelo);
      calculatedCostura += totalPecas * costPerPiece;
    });

    setSheet(prev => {
      const finalCorte = Math.round(calculatedCorte * 100) / 100;
      const finalCostura = Math.round(calculatedCostura * 100) / 100;

      if (prev.aPagarCorte !== finalCorte || prev.aPagarCostura !== finalCostura) {
        return {
          ...prev,
          aPagarCorte: finalCorte,
          aPagarCostura: finalCostura
        };
      }
      return prev;
    });
  }, [sheet.rendimentoCorte, sheet.quantidadeCosturada, cmvCosts, sheet.modelo]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = deferredSearchQuery === "" ||
        o.code.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
        o.client_name.toLowerCase().includes(deferredSearchQuery.toLowerCase());
      
      // Don't show replenishment orders in client order select list
      const isClientOrder = o.client_name !== "REPOSIÇÃO DE ESTOQUE";
      return matchesSearch && isClientOrder;
    });
  }, [orders, deferredSearchQuery]);

  // Grid Row manipulation
  const addGridRow = (target: "gradePedido" | "rendimentoCorte" | "quantidadeCosturada") => {
    const isInf = sheet.modelo?.toLowerCase().includes("infantil");
    const defaultSizes = isInf
      ? ["2", "4", "6", "8", "10"]
      : ["P", "M", "G", "GG"];

    const newRow: GridRow = {
      id: Math.random().toString(36).substring(7),
      cor: "",
      kg: "",
      modelo: sheet.modelo || "",
      quantities: {},
      activeSizes: defaultSizes,
    };
    setSheet(prev => {
      const updatedGrade = [...prev.gradePedido, newRow];
      const updatedRendimento = syncTableRows(updatedGrade, prev.rendimentoCorte);
      const updatedQuantidade = syncTableRows(updatedGrade, prev.quantidadeCosturada);
      return {
        ...prev,
        gradePedido: updatedGrade,
        rendimentoCorte: updatedRendimento,
        quantidadeCosturada: updatedQuantidade,
      };
    });
  };

  const removeGridRow = (target: "gradePedido" | "rendimentoCorte" | "quantidadeCosturada", id: string) => {
    setSheet(prev => {
      const updatedGrade = prev.gradePedido.filter(r => r.id !== id);
      const updatedRendimento = syncTableRows(updatedGrade, prev.rendimentoCorte);
      const updatedQuantidade = syncTableRows(updatedGrade, prev.quantidadeCosturada);
      return {
        ...prev,
        gradePedido: updatedGrade,
        rendimentoCorte: updatedRendimento,
        quantidadeCosturada: updatedQuantidade,
      };
    });
  };

  const updateRowField = (
    target: "gradePedido" | "rendimentoCorte" | "quantidadeCosturada",
    id: string,
    field: "cor" | "kg" | "modelo",
    value: any
  ) => {
    setSheet(prev => {
      const updatedGrade = prev.gradePedido.map(r => {
        if (r.id === id) {
          const isInf = field === "modelo" ? value.toLowerCase().includes("infantil") : r.modelo?.toLowerCase().includes("infantil");
          const defaultSizes = isInf
            ? ["2", "4", "6", "8", "10"]
            : ["P", "M", "G", "GG"];
          return {
            ...r,
            [field]: value,
            ...(field === "modelo" && { activeSizes: defaultSizes }),
          };
        }
        return r;
      });
      const updatedRendimento = syncTableRows(updatedGrade, prev.rendimentoCorte);
      const updatedQuantidade = syncTableRows(updatedGrade, prev.quantidadeCosturada);
      return {
        ...prev,
        gradePedido: updatedGrade,
        rendimentoCorte: updatedRendimento,
        quantidadeCosturada: updatedQuantidade,
      };
    });
  };

  const addRowSize = (rowId: string, size: string) => {
    setSheet(prev => {
      const updatedGrade = prev.gradePedido.map(r => {
        if (r.id === rowId) {
          const current = r.activeSizes || [];
          if (!current.includes(size)) {
            return { ...r, activeSizes: [...current, size] };
          }
        }
        return r;
      });
      const updatedRendimento = syncTableRows(updatedGrade, prev.rendimentoCorte);
      const updatedQuantidade = syncTableRows(updatedGrade, prev.quantidadeCosturada);
      return {
        ...prev,
        gradePedido: updatedGrade,
        rendimentoCorte: updatedRendimento,
        quantidadeCosturada: updatedQuantidade,
      };
    });
  };

  const removeRowSize = (rowId: string, size: string) => {
    setSheet(prev => {
      const updatedGrade = prev.gradePedido.map(r => {
        if (r.id === rowId) {
          const current = r.activeSizes || [];
          return { ...r, activeSizes: current.filter(s => s !== size) };
        }
        return r;
      });
      const updatedRendimento = syncTableRows(updatedGrade, prev.rendimentoCorte);
      const updatedQuantidade = syncTableRows(updatedGrade, prev.quantidadeCosturada);
      return {
        ...prev,
        gradePedido: updatedGrade,
        rendimentoCorte: updatedRendimento,
        quantidadeCosturada: updatedQuantidade,
      };
    });
  };

  const updateRowQuantity = (
    target: "gradePedido" | "rendimentoCorte" | "quantidadeCosturada",
    id: string,
    size: string,
    value: number
  ) => {
    setSheet(prev => ({
      ...prev,
      [target]: prev[target].map(r => {
        if (r.id === id) {
          const qs = { ...r.quantities, [size]: value };
          return { ...r, quantities: qs };
        }
        return r;
      }),
    }));
  };

  // Calculate totals
  const getRowTotal = (row: GridRow) => {
    return (row.activeSizes || []).reduce((sum, size) => sum + (row.quantities[size] || 0), 0);
  };

  const getTableTotal = (target: "gradePedido" | "rendimentoCorte" | "quantidadeCosturada") => {
    return sheet[target].reduce((sum, row) => sum + getRowTotal(row), 0);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const jsonStr = JSON.stringify(sheet);

      if (activeMode === "pedido") {
        if (!selectedOrderId) {
          toast.error("Por favor, selecione um pedido.");
          setIsSaving(false);
          return;
        }
        
        // Save back to the selected order in supabase
        await updateOrder.mutateAsync({
          id: selectedOrderId,
          internal_notes: jsonStr,
        });

        // Resolve or create "Produção" Category in financial transactions
        let categoryId: string | null = null;
        try {
          const { data: cat } = await supabase
            .from("financial_categories")
            .select("id")
            .eq("name", "Produção")
            .maybeSingle();
          
          if (cat) {
            categoryId = cat.id;
          } else {
            const { data: newCat } = await supabase
              .from("financial_categories")
              .insert([{ name: "Produção", type: "pagar" }])
              .select("id")
              .single();
            categoryId = newCat?.id || null;
          }
        } catch (e) {
          console.warn("Could not load financial category", e);
        }

        // Generate bills payable (Contas a Pagar) for Corte
        if (sheet.aPagarCorte > 0 && sheet.corteFaccao) {
          const corteDesc = `Corte - Pedido ${sheet.pedido || ""} (${sheet.corteFaccao})`;
          const due = sheet.rendimentoCorteEntrega || sheet.entregaPrevista || new Date().toISOString().split("T")[0];

          const { data: existing } = await supabase
            .from("financial_transactions")
            .select("id")
            .eq("type", "pagar")
            .eq("description", corteDesc)
            .maybeSingle();

          if (!existing) {
            await supabase.from("financial_transactions").insert([{
              type: "pagar",
              status: "pendente",
              description: corteDesc,
              amount: sheet.aPagarCorte,
              original_amount: sheet.aPagarCorte,
              due_date: due,
              category_id: categoryId,
              notes: `Gerado via Ficha de Corte e Costura para o fornecedor de Corte. Pedido: ${sheet.pedido || ""}`,
              cost_center: "Produção"
            }]);
          }
        }

        // Generate bills payable (Contas a Pagar) for Costura
        if (sheet.aPagarCostura > 0 && sheet.costuraFaccao) {
          const costuraDesc = `Costura - Pedido ${sheet.pedido || ""} (${sheet.costuraFaccao})`;
          const due = sheet.quantidadeCosturadaEntrega || sheet.entregaPrevista || new Date().toISOString().split("T")[0];

          const { data: existing } = await supabase
            .from("financial_transactions")
            .select("id")
            .eq("type", "pagar")
            .eq("description", costuraDesc)
            .maybeSingle();

          if (!existing) {
            await supabase.from("financial_transactions").insert([{
              type: "pagar",
              status: "pendente",
              description: costuraDesc,
              amount: sheet.aPagarCostura,
              original_amount: sheet.aPagarCostura,
              due_date: due,
              category_id: categoryId,
              notes: `Gerado via Ficha de Corte e Costura para o fornecedor de Costura. Pedido: ${sheet.pedido || ""}`,
              cost_center: "Produção"
            }]);
          }
        }

        toast.success("Ficha Corte-Costura salva e lançamentos financeiros gerados!");
      } else {
        // Replenishment: Create/Update a replenishment order
        let { data: repClient, error: clientErr } = await supabase
          .from("clients")
          .select("id")
          .eq("name", "REPOSIÇÃO DE ESTOQUE")
          .maybeSingle();

        if (clientErr) throw clientErr;

        if (!repClient) {
          const { data: newClient, error: createClientErr } = await supabase
            .from("clients")
            .insert({
              name: "REPOSIÇÃO DE ESTOQUE",
              entity_type: "cliente",
              document: "00000000000",
              email: "reposicao@e-roupas.com",
            })
            .select()
            .single();
          if (createClientErr) throw createClientErr;
          repClient = newClient;
        }

        const code = `REP-${Date.now().toString().slice(-6)}`;

        const { data: newOrder, error: orderErr } = await supabase
          .from("orders")
          .insert({
            code,
            client_id: repClient.id,
            status: "corte",
            internal_notes: jsonStr,
            final_total: 0,
          })
          .select()
          .single();

        if (orderErr) throw orderErr;

        toast.success(`Ficha de Reposição de Estoque criada com sucesso! Código: ${code}`);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      }
    } catch (e: any) {
      toast.error("Erro ao salvar ficha: " + e.message);
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-sans pb-12">
      {/* Print styles override */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm !important;
          }
          body {
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, header, footer, .print\\:hidden, [role="tablist"] {
            display: none !important;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Force standard multi-column grid layouts in print */
          .grid {
            display: grid !important;
          }
          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
          .grid-cols-2, .md\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          .lg\\:grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
          .lg\\:grid-cols-5 {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          }
          .grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          .col-span-2 {
            grid-column: span 2 / span 2 !important;
          }
          /* Make spacing tighter to fit on a single A4 page */
          .space-y-8 > * + * {
            margin-top: 6px !important;
          }
          .space-y-6 > * + * {
            margin-top: 4px !important;
          }
          .space-y-4 > * + * {
            margin-top: 4px !important;
          }
          .space-y-3 > * + * {
            margin-top: 3px !important;
          }
          .p-6 {
            padding: 8px !important;
          }
          .p-4 {
            padding: 6px !important;
          }
          .h-9 {
            height: 22px !important;
          }
          .h-10 {
            height: 26px !important;
          }
          .h-8 {
            height: 20px !important;
          }
          /* Ensure text and inputs are legible and compact */
          input, select, textarea {
            pointer-events: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-size: 9px !important;
            height: 22px !important;
            padding: 1px 4px !important;
          }
          th, td {
            padding: 2px 4px !important;
            font-size: 9px !important;
          }
          label, span, div, h1, h3 {
            font-size: 9px !important;
          }
          h1.text-3xl {
            font-size: 14px !important;
          }
          h3.text-sm {
            font-size: 10px !important;
          }
          .gap-6 {
            gap: 8px !important;
          }
          .gap-4 {
            gap: 6px !important;
          }
          .pr-6 {
            padding-right: 8px !important;
          }
          .pb-4 {
            padding-bottom: 4px !important;
          }
          .pt-4 {
            padding-top: 4px !important;
          }
          /* Hide interactive hover close button on size items */
          .relative.group button {
            display: none !important;
          }
        }
      `}} />

      {/* Configuration Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b pb-4 print:hidden">
        <div className="flex gap-2">
          <Button
            variant={activeMode === "pedido" ? "default" : "outline"}
            onClick={() => setActiveMode("pedido")}
            className="rounded-full"
          >
            Atrelada a um Pedido
          </Button>
          <Button
            variant={activeMode === "reposicao" ? "default" : "outline"}
            onClick={() => setActiveMode("reposicao")}
            className="rounded-full"
          >
            Reposição de Estoque
          </Button>
        </div>

        {activeMode === "pedido" && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Label className="text-sm font-semibold shrink-0 text-muted-foreground">Selecionar Pedido:</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-64 justify-between bg-white h-9 font-normal border-slate-200">
                  <span className="truncate">
                    {selectedOrder ? `${selectedOrder.code} - ${selectedOrder.client_name}` : "Buscar pedido..."}
                  </span>
                  <Search className="size-4 opacity-50 ml-2 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-2" align="start">
                <div className="space-y-2">
                  <Input
                    placeholder="Digitar código ou cliente..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="h-8 text-xs"
                    autoFocus
                  />
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {filteredOrders.length === 0 ? (
                      <p className="text-xs text-slate-400 italic p-2 text-center">Nenhum pedido encontrado</p>
                    ) : (
                      filteredOrders.map(o => (
                        <button
                          key={o.id}
                          onClick={() => {
                            setSelectedOrderId(o.id);
                            setPopoverOpen(false);
                          }}
                          className={`w-full text-left text-xs p-2 rounded hover:bg-slate-100 transition-colors flex flex-col ${selectedOrderId === o.id ? "bg-slate-50 font-semibold text-primary" : ""}`}
                        >
                          <span className="font-bold">{o.code}</span>
                          <span className="text-slate-500 text-[10px]">{o.client_name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end">
          <Button onClick={() => window.print()} variant="outline" className="gap-2 border-slate-200">
            <Printer className="size-4" />
            Imprimir Ficha
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Salvar Ficha CORTE - COSTURA
          </Button>
        </div>
      </div>

      {/* Form Details Sheets - Styled exactly like the PDF/Image */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-8 print-area">
        {/* LOGO & TITLE */}
        <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-4">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 object-contain" />
          </div>
          <h1 className="text-3xl font-black tracking-widest text-slate-900 uppercase">CORTE - COSTURA</h1>
        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Column 1: Factions & Dates */}
          <div className="space-y-3 border-r pr-4 border-slate-100 print:border-none">
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-1.5 font-bold text-xs text-slate-700 cursor-pointer">
                <Checkbox
                  checked={sheet.isCorte}
                  onCheckedChange={(checked) => setSheet({ ...sheet, isCorte: !!checked })}
                />
                CORTE
              </label>
              <label className="flex items-center gap-1.5 font-bold text-xs text-slate-700 cursor-pointer">
                <Checkbox
                  checked={sheet.isCostura}
                  onCheckedChange={(checked) => setSheet({ ...sheet, isCostura: !!checked })}
                />
                COSTURA
              </label>
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Data Entrada</Label>
              <Input type="date" value={sheet.dataEntrada} onChange={e => setSheet({...sheet, dataEntrada: e.target.value})} className="h-9 bg-slate-50/50" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Entrega Prevista</Label>
              <Input type="date" value={sheet.entregaPrevista} onChange={e => setSheet({...sheet, entregaPrevista: e.target.value})} className="h-9 bg-slate-50/50" />
            </div>
          </div>

          {/* Column 2: Parceiros & Facções */}
          <div className="space-y-3 border-r pr-4 border-slate-100 print:border-none">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Empresa (Fornecedor)</Label>
              <Select value={sheet.empresa} onValueChange={v => setSheet({...sheet, empresa: v})}>
                <SelectTrigger className="h-9 bg-slate-50/50">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Facção de Corte</Label>
              <Select value={sheet.corteFaccao} onValueChange={v => setSheet({...sheet, corteFaccao: v})}>
                <SelectTrigger className="h-9 bg-slate-50/50">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Facção de Costura</Label>
              <Select value={sheet.costuraFaccao} onValueChange={v => setSheet({...sheet, costuraFaccao: v})}>
                <SelectTrigger className="h-9 bg-slate-50/50">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Column 3: Produto */}
          <div className="space-y-3 border-r pr-4 border-slate-100 print:border-none">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Modelo</Label>
              <Select
                value={sheet.modelo}
                onValueChange={v => {
                  const lower = v.toLowerCase();
                  let ribana = "4";
                  let ribanaWidth = "1.5";
                  
                  if (lower.includes("oversized")) {
                    ribana = "6.5";
                    ribanaWidth = "2.5";
                  }

                  setSheet({
                    ...sheet,
                    modelo: v,
                    ribana,
                    ribanaWidth,
                  });
                }}
              >
                <SelectTrigger className="h-9 bg-slate-50/50">
                  <SelectValue placeholder="Modelo..." />
                </SelectTrigger>
                <SelectContent>
                  {models.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Malha</Label>
              <Select value={sheet.malha} onValueChange={v => setSheet({...sheet, malha: v})}>
                <SelectTrigger className="h-9 bg-slate-50/50">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {fabrics.map(f => <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Retirado Por</Label>
              <Input type="text" value={sheet.retiradoPor} onChange={e => setSheet({...sheet, retiradoPor: e.target.value})} className="h-9 bg-slate-50/50" placeholder="Quem retirou..." />
            </div>
          </div>

          {/* Column 4: Medidas de Acabamento */}
          <div className="space-y-3 border-r pr-4 border-slate-100 print:border-none">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap">Corte Ribana</Label>
                <Input type="text" value={sheet.ribana} onChange={e => setSheet({...sheet, ribana: e.target.value})} className="h-9 bg-slate-50/50" placeholder="Ribana..." />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap">Ribana Acabada</Label>
                <Input type="text" value={sheet.ribanaWidth} onChange={e => setSheet({...sheet, ribanaWidth: e.target.value})} className="h-9 bg-slate-50/50 text-center" placeholder="cm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap">Cobre Gola</Label>
                <Input type="text" value={sheet.cobreGola} onChange={e => setSheet({...sheet, cobreGola: e.target.value})} className="h-9 bg-slate-50/50" placeholder="Cobre gola..." />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap">Cobre Gola Larg</Label>
                <Input type="text" value={sheet.cobreGolaWidth} onChange={e => setSheet({...sheet, cobreGolaWidth: e.target.value})} className="h-9 bg-slate-50/50 text-center" placeholder="cm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap">Debrum</Label>
                <Input type="text" value={sheet.debrum} onChange={e => setSheet({...sheet, debrum: e.target.value})} className="h-9 bg-slate-50/50" placeholder="Debrum..." />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-bold uppercase text-slate-400 whitespace-nowrap">Debrum Larg</Label>
                <Input type="text" value={sheet.debrumWidth} onChange={e => setSheet({...sheet, debrumWidth: e.target.value})} className="h-9 bg-slate-50/50 text-center" placeholder="cm" />
              </div>
            </div>
          </div>

          {/* Column 5: Informações do Pedido */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Pedido</Label>
              <Input type="text" value={sheet.pedido} onChange={e => setSheet({...sheet, pedido: e.target.value})} className="h-9 bg-slate-50/50" placeholder="Código..." />
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div className="space-y-1">
                <Label className="text-[9px] font-bold uppercase text-slate-400">Responsável</Label>
                <Input type="text" value={sheet.responsavelPedido} onChange={e => setSheet({...sheet, responsavelPedido: e.target.value})} className="h-9 bg-slate-50/50 text-xs px-1.5" placeholder="Nome..." />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-bold uppercase text-slate-400">Contato</Label>
                <Input type="text" value={sheet.telefoneContato} onChange={e => setSheet({...sheet, telefoneContato: e.target.value})} className="h-9 bg-slate-50/50 text-xs px-1.5" placeholder="Tel..." />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 cursor-pointer">
                <Checkbox
                  checked={sheet.pedidoExato}
                  onCheckedChange={(checked) => setSheet({ ...sheet, pedidoExato: !!checked })}
                />
                PEDIDO EXATO
              </label>
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 cursor-pointer">
                <Checkbox
                  checked={sheet.cortarTudo}
                  onCheckedChange={(checked) => setSheet({ ...sheet, cortarTudo: !!checked })}
                />
                CORTAR TUDO
              </label>
            </div>
          </div>
        </div>

        {/* TABLES/SECTIONS */}
        <div className="space-y-8 pt-4 border-t">
          {/* SECTION 1: GRADE PEDIDO */}
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-900 text-white px-4 py-2.5 rounded-lg print:bg-slate-100 print:text-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider">Grade do Pedido (Planejado)</h3>
              <Button size="sm" variant="secondary" onClick={() => addGridRow("gradePedido")} className="h-7 text-xs bg-slate-800 border-none hover:bg-slate-700 text-white print:hidden">
                <Plus className="size-3.5 mr-1" /> Add Linha
              </Button>
            </div>
            
            <div className="overflow-x-auto border rounded-xl bg-card">
              <table className="w-full text-xs font-medium text-slate-800">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 border-b">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold w-44">Cor</th>
                    <th className="px-3 py-2 text-center font-bold w-20">KG</th>
                    <th className="px-3 py-2 text-left font-bold w-44">Modelo</th>
                    <th className="px-3 py-2 text-left font-bold min-w-[280px]">Tamanhos</th>
                    <th className="px-3 py-2 text-right font-bold w-24">Total</th>
                    <th className="px-2 py-2 text-center w-12 print:hidden">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sheet.gradePedido.map(row => (
                    <tr key={row.id}>
                      <td className="p-2 align-top">
                        <Select value={row.cor} onValueChange={v => updateRowField("gradePedido", row.id, "cor", v)}>
                          <SelectTrigger className="h-8 bg-white text-xs border-slate-200">
                            <SelectValue placeholder="Selecione...">
                              {row.cor && (() => {
                                const selectedCol = colors.find(c => c.name === row.cor);
                                const code = COLOR_CODES[row.cor.toLowerCase()] || selectedCol?.code;
                                return (
                                  <div className="flex items-center gap-1.5">
                                    <div className="size-3 rounded-full border shrink-0" style={{ backgroundColor: selectedCol?.hex || '#ccc' }}></div>
                                    <span>{row.cor} {code ? `(COD. ${code})` : ""}</span>
                                  </div>
                                );
                              })()}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {colors.map(c => {
                              const code = COLOR_CODES[c.name.toLowerCase()] || c.code;
                              return (
                                <SelectItem key={c.id} value={c.name}>
                                  <div className="flex items-center gap-2">
                                    <div className="size-3.5 rounded-full border shrink-0" style={{ backgroundColor: c.hex || '#ccc' }}></div>
                                    <span>{c.name} {code ? `(COD. ${code})` : ""}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2 align-top">
                        <Input 
                          type="number" 
                          step="any" 
                          value={row.kg} 
                          onChange={e => updateRowField("gradePedido", row.id, "kg", e.target.value)} 
                          className="h-8 text-center border-slate-200" 
                        />
                      </td>
                      <td className="p-2 align-top">
                        <Select value={row.modelo} onValueChange={v => updateRowField("gradePedido", row.id, "modelo", v)}>
                          <SelectTrigger className="h-8 bg-white text-xs border-slate-200">
                            <SelectValue placeholder="Modelo..." />
                          </SelectTrigger>
                          <SelectContent>
                            {models.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2 align-top">
                        <div className="flex flex-wrap gap-1 items-end">
                          {(row.activeSizes || []).map((sz: string) => (
                            <div key={sz} className="flex flex-col items-center gap-0.5 relative group">
                              <span className="text-[10px] print:text-xs font-bold text-slate-600 print:text-black uppercase">{sz}</span>
                              <Input
                                type="number"
                                min={0}
                                className="h-8 print:h-9 px-1 text-center text-xs print:text-sm w-10 print:w-12 bg-white border border-slate-200 print:border-slate-400 rounded focus:border-green-500"
                                value={row.quantities[sz] === 0 ? "" : (row.quantities[sz] || "")}
                                onChange={e => updateRowQuantity("gradePedido", row.id, sz, parseInt(e.target.value) || 0)}
                                placeholder="0"
                              />
                              <button 
                                onClick={() => removeRowSize(row.id, sz)}
                                className="absolute -top-1 -right-1 bg-red-100 text-red-600 rounded-full w-3.5 h-3.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] print:hidden"
                              >×</button>
                            </div>
                          ))}
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 text-xs px-2.5 text-green-700 border-green-200 hover:bg-green-50 print:hidden">+</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2" align="start">
                              <div className="grid grid-cols-4 gap-1">
                                {(row.modelo?.toLowerCase().includes("infantil") ? INFANTIL_SIZES : ADULTO_SIZES).map((sz) => (
                                  <Button 
                                    key={sz} 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 text-xs"
                                    disabled={(row.activeSizes || []).includes(sz)}
                                    onClick={() => addRowSize(row.id, sz)}
                                  >
                                    {sz}
                                  </Button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </td>
                      <td className="p-2 text-right font-bold text-slate-900 bg-slate-50/50 align-top pt-4">
                        {getRowTotal(row)}
                      </td>
                      <td className="p-2 text-center align-top pt-3 print:hidden">
                        <Button variant="ghost" size="icon" onClick={() => removeGridRow("gradePedido", row.id)} className="h-8 w-8 text-red-500 hover:bg-red-50">
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {sheet.gradePedido.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                        Nenhuma linha adicionada. Clique em "Add Linha" para iniciar.
                      </td>
                    </tr>
                  )}
                </tbody>
                {sheet.gradePedido.length > 0 && (
                  <tfoot className="bg-slate-50 font-bold border-t">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-left">TOTAL GERAL (PLANEJADO):</td>
                      <td className="px-4 py-3 text-right text-primary text-sm font-bold bg-slate-100">
                        {getTableTotal("gradePedido")}
                      </td>
                      <td className="print:hidden"></td>
                    </tr>
                    <tr>
                      <td colSpan={6} className="p-0 border-t border-slate-200">
                        <input
                          value={sheet.observacaoGradePedido || ""}
                          onChange={(e) => setSheet({ ...sheet, observacaoGradePedido: e.target.value })}
                          placeholder="Observações da Grade do Pedido (Planejado)..."
                          className="w-full text-xs font-normal border-none outline-none focus:ring-0 shadow-none px-4 py-2.5 bg-transparent placeholder:text-slate-400 text-slate-700"
                        />
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* SECTION 2: RENDIMENTO DO CORTE */}
          {sheet.isCorte && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between items-center bg-blue-900 text-white px-4 py-2.5 rounded-lg print:bg-slate-100 print:text-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider font-semibold">Rendimento do Corte (Preenchido pelo Cortador)</h3>
                <span className="text-xs text-blue-200 print:hidden">Campos de Cor, KG e Modelo sincronizados da grade acima</span>
              </div>

              <div className="overflow-x-auto border rounded-xl bg-card">
                <table className="w-full text-xs font-medium text-slate-800">
                  <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold w-44">Cor</th>
                      <th className="px-3 py-2 text-center font-bold w-20">KG</th>
                      <th className="px-3 py-2 text-left font-bold w-44">Modelo</th>
                      <th className="px-3 py-2 text-left font-bold min-w-[280px]">Tamanhos</th>
                      <th className="px-3 py-2 text-right font-bold w-24">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sheet.rendimentoCorte.map(row => (
                      <tr key={row.id}>
                        <td className="p-3 font-semibold text-slate-700 bg-slate-50/30 align-top">
                          {(() => {
                            const selectedCol = colors.find(c => c.name === row.cor);
                            const code = COLOR_CODES[row.cor.toLowerCase()] || selectedCol?.code;
                            return (
                              <div className="flex items-center gap-1.5">
                                <div className="size-3 rounded-full border shrink-0" style={{ backgroundColor: selectedCol?.hex || '#ccc' }}></div>
                                <span>{row.cor} {code ? `(COD. ${code})` : ""}</span>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="p-3 text-center text-slate-600 align-top">
                          {row.kg || "0"}
                        </td>
                        <td className="p-3 text-slate-700 align-top">
                          {row.modelo || "—"}
                        </td>
                        <td className="p-2 align-top">
                          <div className="flex flex-wrap gap-1 items-end">
                            {(row.activeSizes || []).map((sz: string) => (
                              <div key={sz} className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] print:text-xs font-bold text-slate-600 print:text-black uppercase">{sz}</span>
                                <Input
                                  type="number"
                                  min={0}
                                  className="h-8 print:h-9 px-1 text-center text-xs print:text-sm w-10 print:w-12 bg-white border border-slate-200 print:border-slate-400 rounded focus:border-blue-500"
                                  value={row.quantities[sz] === 0 ? "" : (row.quantities[sz] || "")}
                                  onChange={e => updateRowQuantity("rendimentoCorte", row.id, sz, parseInt(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-2 text-right font-bold text-slate-900 bg-slate-50/50 align-top pt-4">
                          {getRowTotal(row)}
                        </td>
                      </tr>
                    ))}
                    {sheet.rendimentoCorte.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                          Nenhuma linha sincronizada. Adicione cores na Grade do Pedido para visualizar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {sheet.rendimentoCorte.length > 0 && (
                    <tfoot className="bg-slate-50 font-bold border-t">
                      <tr>
                        <td colSpan={5} className="px-4 py-2">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 font-normal">
                              <span className="font-bold text-xs whitespace-nowrap">A Pagar (R$):</span>
                              <Input
                                type="number"
                                step="0.01"
                                className="w-24 h-7 text-xs bg-white text-right border-slate-300 print:border-slate-200"
                                value={sheet.aPagarCorte || ""}
                                onChange={e => setSheet({ ...sheet, aPagarCorte: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                              />
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs font-bold">
                              <span className="whitespace-nowrap uppercase">TOTAL RENDIMENTO DO CORTE:</span>
                              <span className="bg-slate-100 px-3 py-1 rounded border border-slate-200 min-w-16 text-center">{getTableTotal("rendimentoCorte")}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-dashed print:border-none print:bg-transparent print:p-0">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">Data Entrada (Corte)</Label>
                  <Input type="date" value={sheet.rendimentoCorteEntrada} onChange={e => setSheet({...sheet, rendimentoCorteEntrada: e.target.value})} className="h-9 bg-white border-slate-200" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">Data Entrega (Corte)</Label>
                  <Input type="date" value={sheet.rendimentoCorteEntrega} onChange={e => setSheet({...sheet, rendimentoCorteEntrega: e.target.value})} className="h-9 bg-white border-slate-200" />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: QUANTIDADE COSTURADA */}
          {sheet.isCostura && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between items-center bg-indigo-900 text-white px-4 py-2.5 rounded-lg print:bg-slate-100 print:text-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider">Quantidade Costurada (Preenchido pela Costureira)</h3>
                <span className="text-xs text-indigo-200 print:hidden">Campos de Cor, KG e Modelo sincronizados da grade acima</span>
              </div>

              <div className="overflow-x-auto border rounded-xl bg-card">
                <table className="w-full text-xs font-medium text-slate-800">
                  <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold w-44">Cor Original</th>
                      <th className="px-3 py-2 text-center font-bold w-20">KG</th>
                      <th className="px-3 py-2 text-left font-bold w-44">Modelo</th>
                      <th className="px-3 py-2 text-left font-bold min-w-[280px]">Tamanhos</th>
                      <th className="px-3 py-2 text-right font-bold w-24">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sheet.quantidadeCosturada.map(row => (
                      <tr key={row.id}>
                        <td className="p-3 font-semibold text-slate-700 bg-slate-50/30 align-top">
                          {(() => {
                            const selectedCol = colors.find(c => c.name === row.cor);
                            const code = COLOR_CODES[row.cor.toLowerCase()] || selectedCol?.code;
                            return (
                              <div className="flex items-center gap-1.5">
                                <div className="size-3 rounded-full border shrink-0" style={{ backgroundColor: selectedCol?.hex || '#ccc' }}></div>
                                <span>{row.cor} {code ? `(COD. ${code})` : ""}</span>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="p-3 text-center text-slate-600 align-top">
                          {row.kg || "0"}
                        </td>
                        <td className="p-3 text-slate-700 align-top">
                          {row.modelo || "—"}
                        </td>
                        <td className="p-2 align-top">
                          <div className="flex flex-wrap gap-1 items-end">
                            {(row.activeSizes || []).map((sz: string) => (
                              <div key={sz} className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] print:text-xs font-bold text-slate-600 print:text-black uppercase">{sz}</span>
                                <Input
                                  type="number"
                                  min={0}
                                  className="h-8 print:h-9 px-1 text-center text-xs print:text-sm w-10 print:w-12 bg-white border border-slate-200 print:border-slate-400 rounded focus:border-indigo-500"
                                  value={row.quantities[sz] === 0 ? "" : (row.quantities[sz] || "")}
                                  onChange={e => updateRowQuantity("quantidadeCosturada", row.id, sz, parseInt(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-2 text-right font-bold text-slate-900 bg-slate-50/50 align-top pt-4">
                          {getRowTotal(row)}
                        </td>
                      </tr>
                    ))}
                    {sheet.quantidadeCosturada.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                          Nenhuma linha sincronizada. Adicione cores na Grade do Pedido para visualizar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {sheet.quantidadeCosturada.length > 0 && (
                    <tfoot className="bg-slate-50 font-bold border-t">
                      <tr>
                        <td colSpan={5} className="px-4 py-2">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 font-normal">
                              <span className="font-bold text-xs whitespace-nowrap">A Pagar (R$):</span>
                              <Input
                                type="number"
                                step="0.01"
                                className="w-24 h-7 text-xs bg-white text-right border-slate-300 print:border-slate-200"
                                value={sheet.aPagarCostura || ""}
                                onChange={e => setSheet({ ...sheet, aPagarCostura: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                              />
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs font-bold">
                              <span className="whitespace-nowrap uppercase">TOTAL QUANTIDADE COSTURADA:</span>
                              <span className="bg-slate-100 px-3 py-1 rounded border border-slate-200 min-w-16 text-center">{getTableTotal("quantidadeCosturada")}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-dashed print:border-none print:bg-transparent print:p-0">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">Data Entrada (Costura)</Label>
                  <Input type="date" value={sheet.quantidadeCosturadaEntrada} onChange={e => setSheet({...sheet, quantidadeCosturadaEntrada: e.target.value})} className="h-9 bg-white border-slate-200" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">Data Entrega (Costura)</Label>
                  <Input type="date" value={sheet.quantidadeCosturadaEntrega} onChange={e => setSheet({...sheet, quantidadeCosturadaEntrega: e.target.value})} className="h-9 bg-white border-slate-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
