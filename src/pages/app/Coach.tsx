import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import {
  Bot,
  BrainCircuit,
  ChevronRight,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Play,
  Salad,
  Sparkles,
  Target,
} from "lucide-react";
import { PageHeader, PaperCard, SectionHeading, Stamp, HandNote } from "@/components/notebook";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addDays, daysBetween, fmtLong, todayStr, seededRandom } from "@/lib/date";
import { QUESTION_BANK, shuffle } from "@/data/questions";
import { PI_QUESTIONS } from "@/data/ssb";
import { SYLLABUS } from "@/data/syllabus";
import { pickQuote, pickTip } from "@/data/coach";
import { weakTopicsFromMocks, pickRevisionTopics } from "@/lib/predictions";
import { cn } from "@/lib/utils";

export default function Coach() {
  const today = todayStr();
  const from30 = addDays(today, -29);

  const profile = useQuery(api.profile.getProfile);
  const mocks = useQuery(api.mock.listMockTests);
  const syllabusProgress = useQuery(api.syllabus.listSyllabusProgress);
  const tasks = useQuery(api.tasks.listTasks, { date: today });
  const habits = useQuery(api.habits.listHabits);
  const habitLogs = useQuery(api.habits.listHabitLogs, { from: from30, to: today });
  const diet = useQuery(api.diet.listDiet, { date: today });
  const measurements = useQuery(api.fitness.listMeasurements, { from: addDays(today, -2), to: today });

  const [tab, setTab] = useState("briefing");
  const [quizSubject, setQuizSubject] = useState<"Maths" | "English" | "GK">("Maths");
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizDone, setQuizDone] = useState(false);
  const [piIdx, setPiIdx] = useState(0);

  const progressMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of syllabusProgress ?? []) m[p.itemId] = p.status;
    return m;
  }, [syllabusProgress]);

  const weak = useMemo(() => weakTopicsFromMocks(mocks ?? []), [mocks]);
  const revisionTopics = useMemo(
    () => pickRevisionTopics(SYLLABUS, progressMap, 4),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [syllabusProgress, mocks],
  );

  const doneToday = (tasks ?? []).filter((t) => t.done).length;
  const habitToday = (habitLogs ?? []).filter((l) => l.done && l.date === today).length;
  const dietProtein = (diet ?? []).reduce((a, e) => a + e.proteinG, 0);
  const latestWeight = measurements?.length ? measurements[measurements.length - 1].weight : undefined;

  const briefing = useMemo(() => {
    const examDate = profile?.examDate ?? "2027-04-18";
    const daysLeft = Math.max(0, daysBetween(today, examDate));
    const quotes: string[] = [];
    const actions: { icon: string; text: string }[] = [];

    if (daysLeft <= 90) quotes.push(`${daysLeft} days out — this is the sharpening window.`);
    if (weak.length) {
      const [top] = Object.entries(weak).sort((a, b) => b[1] - a[1]);
      actions.push({ icon: "target", text: `Your most-missed topic is "${top[0]}" (×${top[1]}). Re-solve 5 questions on it today.` });
    }
    if (revisionTopics.length) {
      actions.push({ icon: "refresh", text: `Revision queue: ${revisionTopics.map((t) => t.label).join(" · ")}` });
    }
    if (doneToday === 0) actions.push({ icon: "list", text: "No mission blocks ticked yet — start with the morning fitness block." });
    else if (doneToday < 4) actions.push({ icon: "list", text: `Good start — ${doneToday} blocks done. Push through the evening revision block.` });
    else actions.push({ icon: "sparkles", text: `${doneToday} blocks done. You're on track — protect the streak.` });

    if (dietProtein < 40) actions.push({ icon: "salad", text: `Protein at ${dietProtein}g today — add paneer or dal to hit ~60g.` });
    if (latestWeight) actions.push({ icon: "scale", text: `Weight logged: ${latestWeight} kg — keep measuring weekly, same time.` });

    const quote = pickQuote(Math.floor(seededRandom(today + "q") * 1000));
    const tip = pickTip(Math.floor(seededRandom(today + "t") * 1000));
    return { daysLeft, actions, quote, tip, habitToday };
  }, [weak, revisionTopics, doneToday, dietProtein, latestWeight, profile, today, habitToday]);

  const startQuiz = () => {
    setQuizIdx(0);
    setQuizAnswers({});
    setQuizDone(false);
  };

  const quiz = useMemo(() => {
    const bank = QUESTION_BANK.filter((q) => q.subject === quizSubject);
    return shuffle(bank, Math.floor(seededRandom(today + quizSubject) * 1000)).slice(0, 5);
  }, [quizSubject, today]);

  const quizScore = useMemo(() => {
    if (!quizDone) return null;
    return quiz.reduce((a, q) => a + (quizAnswers[q.id] === q.answer ? 1 : 0), 0);
  }, [quizDone, quiz, quizAnswers]);

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 16 · ai coach"
        title="AI Coach"
        description="A rule-based coach that reads your notebook: daily briefing, quiz generator, interview simulator, study planner and nutrition nudges. (LLM-ready — swap in a model API later.)"
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-auto flex-wrap gap-1 rounded-xl bg-transparent p-0">
          {[
            ["briefing", "Daily Briefing"],
            ["quiz", "Quiz Generator"],
            ["interview", "Interview Simulator"],
            ["planner", "Study Planner"],
            ["mistakes", "Mistake Analysis"],
            ["nutrition", "Nutrition"],
          ].map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="rounded-lg border border-border/70 bg-card px-4 py-2 data-[state=active]:border-transparent data-[state=active]:bg-chart-3 data-[state=active]:text-white">
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="briefing" className="mt-6">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <PaperCard ruled tape className="p-6">
              <div className="flex items-center justify-between">
                <Stamp>coach · {fmtLong(today)}</Stamp>
                <Bot className="size-5 text-chart-3" />
              </div>
              <p className="font-display mt-3 text-xl font-bold">
                {briefing.actions.length ? "Here's today's coaching" : "Quiet day — keep the routine."}
              </p>
              <ul className="mt-4 space-y-3">
                {briefing.actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-lg border border-border/70 bg-background/40 p-3 text-sm leading-6">
                    {a.icon === "target" && <Target className="mt-1 size-4 shrink-0 text-chart-1" />}
                    {a.icon === "refresh" && <Sparkles className="mt-1 size-4 shrink-0 text-chart-2" />}
                    {a.icon === "list" && <ListChecks className="mt-1 size-4 shrink-0 text-chart-3" />}
                    {a.icon === "salad" && <Salad className="mt-1 size-4 shrink-0 text-chart-4" />}
                    {a.icon === "scale" && <Lightbulb className="mt-1 size-4 shrink-0 text-chart-5" />}
                    <span>{a.text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-border/70 pt-4 font-hand text-lg leading-7">
                "{briefing.quote.text}" — {briefing.quote.author}
              </p>
            </PaperCard>

            <PaperCard withMargin className="p-6">
              <SectionHeading title="Motivation" note="rotates daily" className="mb-3" />
              <p className="rounded-lg bg-muted/50 p-4 text-sm leading-6">{briefing.tip}</p>
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">today's pulse</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/70 p-3">
                  <p className="text-xs text-muted-foreground">Mission blocks</p>
                  <p className="font-display text-xl font-bold text-chart-1">{doneToday}/{tasks?.length ?? 0}</p>
                </div>
                <div className="rounded-lg border border-border/70 p-3">
                  <p className="text-xs text-muted-foreground">Habits ticked</p>
                  <p className="font-display text-xl font-bold text-chart-3">{habitToday}/{habits?.length ?? 0}</p>
                </div>
                <div className="rounded-lg border border-border/70 p-3">
                  <p className="text-xs text-muted-foreground">Protein today</p>
                  <p className="font-display text-xl font-bold text-chart-4">{dietProtein}g</p>
                </div>
                <div className="rounded-lg border border-border/70 p-3">
                  <p className="text-xs text-muted-foreground">Days to NDA</p>
                  <p className="font-display text-xl font-bold text-chart-2">{briefing.daysLeft}</p>
                </div>
              </div>
            </PaperCard>
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <PaperCard ruled tape className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionHeading title="Daily Quiz" className="mb-0" />
              <div className="flex items-center gap-2">
                <Select value={quizSubject} onValueChange={(v) => setQuizSubject(v as typeof quizSubject)}>
                  <SelectTrigger size="sm" className="bg-background/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maths">Maths</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="GK">GK</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={startQuiz} className="gap-1.5">
                  <Play className="size-3.5" /> Regenerate
                </Button>
              </div>
            </div>

            {!quizDone ? (
              <>
                <p className="mt-4 text-sm font-medium">
                  <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-chart-3/15 text-[11px] font-bold text-chart-3">
                    {quizIdx + 1}
                  </span>
                  {quiz[quizIdx]?.question}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {quiz[quizIdx]?.options.map((opt, oi) => (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => {
                        setQuizAnswers((a) => ({ ...a, [quiz[quizIdx].id]: oi }));
                        if (quizIdx >= quiz.length - 1) setQuizDone(true);
                        else setQuizIdx((i) => i + 1);
                      }}
                      className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 text-left text-[13px] transition-all hover:border-chart-3/50 hover:bg-muted/40"
                    >
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-current text-[10px]">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
                <p className="font-hand mt-4 text-base text-muted-foreground">
                  answered {Object.keys(quizAnswers).length}/{quiz.length}
                </p>
              </>
            ) : (
              <div className="mt-4">
                <p className="font-display text-lg font-bold">
                  You scored {quizScore}/{quiz.length}
                </p>
                <ul className="mt-3 space-y-2">
                  {quiz.map((q) => (
                    <li key={q.id} className={cn("rounded-lg border p-3 text-sm", quizAnswers[q.id] === q.answer ? "border-chart-3/40 bg-chart-3/5" : "border-destructive/30 bg-destructive/5")}>
                      <p className="font-medium">{q.question}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{q.explanation}</p>
                    </li>
                  ))}
                </ul>
                <Button className="mt-4" onClick={() => setQuizDone(false)}>Retake</Button>
              </div>
            )}
          </PaperCard>
        </TabsContent>

        <TabsContent value="interview" className="mt-6">
          <PaperCard ruled tape className="p-6">
            <div className="flex items-center justify-between">
              <SectionHeading title="Interview Simulator" className="mb-0" />
              <Button size="sm" variant="outline" onClick={() => setPiIdx((i) => i + 1)}>
                Next question <ChevronRight className="size-4" />
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <MessageSquare className="size-3.5" /> {PI_QUESTIONS[piIdx % PI_QUESTIONS.length].category}
            </p>
            <p className="font-display mt-2 text-lg font-semibold">
              {PI_QUESTIONS[piIdx % PI_QUESTIONS.length].questions[0]}
            </p>
            <p className="font-hand mt-2 text-base text-muted-foreground">
              answer aloud for 2 minutes — then ask a friend to cross-question you.
            </p>
          </PaperCard>
        </TabsContent>

        <TabsContent value="planner" className="mt-6">
          <PaperCard withMargin className="p-6">
            <SectionHeading title="Study Planner" note="revision queue + focus order" className="mb-4" />
            {revisionTopics.length ? (
              <ol className="space-y-2.5">
                {revisionTopics.map((t, i) => (
                  <li key={t.id} className="flex items-center gap-3 rounded-lg border border-border/70 p-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-chart-1/10 text-xs font-bold text-chart-1">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.subject}</p>
                    </div>
                    <Sparkles className="size-4 text-chart-2" />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="font-hand py-4 text-center text-lg text-muted-foreground">
                Mark topics in the Written module and take mocks to feed the planner.
              </p>
            )}
            <p className="mt-4 border-t border-border/70 pt-3 text-xs leading-5 text-muted-foreground">
              Spaced repetition: revise a topic today, again in 3 days, again in 7 — then flag it
              "revision" in the Written module and the coach keeps it in rotation.
            </p>
          </PaperCard>
        </TabsContent>

        <TabsContent value="mistakes" className="mt-6">
          <PaperCard withMargin className="p-6">
            <SectionHeading title="Mistake Analysis" note="from mock wrong answers" className="mb-4" />
            {Object.keys(weak).length ? (
              <ul className="space-y-2.5">
                {Object.entries(weak)
                  .sort((a, b) => b[1] - a[1])
                  .map(([topic, count]) => (
                    <li key={topic} className="flex items-center gap-3">
                      <span className="w-44 shrink-0 truncate text-sm font-medium">{topic}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/60">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (count / Math.max(...Object.values(weak))) * 100)}%`,
                            background: "var(--chart-1)",
                          }}
                        />
                      </div>
                      <span className="w-14 shrink-0 text-right text-xs font-bold text-chart-1">×{count}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="font-hand py-4 text-center text-lg text-muted-foreground">
                No mistakes logged yet — take a mock test with wrong answers.
              </p>
            )}
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-[13px] leading-6">
              <BrainCircuit className="mt-0.5 size-4 shrink-0 text-chart-3" />
              <span>The pattern: most NDA mistakes come from careless reading and time pressure — drill 5 focused questions on each weak topic before the next full mock.</span>
            </p>
          </PaperCard>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-6">
          <PaperCard withMargin className="p-6">
            <SectionHeading title="Nutrition Suggestions" note="vegetarian-first" className="mb-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/70 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Salad className="size-4 text-chart-4" /> Protein timing
                </p>
                <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
                  You've logged {dietProtein}g today. Spread intake: breakfast (milk/eggs/sattu),
                  lunch (paneer/soy + dal), snack (peanuts/sprouts), dinner (dal/rajma). Aim for
                  20g per main meal.
                </p>
              </div>
              <div className="rounded-lg border border-border/70 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4 text-chart-3" /> Hydration & recovery
                </p>
                <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
                  Drink 2–3 L daily and add electrolytes on training days. Post-workout: curd or
                  buttermilk within an hour beats skipping it entirely.
                </p>
              </div>
            </div>
            <HandNote className="mt-4 block text-lg">
              occasional eggs? yes — they're your cheapest complete protein when you want them.
            </HandNote>
          </PaperCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
