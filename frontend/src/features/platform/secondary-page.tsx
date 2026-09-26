import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, Plus } from "lucide-react";

interface SecondaryPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
}

export function SecondaryPage({ title, description, icon: Icon, items }: SecondaryPageProps) {
  return (
    <div className="space-y-6 text-foreground">
      {/* Header matching Rankings Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div>
          <button
            type="button"
            className="px-4 py-1.5 rounded-lg bg-blue-400 hover:bg-blue-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="size-4" />
            Configure
          </button>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item}
            className="panel p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span className="grid size-9 place-items-center rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400">
                <Icon className="size-4" />
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  index === 0
                    ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                    : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                }`}
              >
                {index === 0 ? "Priority" : "Active"}
              </span>
            </div>

            <div>
              <h2 className="text-sm font-bold text-foreground">{item}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Configured for the current organization and location scope, with server-ready filtering and audit history.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="size-3.5" /> Operational
              </span>
              <button
                type="button"
                className="p-1 rounded text-muted-foreground hover:text-blue-400 hover:bg-secondary transition-colors cursor-pointer"
                aria-label={`Open ${item}`}
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
