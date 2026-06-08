import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const PERMISSION_AREAS = [
  "Dashboard", "Clientes", "Pedidos", "Produção", "Estoque", 
  "Compras", "Expedição", "Financeiro", "Relatórios", 
  "Usuários", "Configurações", "Atendimento", "Designer"
];

export const PERMISSION_ACTIONS = [
  { key: "visualizar", label: "Visualizar" },
  { key: "criar", label: "Criar" },
  { key: "editar", label: "Editar" },
  { key: "excluir", label: "Excluir" },
  { key: "exportar", label: "Exportar" },
  { key: "aprovar", label: "Aprovar" },
  { key: "alterar_status", label: "Status" },
  { key: "mover_kanban", label: "Kanban" },
];

export type PermissionsMap = Record<string, Record<string, boolean>>;

interface PermissionsMatrixProps {
  permissions: PermissionsMap;
  onChange: (permissions: PermissionsMap) => void;
  disabled?: boolean;
}

export function PermissionsMatrix({ permissions, onChange, disabled = false }: PermissionsMatrixProps) {
  const togglePermission = (area: string, action: string, checked: boolean) => {
    if (disabled) return;
    const newPerms = { ...permissions };
    if (!newPerms[area]) newPerms[area] = {};
    newPerms[area][action] = checked;
    onChange(newPerms);
  };

  const toggleAllArea = (area: string, checked: boolean) => {
    if (disabled) return;
    const newPerms = { ...permissions };
    newPerms[area] = {};
    PERMISSION_ACTIONS.forEach(a => {
      newPerms[area][a.key] = checked;
    });
    onChange(newPerms);
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Área do Sistema</th>
              <th className="px-4 py-3 text-center font-medium w-[80px]">Todos</th>
              {PERMISSION_ACTIONS.map(action => (
                <th key={action.key} className="px-4 py-3 text-center font-medium">
                  {action.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {PERMISSION_AREAS.map(area => {
              const areaPerms = permissions[area] || {};
              const allChecked = PERMISSION_ACTIONS.every(a => areaPerms[a.key]);

              return (
                <tr key={area} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{area}</td>
                  <td className="px-4 py-3 text-center">
                    <Switch 
                      checked={allChecked}
                      onCheckedChange={(c) => toggleAllArea(area, c)}
                      disabled={disabled}
                    />
                  </td>
                  {PERMISSION_ACTIONS.map(action => (
                    <td key={action.key} className="px-4 py-3 text-center">
                      <Switch 
                        checked={!!areaPerms[action.key]}
                        onCheckedChange={(c) => togglePermission(area, action.key, c)}
                        disabled={disabled}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
