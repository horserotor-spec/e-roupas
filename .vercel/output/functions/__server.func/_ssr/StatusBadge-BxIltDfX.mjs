import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { v as cn } from "./router-BxmJvJdu.mjs";
const tones = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-[color-mix(in_oklab,var(--info)_14%,transparent)] text-[var(--info)]",
  warning: "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[color-mix(in_oklab,var(--warning)_60%,black)] dark:text-[var(--warning)]",
  success: "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[var(--success)]",
  primary: "bg-primary-soft text-primary",
  danger: "bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] text-[var(--destructive)]"
};
function StatusBadge({ tone = "neutral", children, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight",
        tones[tone],
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-current opacity-70" }),
        children
      ]
    }
  );
}
export {
  StatusBadge as S
};
