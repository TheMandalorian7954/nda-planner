import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import { Check, GitBranch, Plus, Rocket, Trash2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, PaperCard, SectionHeading, Stamp, HandNote, ProgressBar } from "@/components/notebook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DAILY_ROUTINE,
  PORTFOLIO_REPOS,
  ROADMAP_PHASES,
  SKILLS_CHECKLIST,
} from "@/data/roadmap";
import { toast } from "sonner";

export default function Roadmap() {
  const progressRows = useQuery(api.roadmap.listRoadmapProgress);
  const setItem = useMutation(api.roadmap.setRoadmapItem);
  const customRows = useQuery(api.roadmap.listAllCustomItems);
  const addCustom = useMutation(api.roadmap.addCustomItem);
  const toggleCustom = useMutation(api.roadmap.toggleCustomItem);
  const deleteCustom = useMutation(api.roadmap.deleteCustomItem);

  const [openPhase, setOpenPhase] = useState<string>(ROADMAP_PHASES[0].id);
  const [custom, setCustom] = useState("");

  const progress = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const p of progressRows ?? []) if (p.done) m.set(p.itemId, true);
    return m;
  }, [progressRows]);

  const customByPhase = useMemo(() => {
    const m = new Map<string, typeof customRows>();
    for (const c of customRows ?? []) {
      const arr = m.get(c.phaseId) ?? [];
      arr.push(c);
      m.set(c.phaseId, arr);
    }
    return m;
  }, [customRows]);

  const totalItems = ROADMAP_PHASES.reduce((a, p) => a + p.items.length, 0);
  const doneItems = ROADMAP_PHASES.reduce(
    (a, p) => a + p.items.filter((i) => progress.get(i.id)).length,
    0,
  );
  const pct = totalItems ? (doneItems / totalItems) * 100 : 0;

  const phasePct = (phaseId: string) => {
    const items = ROADMAP_PHASES.find((p) => p.id === phaseId)!.items;
    const done = items.filter((i) => progress.get(i.id)).length;
    return items.length ? done / items.length : 0;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="the engineer track"
        title="11-Phase Dev Roadmap"
        description="Python → full-stack → ML → deep learning → computer vision → LLMs → robotics → drones → cybersecurity → DevOps → cloud. Built for a 1st-year B.Tech schedule, no fake deadlines — tick items as you finish and add your own."
        right={
          <PaperCard className="px-5 py-3 text-center">
            <p className="font-display text-3xl font-bold text-chart-1">{pct.toFixed(0)}%</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {doneItems}/{totalItems} items
            </p>
          </PaperCard>
        }
      />

      <PaperCard withMargin className="p-5">
        <ProgressBar value={pct} color="var(--chart-1)" />
        <p className="font-hand mt-2 text-base text-muted-foreground">
          ~5–6 hrs/day: 1.5h core learning · 1h DSA · 1.5h project · 30m docs · 30m commits · 30–60m review
        </p>
      </PaperCard>

      {/* Phases */}
      <div className="space-y-3">
        {ROADMAP_PHASES.map((phase) => {
          const isOpen = openPhase === phase.id;
          const phaseDone = phasePct(phase.id) * 100;
          return (
            <PaperCard key={phase.id} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenPhase(isOpen ? "" : phase.id)}
                className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
                  <Rocket className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-bold">{phase.title}</p>
                  <p className="font-hand text-sm text-muted-foreground">{phase.goal}</p>
                </div>
                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                  {phase.duration}
                </span>
                <span className="w-20 text-right text-xs font-semibold text-chart-1">
                  {phaseDone.toFixed(0)}%
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-border/60 px-5 py-4">
                  <ul className="space-y-1">
                    {phase.items.map((item) => {
                      const done = progress.get(item.id) ?? false;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => void setItem({ itemId: item.id, done: !done })}
                            className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted/50"
                          >
                            <span
                              className={cn(
                                "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                                done ? "border-transparent bg-chart-1 text-white" : "border-border",
                              )}
                            >
                              {done && <Check className="size-3.5" />}
                            </span>
                            <span
                              className={cn(
                                "flex-1 text-sm",
                                done && "text-muted-foreground line-through decoration-chart-1/50",
                              )}
                            >
                              {item.title}
                            </span>
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                              {item.type}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                    {(customByPhase.get(phase.id) ?? []).map((c) => (
                      <li key={c._id} className="group flex items-center gap-3 px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => void toggleCustom({ id: c._id, done: !c.done })}
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                            c.done ? "border-transparent bg-chart-3 text-white" : "border-border",
                          )}
                        >
                          {c.done && <Check className="size-3.5" />}
                        </button>
                        <span className={cn("flex-1 text-sm font-hand text-lg", c.done && "text-muted-foreground line-through")}>
                          {c.title}
                        </span>
                        <button
                          type="button"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => void deleteCustom({ id: c._id })}
                          aria-label="Delete custom item"
                        >
                          <Trash2 className="size-3.5 text-destructive" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <form
                    className="mt-3 flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!custom.trim()) return;
                      void addCustom({ phaseId: phase.id, title: custom.trim() });
                      setCustom("");
                      toast.success("Custom item added — the roadmap is yours");
                    }}
                  >
                    <Input
                      value={custom}
                      onChange={(e) => setCustom(e.target.value)}
                      placeholder="Add your own item…"
                      className="h-8 bg-background/60 text-sm"
                    />
                    <Button type="submit" size="sm" variant="outline" className="shrink-0 gap-1">
                      <Plus className="size-3.5" /> Add
                    </Button>
                  </form>
                </div>
              )}
            </PaperCard>
          );
        })}
      </div>

      {/* Portfolio */}
      <section>
        <SectionHeading title="Portfolio Target" note="~20 repos" className="mb-3" />
        <PaperCard withMargin className="p-5">
          <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO_REPOS.map((r) => (
              <div key={r.id} className="flex items-center gap-2 py-1">
                <GitBranch className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm">{r.title}</span>
                <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {r.area}
                </span>
              </div>
            ))}
          </div>
        </PaperCard>
      </section>

      {/* Skills checklist */}
      <section>
        <SectionHeading title="Skills Checklist" note="by the end of the track" className="mb-3" />
        <PaperCard ruled tape className="p-5">
          <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS_CHECKLIST.map((s) => (
              <label key={s.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--chart-3)]"
                  onChange={(e) => void setItem({ itemId: `skill-${s.id}`, done: e.target.checked })}
                  checked={progress.get(`skill-${s.id}`) ?? false}
                />
                <span className="text-sm">{s.name}</span>
              </label>
            ))}
          </div>
        </PaperCard>
      </section>

      {/* Daily routine */}
      <section>
        <SectionHeading title="Daily Routine" note="5–6 hours" className="mb-3" />
        <PaperCard withMargin className="p-5">
          <ul className="space-y-2">
            {DAILY_ROUTINE.map((r) => (
              <li key={r.time} className="flex flex-wrap items-baseline gap-x-3 py-1">
                <span className="font-display w-24 shrink-0 text-sm font-bold text-chart-1">{r.time}</span>
                <span className="text-sm">{r.task}</span>
              </li>
            ))}
          </ul>
        </PaperCard>
      </section>

      <div className="flex items-center gap-2">
        <Stamp>Own it</Stamp>
        <HandNote className="text-lg">dates are suggestions — your pace, your phases, your repos</HandNote>
        <Trophy className="ml-auto size-5 text-chart-4" />
      </div>
    </div>
  );
}
