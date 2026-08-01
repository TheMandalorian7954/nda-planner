import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, BookOpen, CheckCircle2, CircleDashed, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, PaperCard, ProgressBar, SectionHeading, Stamp, HandNote } from "@/components/notebook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SYLLABUS } from "@/data/syllabus";
import { QUESTION_BANK } from "@/data/questions";
import { toast } from "sonner";

const STATUSES = [
  { value: "todo", label: "Todo", icon: CircleDashed },
  { value: "learning", label: "Learning", icon: Sparkles },
  { value: "done", label: "Done", icon: CheckCircle2 },
  { value: "revision", label: "Revision", icon: RefreshCw },
] as const;

export default function Written() {
  const [tab, setTab] = useState("maths");
  const progressRows = useQuery(api.syllabus.listSyllabusProgress);
  const setStatus = useMutation(api.syllabus.setSyllabusStatus);

  const progress = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of progressRows ?? []) m[p.itemId] = p.status;
    return m;
  }, [progressRows]);

  const subject = SYLLABUS.find((s) => s.id === tab)!;
  const subjectItems = subject.sections.flatMap((sec) => sec.items);
  const doneItems = subjectItems.filter(
    (i) => progress[i.id] === "done" || progress[i.id] === "revision",
  ).length;
  const pct = subjectItems.length ? (doneItems / subjectItems.length) * 100 : 0;

  const bank = QUESTION_BANK.filter((q) => q.subject === subject.name);
  const totalBank = bank.length;

  const cycleStatus = (itemId: string) => {
    const cur = progress[itemId] ?? "todo";
    const idx = STATUSES.findIndex((s) => s.value === cur);
    const next = STATUSES[(idx + 1) % STATUSES.length].value;
    void setStatus({ itemId, status: next });
    toast.success(`Marked "${next}"`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 2 · written exam"
        title="The Written Exam — 900 marks"
        description="Mathematics (300) + English (200) + General Knowledge & Current Affairs (400). Click a topic to cycle its status: todo → learning → done → revision."
        right={
          <div className="rounded-lg border border-border/70 bg-card px-4 py-2 text-center shadow-sm">
            <p className="font-display text-2xl font-bold text-chart-1">{subject.marks}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">marks</p>
          </div>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-auto flex-wrap gap-1 rounded-xl bg-transparent p-0">
          {SYLLABUS.map((s) => {
            const items = s.sections.flatMap((sec) => sec.items);
            const d = items.filter((i) => progress[i.id] === "done" || progress[i.id] === "revision").length;
            return (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="flex-1 gap-2 rounded-lg border border-border/70 bg-card px-4 py-2 data-[state=active]:border-transparent data-[state=active]:bg-chart-1 data-[state=active]:text-primary-foreground sm:flex-none"
              >
                <BookOpen className="size-4" />
                <span className="whitespace-nowrap">{s.name}</span>
                <span className="rounded-full bg-background/60 px-1.5 text-[10px] font-semibold">
                  {d}/{items.length}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-xs">
            <ProgressBar value={pct} color="var(--chart-1)" />
          </div>
          <HandNote className="text-lg">
            {pct.toFixed(0)}% of {subject.name} covered — {doneItems} of {subjectItems.length} topics
          </HandNote>
        </div>

        {SYLLABUS.map((s) => (
          <TabsContent key={s.id} value={s.id} className="mt-6">
            <div className="grid gap-5 lg:grid-cols-2">
              {s.sections.map((sec) => {
                const secDone = sec.items.filter(
                  (i) => progress[i.id] === "done" || progress[i.id] === "revision",
                ).length;
                return (
                  <PaperCard key={sec.id} withMargin className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-display text-base font-bold">{sec.name}</h3>
                      <span className="text-xs font-medium text-muted-foreground">
                        {secDone}/{sec.items.length}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {sec.items.map((item) => {
                        const st = progress[item.id] ?? "todo";
                        const status = STATUSES.find((x) => x.value === st)!;
                        const Icon = status.icon;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => cycleStatus(item.id)}
                              className="group flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted/60"
                            >
                              <Icon
                                className={cn(
                                  "size-4 shrink-0",
                                  st === "done" && "text-chart-3",
                                  st === "revision" && "text-chart-2",
                                  st === "learning" && "text-chart-4",
                                  st === "todo" && "text-muted-foreground",
                                )}
                              />
                              <span
                                className={cn(
                                  "flex-1 text-sm",
                                  (st === "done" || st === "revision") && "text-muted-foreground line-through decoration-chart-1/40",
                                )}
                              >
                                {item.name}
                              </span>
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                                {status.label}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </PaperCard>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Practice CTA */}
      <section>
        <PaperCard tape ruled className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <Stamp>practice</Stamp>
            <h3 className="font-display mt-2 text-lg font-bold">
              Test yourself on {subject.name}
            </h3>
            <p className="font-hand text-base text-muted-foreground">
              {totalBank} built-in NDA-style questions in the bank for this subject.
            </p>
          </div>
          <Link
            to="/app/mock"
            className="inline-flex items-center gap-2 rounded-lg bg-chart-1 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5"
          >
            Open mock tests <ArrowRight className="size-4" />
          </Link>
        </PaperCard>
      </section>
    </div>
  );
}
