import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, Clock, Play, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, PaperCard, SectionHeading, Stamp, HandNote, StatCard } from "@/components/notebook";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QUESTION_BANK, shuffle } from "@/data/questions";
import { todayStr } from "@/lib/date";
import { toast } from "sonner";

const NEGATIVE = 1 / 3;

export default function MockTests() {
  const today = todayStr();
  const results = useQuery(api.mock.listMockTests);
  const save = useMutation(api.mock.saveMockResult);

  const [subject, setSubject] = useState<"Maths" | "English" | "GK">("Maths");
  const [count, setCount] = useState(10);
  const [minutes, setMinutes] = useState(20);
  const [phase, setPhase] = useState<"config" | "running" | "done">("config");
  const [questions, setQuestions] = useState<typeof QUESTION_BANK>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);

  const start = () => {
    const bank = QUESTION_BANK.filter((q) => q.subject === subject);
    const picked = shuffle(bank).slice(0, Math.min(count, bank.length));
    setQuestions(picked);
    setAnswers({});
    setSecondsLeft(minutes * 60);
    setPhase("running");
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setPhase("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const finish = () => {
    setPhase("done");
  };

  const stats = useMemo(() => {
    if (phase !== "done") return null;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    for (const q of questions) {
      const a = answers[q.id];
      if (a === undefined) skipped++;
      else if (a === q.answer) correct++;
      else wrong++;
    }
    const score = correct - wrong * NEGATIVE;
    return { correct, wrong, skipped, score, total: questions.length };
  }, [phase, questions, answers]);

  const saveResult = () => {
    if (!stats) return;
    const weakTopics = questions
      .filter((q) => answers[q.id] !== undefined && answers[q.id] !== q.answer)
      .map((q) => q.topic);
    void save({
      date: today,
      title: `${subject} · ${count} questions`,
      subject,
      total: questions.length,
      correct: stats.correct,
      wrong: stats.wrong,
      skipped: stats.skipped,
      score: Math.round(stats.score * 100) / 100,
      weakTopics: [...new Set(weakTopics)],
    });
    toast.success("Result saved to your notebook");
    setPhase("config");
  };

  const avgPct = results?.length
    ? (results.reduce((a, r) => a + (r.total ? r.score / r.total : 0), 0) / results.length) * 100
    : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 13 · mock tests"
        title="Mock Tests"
        description="Sectional and full NDA-style tests with negative marking (−⅓ per wrong answer) — every attempt feeds your analytics."
        right={
          <div className="flex gap-3">
            <PaperCard className="px-4 py-2 text-center">
              <p className="font-display text-xl font-bold text-chart-1">{results?.length ?? 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">attempts</p>
            </PaperCard>
            <PaperCard className="px-4 py-2 text-center">
              <p className="font-display text-xl font-bold text-chart-2">{avgPct.toFixed(0)}%</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">avg accuracy</p>
            </PaperCard>
          </div>
        }
      />

      {phase === "config" && (
        <PaperCard tape ruled className="p-6 sm:p-8">
          <SectionHeading title="Configure your test" className="mb-4" />
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Subject</p>
              <Select value={subject} onValueChange={(v) => setSubject(v as typeof subject)}>
                <SelectTrigger className="w-full bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maths">Mathematics</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="GK">General Knowledge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Questions</p>
              <Select value={String(count)} onValueChange={(v) => setCount(Number(v))}>
                <SelectTrigger className="w-full bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} questions</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Time limit</p>
              <Select value={String(minutes)} onValueChange={(v) => setMinutes(Number(v))}>
                <SelectTrigger className="w-full bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 45].map((m) => (
                    <SelectItem key={m} value={String(m)}>{m} minutes</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="font-hand mt-3 text-base text-muted-foreground">
            marking: +1 correct, −⅓ wrong, 0 skipped — exactly like the NDA.
          </p>
          <Button onClick={start} className="mt-5 gap-2">
            <Play className="size-4" /> Start test
          </Button>
        </PaperCard>
      )}

      {phase === "running" && (
        <PaperCard ruled className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <Stamp>in progress</Stamp>
            <span className="inline-flex items-center gap-1.5 font-mono text-lg font-bold text-chart-1">
              <Clock className="size-5" />
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </span>
          </div>
          <ol className="space-y-4">
            {questions.map((q, i) => (
              <li key={q.id} className="rounded-lg border border-border/70 p-4">
                <p className="text-sm font-medium">
                  <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-chart-1/10 text-[11px] font-bold text-chart-1">
                    {i + 1}
                  </span>
                  {q.question}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={cn(
                        "flex items-center gap-2 rounded-md border px-3 py-2 text-left text-[13px] transition-all",
                        answers[q.id] === oi
                          ? "border-chart-2 bg-chart-2/10 font-medium"
                          : "border-border/70 hover:border-chart-2/40 hover:bg-muted/40",
                      )}
                    >
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-current text-[10px]">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex justify-between">
            <p className="font-hand text-base text-muted-foreground">
              answered: {Object.keys(answers).length}/{questions.length}
            </p>
            <Button onClick={finish}>Submit test</Button>
          </div>
        </PaperCard>
      )}

      {phase === "done" && stats && (
        <PaperCard tape ruled className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeading title="Test complete" className="mb-0" />
            <Stamp>{"score " + (stats.score > 0 ? "+" : "") + stats.score.toFixed(2)}</Stamp>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border/70 p-3 text-center">
              <p className="text-xs text-muted-foreground">Correct</p>
              <p className="font-display text-2xl font-bold text-chart-3">{stats.correct}</p>
            </div>
            <div className="rounded-lg border border-border/70 p-3 text-center">
              <p className="text-xs text-muted-foreground">Wrong (−⅓)</p>
              <p className="font-display text-2xl font-bold text-destructive">{stats.wrong}</p>
            </div>
            <div className="rounded-lg border border-border/70 p-3 text-center">
              <p className="text-xs text-muted-foreground">Skipped</p>
              <p className="font-display text-2xl font-bold text-muted-foreground">{stats.skipped}</p>
            </div>
            <div className="rounded-lg border border-border/70 p-3 text-center">
              <p className="text-xs text-muted-foreground">Net score</p>
              <p className="font-display text-2xl font-bold text-chart-1">{stats.score.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {questions.map((q, i) => {
              const picked = answers[q.id];
              const isCorrect = picked === q.answer;
              const isSkipped = picked === undefined;
              return (
                <div key={q.id} className={cn("rounded-lg border p-3.5", isCorrect ? "border-chart-3/40 bg-chart-3/5" : isSkipped ? "border-border/70" : "border-destructive/30 bg-destructive/5")}>
                  <p className="flex items-start gap-2 text-sm">
                    {isCorrect ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-chart-3" />
                    ) : isSkipped ? (
                      <span className="mt-0.5 size-4 shrink-0 rounded-full border border-border" />
                    ) : (
                      <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    )}
                    <span>
                      <span className="font-medium">{q.question}</span>
                      {!isCorrect && !isSkipped && (
                        <span className="mt-1 block text-xs text-muted-foreground">
                          your pick: {q.options[picked]} — correct: {q.options[q.answer]}
                        </span>
                      )}
                      {isSkipped && (
                        <span className="mt-1 block text-xs text-muted-foreground">
                          correct: {q.options[q.answer]}
                        </span>
                      )}
                      <span className="mt-1 block text-xs text-muted-foreground">
                        <span className="rounded bg-muted px-1 py-0.5 font-medium text-foreground">{q.topic}</span> — {q.explanation}
                      </span>
                    </span>
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-2">
            <Button onClick={saveResult} className="gap-2">
              Save to analytics <ChevronRight className="size-4" />
            </Button>
            <Button variant="outline" onClick={() => setPhase("config")}>
              New test
            </Button>
          </div>
        </PaperCard>
      )}

      {/* History */}
      <section>
        <SectionHeading title="Recent Results" note="all attempts" className="mb-3" />
        <PaperCard withMargin className="p-5">
          {results?.length ? (
            <ul className="divide-y divide-border/70">
              {(results ?? []).slice(-8).reverse().map((r) => (
                <li key={r._id} className="flex items-center gap-3 py-2.5 text-sm">
                  <span className="w-20 shrink-0 font-medium">{r.subject}</span>
                  <span className="truncate text-muted-foreground">{r.title}</span>
                  <span className="ml-auto flex shrink-0 gap-2 text-xs">
                    <span className="text-chart-3">{r.correct}✓</span>
                    <span className="text-destructive">{r.wrong}✗</span>
                    <span className="text-muted-foreground">{r.skipped}—</span>
                  </span>
                  <span className="w-16 shrink-0 text-right font-display font-bold text-chart-1">
                    {r.score.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-hand py-6 text-center text-lg text-muted-foreground">
              No results yet — your first test is waiting above.
            </p>
          )}
        </PaperCard>
      </section>
    </div>
  );
}
