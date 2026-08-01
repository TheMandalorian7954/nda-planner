import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Mic, Play, Square, Timer, Trash2 } from "lucide-react";
import { PageHeader, PaperCard, SectionHeading, Stamp, HandNote, Checklist } from "@/components/notebook";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { SPEAKING_CHECKLIST, LECTURETTE_TOPICS } from "@/data/ssb";
import { addDays, todayStr } from "@/lib/date";
import { toast } from "sonner";

export default function Communication() {
  const today = todayStr();
  const logs = useQuery(api.speaking.listSpeaking, { from: addDays(today, -30), to: today });
  const logSpeaking = useMutation(api.speaking.logSpeaking);

  const [topicIdx, setTopicIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [confidence, setConfidence] = useState(6);
  const [note, setNote] = useState("");
  const [checks, setChecks] = useState<Record<number, boolean>>({});

  const toggleTimer = () => {
    if (running) {
      setRunning(false);
      return;
    }
    setSeconds(0);
    setRunning(true);
    window.setInterval(() => {
      setSeconds((s) => {
        if (s >= 180) {
          // stop at 3 min
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, 1000);
  };

  const saveSession = () => {
    void logSpeaking({
      date: today,
      kind: "lecturette",
      minutes: Math.max(1, Math.round(seconds / 60)),
      confidence,
      note: note || undefined,
    });
    setNote("");
    toast.success("Speaking session saved");
  };

  const totalMinutes = (logs ?? []).reduce((a, l) => a + l.minutes, 0);
  const avgConfidence = logs?.length
    ? (logs.reduce((a, l) => a + (l.confidence ?? 0), 0) / logs.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 7 · communication"
        title="Communication"
        description="Daily speaking practice, speech recording habits, lecturette timer and confidence tracking — the SSB interview is won out loud."
        right={
          <div className="flex gap-3">
            <PaperCard className="px-4 py-2 text-center">
              <p className="font-display text-xl font-bold text-chart-1">{totalMinutes}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">min spoken</p>
            </PaperCard>
            <PaperCard className="px-4 py-2 text-center">
              <p className="font-display text-xl font-bold text-chart-2">{avgConfidence}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">avg confidence</p>
            </PaperCard>
          </div>
        }
      />

      {/* Lecturette timer */}
      <section>
        <SectionHeading title="Lecturette Timer" note="3 minutes · prepare 3, speak 3" className="mb-3" />
        <PaperCard ruled tape className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Stamp>topic {topicIdx + 1}</Stamp>
              <p className="font-display mt-2 text-xl font-bold">
                {LECTURETTE_TOPICS[topicIdx % LECTURETTE_TOPICS.length]}
              </p>
              <p className="font-hand text-base text-muted-foreground">
                structure: intro → 2–3 points → conclusion
              </p>
            </div>
            <div className="text-center">
              <p className={`font-mono text-5xl font-bold tabular-nums ${running ? "pulse-ink text-chart-1" : "text-muted-foreground"}`}>
                {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
              </p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={toggleTimer} variant={running ? "outline" : "default"} className="gap-1.5">
                  {running ? <Square className="size-4" /> : <Play className="size-4" />}
                  {running ? "Stop" : "Start"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setTopicIdx((i) => i + 1)}>
                  New topic
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-border/70 pt-5 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Self-confidence (1–10): {confidence}
              </p>
              <Slider
                value={[confidence]}
                min={1}
                max={10}
                step={1}
                onValueChange={(v) => setConfidence(v[0])}
                className="max-w-sm"
              />
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What went well? What to improve? (filler words, eye contact, pace…)"
                className="mt-3 max-w-xl bg-background/50"
              />
            </div>
            <Button onClick={saveSession} className="gap-1.5 self-end">
              <Mic className="size-4" /> Save session
            </Button>
          </div>
        </PaperCard>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Speaking checklist */}
        <PaperCard withMargin className="p-5 sm:p-6">
          <SectionHeading title="Daily Speaking Checklist" note="tick before you speak" className="mb-2" />
          <Checklist
            items={SPEAKING_CHECKLIST.map((c, i) => ({
              id: String(i),
              title: c,
              done: checks[i] ?? false,
            }))}
            onToggle={(id, done) => setChecks((c) => ({ ...c, [Number(id)]: done }))}
            empty=""
          />
          <HandNote className="mt-3 text-lg">Read one paragraph of a newspaper aloud every morning.</HandNote>
        </PaperCard>

        {/* Recent sessions */}
        <PaperCard withMargin className="p-5 sm:p-6">
          <SectionHeading title="Recent Practice" note="last 30 days" className="mb-2" />
          {logs?.length ? (
            <ul className="divide-y divide-border/70">
              {(logs ?? []).slice(-8).reverse().map((l) => (
                <li key={l._id} className="flex items-center gap-3 py-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                    <Timer className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{l.kind}</p>
                    {l.note && <p className="truncate text-xs text-muted-foreground">{l.note}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground">{l.minutes} min</span>
                  {l.confidence != null && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold text-chart-2">
                      {l.confidence}/10
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-hand py-6 text-center text-lg text-muted-foreground">
              No sessions yet — run the timer once and save your first.
            </p>
          )}
        </PaperCard>
      </div>
      <Trash2 className="hidden" />
    </div>
  );
}
