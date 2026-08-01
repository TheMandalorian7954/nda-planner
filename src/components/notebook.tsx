import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PaperCard({
  children,
  className,
  withMargin = false,
  ruled = false,
  tape = false,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  withMargin?: boolean;
  ruled?: boolean;
  tape?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "notebook-card ink-in",
        withMargin && "with-margin",
        ruled && "ruled",
        className,
      )}
      {...rest}
    >
      {tape && <span className="tape" aria-hidden />}
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  note,
  className,
}: {
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-2", className)}>
      <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
        <span className="hi">{title}</span>
      </h2>
      {note && <span className="font-hand text-base text-muted-foreground">{note}</span>}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
  right,
}: {
  kicker: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl">
        <p className="margin-note mb-1 text-lg">{kicker}</p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        )}
      </div>
      {right}
    </header>
  );
}

export function Stamp({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("stamp", className)}>{children}</span>;
}

export function HandNote({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("margin-note", className)}>{children}</span>;
}

export function ProgressRing({
  value,
  size = 96,
  stroke = 8,
  label,
  color = "var(--chart-1)",
  sub,
}: {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  color?: string;
  sub?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--rule-line)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - clamped / 100)}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-bold">{Math.round(clamped)}%</span>
        </div>
      </div>
      {label && (
        <div className="text-center">
          <p className="text-xs font-medium">{label}</p>
          {sub && <p className="font-hand text-sm text-muted-foreground">{sub}</p>}
        </div>
      )}
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  note,
  accent = "var(--chart-1)",
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  note?: string;
  accent?: string;
}) {
  return (
    <PaperCard className="p-4" withMargin>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="font-display mt-1 text-2xl font-bold" style={{ color: accent }}>
            {value}
          </p>
          {note && <p className="font-hand mt-1 text-sm text-muted-foreground">{note}</p>}
        </div>
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in oklch, ${accent} 12%, transparent)`, color: accent }}
        >
          {icon}
        </div>
      </div>
    </PaperCard>
  );
}

export function Checklist({
  items,
  onToggle,
  onDelete,
  empty,
}: {
  items: { id: string; title: string; done: boolean; tag?: string; note?: string }[];
  onToggle: (id: string, done: boolean) => void;
  onDelete?: (id: string) => void;
  empty?: string;
}) {
  if (items.length === 0) {
    return (
      <p className="font-hand py-6 text-center text-lg text-muted-foreground">
        {empty ?? "Nothing here yet — add something above."}
      </p>
    );
  }
  return (
    <ul className="divide-y divide-border/70">
      {items.map((item) => (
        <li key={item.id} className="group flex items-center gap-3 py-2.5">
          <button
            type="button"
            aria-label={`Mark ${item.title} as ${item.done ? "not done" : "done"}`}
            onClick={() => onToggle(item.id, !item.done)}
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
              item.done
                ? "border-transparent text-white"
                : "border-border hover:border-primary/50",
            )}
            style={item.done ? { background: "var(--chart-1)" } : undefined}
          >
            {item.done && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-sm leading-snug",
                item.done && "text-muted-foreground line-through decoration-chart-1/60",
              )}
            >
              {item.title}
            </p>
            {item.note && (
              <p className="font-hand text-sm text-muted-foreground">{item.note}</p>
            )}
          </div>
          {item.tag && (
            <span className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:inline">
              {item.tag}
            </span>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
              aria-label={`Delete ${item.title}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export function ProgressBar({
  value,
  color = "var(--chart-1)",
  className,
}: {
  value: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-border/60", className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: `linear-gradient(90deg, ${color}, ${color})`,
        }}
      />
    </div>
  );
}
