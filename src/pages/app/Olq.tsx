import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import { Target } from "lucide-react";
import { PageHeader, PaperCard, SectionHeading, Stamp, HandNote, ProgressBar } from "@/components/notebook";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { OLQ_QUALITIES } from "@/data/olq";
import { addDays, fmtShort, todayStr } from "@/lib/date";
import { toast } from "sonner";

export default function Olq() {
  const today = todayStr();
  const from = addDays(today, -30);
  const scores = useQuery(api.olq.listOlqScores, { from, to: today });
  const upsert = useMutation(api.olq.upsertOlqScore);

  const [values, setValues] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const todayScores = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of scores ?? []) if (s.date === today) m.set(s.quality, s.score);
    return m;
  }, [scores, today]);

  const averages = useMemo(() => {
    const map: Record<string, number[]> = {};
    for (const s of scores ?? []) (map[s.quality] ??= []).push(s.score);
    const out: Record<string, number> = {};
    for (const q of OLQ_QUALITIES) {
      const arr = map[q.id] ?? [];
      out[q.id] = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    }
    return out;
  }, [scores]);

  const overall = useMemo(() => {
    const arr = Object.values(averages).filter((v) => v > 0);
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }, [averages]);

  const save = (id: string) => {
    const score = values[id] ?? todayScores.get(id) ?? 5;
    void upsert({ date: today, quality: id, score, note: notes[id] });
    toast.success("Reflection saved");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 8 · officer like qualities"
        title="Daily OLQ Reflection"
        description="Rate all 15 qualities honestly — the SSB panel watches these every single day, not just on paper."
        right={
          <PaperCard className="px-5 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">30-day avg</p>
            <p className="font-display text-3xl font-bold text-chart-1">{overall.toFixed(1)}</p>
            <p className="text-[11px] text-muted-foreground">out of 10</p>
          </PaperCard>
        }
      />

      <PaperCard tape ruled className="p-5 sm:p-6">
        <SectionHeading title="Reflect on today" note={fmtShort(today)} className="mb-4" />
        <div className="grid gap-5 md:grid-cols-2">
          {OLQ_QUALITIES.map((q) => {
            const v = values[q.id] ?? todayScores.get(q.id) ?? 5;
            const avg = averages[q.id];
            return (
              <div key={q.id} className="rounded-lg border border-border/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{q.name}</p>
                  <span className="font-display text-lg font-bold text-chart-1">{v}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{q.desc}</p>
                <Slider
                  value={[v]}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-3"
                  onValueChange={(nv) => setValues((m) => ({ ...m, [q.id]: nv[0] }))}
                  onValueCommit={() => save(q.id)}
                />
                <div className="mt-2 flex items-center gap-2">
                  {avg > 0 && (
                    <span className="font-hand text-sm text-muted-foreground">
                      avg {avg.toFixed(1)} · <ProgressBar value={avg * 10} className="inline-block h-1.5 w-16 align-middle" />
                    </span>
                  )}
                </div>
                <Textarea
                  value={notes[q.id] ?? ""}
                  onChange={(e) => setNotes((m) => ({ ...m, [q.id]: e.target.value }))}
                  placeholder="One honest line…"
                  className="mt-2 min-h-[52px] bg-background/50 text-xs"
                />
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-border/70 pt-4">
          <Stamp>daily</Stamp>
          <HandNote className="text-lg">2 minutes × 15 qualities — do it right before bed.</HandNote>
        </div>
      </PaperCard>

      <Target className="hidden" />
    </div>
  );
}
