import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "warning" | "success" | "primary" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-[color-mix(in_oklab,var(--info)_14%,transparent)] text-[var(--info)]",
  warning: "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[color-mix(in_oklab,var(--warning)_60%,black)] dark:text-[var(--warning)]",
  success: "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[var(--success)]",
  primary: "bg-primary-soft text-primary",
  danger: "bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] text-[var(--destructive)]",
};

export function StatusBadge({ tone = "neutral", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight",
        tones[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}
