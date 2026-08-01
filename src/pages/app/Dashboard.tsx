import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  FileCheck2,
  Flame,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import {
  PageHeader,
  PaperCard,
  ProgressRing,
  StatCard,
  Stamp,
  HandNote,
  Checklist,
  SectionHeading,
} from "@/components/notebook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addDays,
  daysBetween,
  fmtDayName,
  fmtLong,
  fmtShort,
  startOfWeek,
  todayStr,
  weekdayIndex,
} from "@/lib/date";
import { buildMission } from "@/data/mission";
import { DEFAULT_HABITS } from "@/data/habits";
import { SYLLABUS } from "@/data/syllabus";
import { computePredictions } from "@/lib/predictions";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const today = todayStr();

  const profile = useQuery(api.profile.getProfile);
  const tasks = useQuery(api.tasks.listTasks, { date: today });
  const goals = useQuery(api.tasks.listGoals, { weekStart: startOfWeek(today) });
  const habits = useQuery(api.habits.listHabits);
  const habitLogs = useQuery(api.habits.listHabitLogs, {
    from: addDays(today, -30),
    to: today,
  });
  const mocks = useQuery(api.mock.listMockTests);
  const syllabusProgress = useQuery(api.syllabus.listSyllabusProgress);
  const olqScores = useQuery(api.olq.listOlqScores, { from: addDays(today, -14), to: today });
  const medicalChecks = useQuery(api.medical.listMedicalChecks);
  const measurements = useQuery(api.fitness.listMeasurements, {
    from: addDays(today, -30),
    to: today,
  });

  const upsertProfile = useMutation(api.profile.upsertProfile);
  const seedHabits = useMutation(api.habits.seedHabits);
  const ensureMission = useMutation(api.tasks.ensureMissionTasks);
  const addTask = useMutation(api.tasks.addTask);
  const toggleTask = useMutation(api.tasks.toggleTask);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const addGoal = useMutation(api.tasks.addGoal);
  const toggleGoal = useMutation(api.tasks.toggleGoal);
  const deleteGoal = useMutation(api.tasks.deleteGoal);

  const [newTask, setNewTask] = useState("");
  const [newGoal, setNewGoal] = useState("");

  // Seed profile, habits and mission tasks on first load
  useEffect(() => {
    if (profile === undefined) return;
    if (!profile) {
      void upsertProfile({});
    }
    if (habits === undefined) return;
    if (habits.length === 0) {
      void seedHabits({ habits: DEFAULT_HABITS });
    }
  }, [profile, habits, upsertProfile, seedHabits]);

  const missionBlocks = useMemo(() => {
    if (profile === undefined) return [];
    const prog: Record<string, string> = {};
    for (const p of syllabusProgress ?? []) prog[p.itemId] = p.status;
    return buildMission(
      today,
      {
        wakeTime: profile?.wakeTime ?? "05:30",
        studyHours: profile?.studyHours ?? 6,
        fitnessMode: profile?.fitnessMode ?? "running",
        examDate: profile?.examDate ?? "2027-04-18",
      },
      prog,
    );
  }, [profile, syllabusProgress, today]);

  useEffect(() => {
    if (missionBlocks.length === 0) return;
    void ensureMission({
      date: today,
      blocks: missionBlocks.map((b, i) => ({
        title: b.title,
        category: b.category,
        order: i,
      })),
    });
  }, [missionBlocks, ensureMission, today]);

  const examDate = profile?.examDate ?? "2027-04-18";
  const daysLeft = Math.max(0, daysBetween(today, examDate));

  // Task completion
  const taskMap = useMemo(() => {
    const m = new Map<string, NonNullable<typeof tasks>[number]>();
    for (const t of tasks ?? []) m.set(t.title, t);
    return m;
  }, [tasks]);
  const doneCount = (tasks ?? []).filter((t) => t.done).length;
  const taskPct = (tasks?.length ?? 0) > 0 ? (doneCount / (tasks?.length ?? 1)) * 100 : 0;

  // Habit streaks (today + consecutive previous days)
  const streaks = useMemo(() => {
    const logsByHabit = new Map<string, Set<string>>();
    for (const l of habitLogs ?? []) {
      if (!l.done) continue;
      const s = logsByHabit.get(l.habitId) ?? new Set<string>();
      s.add(l.date);
      logsByHabit.set(l.habitId, s);
    }
    return (habits ?? []).map((h) => {
      let streak = 0;
      let d = today;
      // allow today to be pending
      const dates = logsByHabit.get(h._id);
      if (dates?.has(d)) streak++;
      else if (!dates?.has(d)) {
        // if today not done, start from yesterday
        d = addDays(d, -1);
      }
      while (dates?.has(d)) {
        streak++;
        d = addDays(d, -1);
      }
      return { habit: h, streak, todayDone: dates?.has(today) ?? false };
    });
  }, [habits, habitLogs, today]);
  const streakScore = streaks.length
    ? Math.min(100, Math.round((streaks.filter((s) => s.todayDone).length / streaks.length) * 100))
    : 0;

  // Predictions
  const preds = useMemo(() => {
    const prog: Record<string, string> = {};
    for (const p of syllabusProgress ?? []) prog[p.itemId] = p.status;
    return computePredictions({
      syllabusProgress: prog,
      syllabus: SYLLABUS,
      mocks: mocks ?? [],
      olqScores: olqScores ?? [],
      medicalChecks: medicalChecks ?? [],
      habitsStreakScore: streakScore,
    });
  }, [syllabusProgress, mocks, olqScores, medicalChecks, streakScore]);

  const bestMock = mocks?.length
    ? Math.max(...mocks.map((m) => (m.total ? (m.score / m.total) * 100 : 0)))
    : 0;
  const mockCount = mocks?.length ?? 0;

  const weekName = fmtDayName(today);
  const isSunday = weekdayIndex(today) === 6;

  const recentMeasure = measurements?.length ? measurements[measurements.length - 1] : undefined;

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    void addTask({ date: today, title: newTask.trim(), category: "personal" });
    setNewTask("");
    toast.success("Task added to today's page");
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    void addGoal({ weekStart: startOfWeek(today), title: newGoal.trim() });
    setNewGoal("");
    toast.success("Weekly goal noted");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="today's page"
        title={isSunday ? "Sunday — weekly mock day" : `Good ${weekName === "Sunday" ? "morning" : "morning"}, ${user?.name?.split(" ")[0] ?? "cadet"}`}
        description={`${fmtLong(today)} · ${daysLeft} days until the NDA written exam`}
        right={
          <div className="hidden items-center gap-3 rounded-lg border border-border/70 bg-card px-4 py-2 shadow-sm sm:flex">
            <Target className="size-5 text-chart-1" />
            <div>
              <p className="font-display text-2xl font-bold leading-none text-chart-1">{daysLeft}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                days to NDA
              </p>
            </div>
          </div>
        }
      />

      {/* Mission mode */}
      <section>
        <SectionHeading
          title="Mission Mode"
          note="auto-planned — tick as you go"
          className="mb-3"
        />
        <PaperCard ruled tape className="p-5 sm:p-6">
          <ol className="space-y-1">
            {missionBlocks.map((b, i) => {
              const t = taskMap.get(b.title);
              const done = t?.done ?? false;
              return (
                <li key={b.title} className="flex items-center gap-3 py-1.5">
                  <span className="font-display w-14 shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
                    {b.time}
                  </span>
                  <button
                    type="button"
                    onClick={() => t && void toggleTask({ id: t._id, done: !done })}
                    className={
                      done
                        ? "flex size-5 shrink-0 items-center justify-center rounded-md border-2 border-transparent bg-chart-1 text-white"
                        : "flex size-5 shrink-0 items-center justify-center rounded-md border-2 border-border hover:border-chart-1/60"
                    }
                    aria-label={done ? "Mark not done" : "Mark done"}
                  >
                    {done && <CheckCircle2 className="size-4" />}
                  </button>
                  <span
                    className={
                      done
                        ? "text-sm text-muted-foreground line-through decoration-chart-1/50"
                        : "text-sm font-medium"
                    }
                  >
                    {b.title}
                  </span>
                  <span className="font-hand ml-auto hidden text-sm text-muted-foreground sm:inline">
                    {b.note}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="margin-note mt-3 text-lg">"{isSunday ? "mock day" : "consistency"} beats intensity"</p>
        </PaperCard>
      </section>

      {/* Stats row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<FileCheck2 className="size-4" />}
          label="Written prediction"
          value={`${preds.writtenPredicted}/900`}
          note={`range ${preds.writtenRange[0]}–${preds.writtenRange[1]} · ${preds.writtenConfidence}% confident`}
          accent="var(--chart-1)"
        />
        <StatCard
          icon={<Target className="size-4" />}
          label="SSB readiness"
          value={`${preds.ssbReadiness}%`}
          note="from OLQ reflections & habits"
          accent="var(--chart-2)"
        />
        <StatCard
          icon={<CheckCircle2 className="size-4" />}
          label="Medical readiness"
          value={`${preds.medicalReadiness}%`}
          note="standards checklist progress"
          accent="var(--chart-3)"
        />
        <StatCard
          icon={<Flame className="size-4" />}
          label="Habits today"
          value={`${streaks.filter((s) => s.todayDone).length}/${streaks.length}`}
          note={`${streaks.reduce((a, s) => a + s.streak, 0)} total streak days`}
          accent="var(--chart-4)"
        />
      </section>

      {/* Progress rings */}
      <section className="grid gap-4 md:grid-cols-3">
        <PaperCard className="flex flex-col items-center justify-center p-6">
          <ProgressRing value={taskPct} label="Today's tasks" sub={`${doneCount}/${tasks?.length ?? 0} done`} color="var(--chart-1)" />
        </PaperCard>
        <PaperCard className="flex flex-col items-center justify-center p-6">
          <ProgressRing value={preds.ssbReadiness} label="SSB Readiness" sub="OLQ + habit-driven" color="var(--chart-2)" />
        </PaperCard>
        <PaperCard className="flex flex-col items-center justify-center p-6">
          <ProgressRing value={preds.medicalReadiness} label="Medical Readiness" sub="standards checklist" color="var(--chart-3)" />
        </PaperCard>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily tasks */}
        <PaperCard withMargin className="p-5 sm:p-6">
          <SectionHeading title="Daily Tasks" note="extra entries" className="mb-2" />
          <form
            className="mb-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
          >
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a task for today…"
              className="h-9"
            />
            <Button type="submit" size="sm" className="shrink-0 gap-1">
              <Plus className="size-4" /> Add
            </Button>
          </form>
          <Checklist
            items={(tasks ?? [])
              .filter((t) => t.category !== "mission")
              .map((t) => ({ id: t._id, title: t.title, done: t.done, tag: t.category }))}
            onToggle={(id, done) => void toggleTask({ id: id as Id<"tasks">, done })}
            onDelete={(id) => void deleteTask({ id: id as Id<"tasks"> })}
            empty="No extra tasks yet — the mission covers the day."
          />
          <div className="mt-4 border-t border-border/70 pt-3">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="size-3.5" /> Physical progress (today)
            </p>
            {recentMeasure ? (
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="font-hand text-lg">
                  ⚖ {recentMeasure.weight ? `${recentMeasure.weight} kg` : "no weight logged"}
                </span>
                <span className="font-hand text-lg">
                  😴 {recentMeasure.sleepHours ? `${recentMeasure.sleepHours} h sleep` : "no sleep logged"}
                </span>
                <span className="font-hand text-lg">
                  💧 {recentMeasure.waterL ? `${recentMeasure.waterL} L water` : "no water logged"}
                </span>
              </div>
            ) : (
              <p className="font-hand text-base text-muted-foreground">
                Log your first weight & sleep in <Link className="underline decoration-chart-1/50" to="/app/fitness">Fitness</Link>.
              </p>
            )}
          </div>
        </PaperCard>

        {/* Weekly goals */}
        <PaperCard withMargin className="p-5 sm:p-6">
          <SectionHeading title="Weekly Goals" note="week of " className="mb-2" />
          <p className="font-hand mb-2 text-sm text-muted-foreground">{fmtShort(startOfWeek(today))} onwards</p>
          <form
            className="mb-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddGoal();
            }}
          >
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Set a goal for this week…"
              className="h-9"
            />
            <Button type="submit" size="sm" className="shrink-0 gap-1">
              <Plus className="size-4" /> Add
            </Button>
          </form>
          <Checklist
            items={(goals ?? []).map((g) => ({ id: g._id, title: g.title, done: g.done }))}
            onToggle={(id, done) => void toggleGoal({ id: id as Id<"goals">, done })}
            onDelete={(id) => void deleteGoal({ id: id as Id<"goals"> })}
            empty="Set 2–3 realistic goals for this week."
          />
          <div className="mt-4 border-t border-border/70 pt-3">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <BarChart3 className="size-3.5" /> Mock test stats
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="font-display text-2xl font-bold text-chart-2">{mockCount}</p>
                <p className="text-[11px] text-muted-foreground">tests taken</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-chart-1">{bestMock.toFixed(0)}%</p>
                <p className="text-[11px] text-muted-foreground">best score</p>
              </div>
              <Link
                to="/app/mock"
                className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:underline"
              >
                Take a test <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </PaperCard>
      </div>

      {/* Streaks strip */}
      <section>
        <SectionHeading title="Habit Streaks" note="longest: see Habits" className="mb-3" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {streaks
            .slice()
            .sort((a, b) => b.streak - a.streak)
            .slice(0, 8)
            .map(({ habit, streak, todayDone }) => (
              <PaperCard key={habit._id} className="flex items-center gap-3 p-3.5">
                <div
                  className={
                    "flex size-9 shrink-0 items-center justify-center rounded-lg " +
                    (todayDone ? "bg-chart-1/15 text-chart-1" : "bg-muted text-muted-foreground")
                  }
                >
                  <Flame className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{habit.name}</p>
                  <p className="font-hand text-sm text-muted-foreground">
                    {streak} day{streak === 1 ? "" : "s"} {todayDone ? "🔥" : "· tick today"}
                  </p>
                </div>
              </PaperCard>
            ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Stamp>On track</Stamp>
          <HandNote className="text-lg">keep the chain unbroken</HandNote>
        </div>
      </section>

      <div className="flex justify-end">
        <Link
          to="/app/analytics"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow"
        >
          <BarChart3 className="size-4 text-chart-2" />
          Deep-dive into analytics
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <Trash2 className="hidden" /> {/* keep import used */}
    </div>
  );
}
