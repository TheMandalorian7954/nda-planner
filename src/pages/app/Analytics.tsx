import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight, CalendarDays, LineChart, Target, TrendingUp, Weight } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  LineChart as ReLineChart,
  Legend,
} from "recharts";
import { PageHeader, PaperCard, SectionHeading, HandNote, Stamp, StatCard } from "@/components/notebook";
import { addDays, daysBetween, fmtShort, lastNDays, todayStr, weekdayIndex } from "@/lib/date";
import { SYLLABUS } from "@/data/syllabus";
import { computePredictions, weakTopicsFromMocks } from "@/lib/predictions";
import { cn } from "@/lib/utils";

export default function Analytics() {
  const today = todayStr();
  const from30 = addDays(today, -29);
  const from90 = addDays(today, -89);

  const study = useQuery(api.study.listStudy, { from: from90, to: today });
  const mocks = useQuery(api.mock.listMockTests);
  const measurements = useQuery(api.fitness.listMeasurements, { from: from90, to: today });
  const tasks = useQuery(api.tasks.listTasks, { date: today });
  const syllabusProgress = useQuery(api.syllabus.listSyllabusProgress);
  const olqScores = useQuery(api.olq.listOlqScores, { from: from30, to: today });
  const medicalChecks = useQuery(api.medical.listMedicalChecks);
  const habits = useQuery(api.habits.listHabits);
  const habitLogs = useQuery(api.habits.listHabitLogs, { from: from30, to: today });

  // --- Study hours per day (last 14 days) ---
  const studyByDay = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of study ?? []) m.set(s.date, (m.get(s.date) ?? 0) + s.hours);
    return lastNDays(14).map((d) => ({
      date: fmtShort(d),
      hours: Math.round((m.get(d) ?? 0) * 10) / 10,
    }));
  }, [study]);

  // --- Mock trend ---
  const mockTrend = useMemo(
    () =>
      (mocks ?? [])
        .slice(-12)
        .map((m) => ({
          date: fmtShort(m.date),
          score: Math.round(((m.total ? m.score / m.total : 0)) * 100),
          subject: m.subject,
        })),
    [mocks],
  );

  // --- Weight trend ---
  const weightTrend = useMemo(
    () =>
      (measurements ?? [])
        .filter((m) => m.weight != null)
        .slice(-12)
        .map((m) => ({ date: fmtShort(m.date), weight: m.weight! })),
    [measurements],
  );

  // --- Heatmap: last 12 weeks, Mon-first columns ---
  const heatmap = useMemo(() => {
    const cells: { date: string; intensity: number }[] = [];
    const studySet = new Map<string, number>();
    for (const s of study ?? []) studySet.set(s.date, (studySet.get(s.date) ?? 0) + s.hours);
    const habitDone = new Map<string, number>();
    for (const l of habitLogs ?? []) if (l.done) habitDone.set(l.date, (habitDone.get(l.date) ?? 0) + 1);
    const habitCount = Math.max(habits?.length ?? 1, 1);

    for (let w = 11; w >= 0; w--) {
      for (let d = 0; d < 7; d++) {
        const date = addDays(addDays(today, -weekdayIndex(today)), -(w * 7) + (d - 6));
        if (daysBetween(date, today) < 0) continue;
        const studyH = studySet.get(date) ?? 0;
        const habitsDone = habitDone.get(date) ?? 0;
        const ratio = Math.min(1, studyH / 4) * 0.6 + (habitsDone / habitCount) * 0.4;
        cells.push({ date, intensity: ratio });
      }
    }
    return cells;
  }, [study, habitLogs, habits, today]);

  // --- Predictions ---
  const preds = useMemo(() => {
    const prog: Record<string, string> = {};
    for (const p of syllabusProgress ?? []) prog[p.itemId] = p.status;
    const streakScore = 0; // simplified here
    return computePredictions({
      syllabusProgress: prog,
      syllabus: SYLLABUS,
      mocks: mocks ?? [],
      olqScores: olqScores ?? [],
      medicalChecks: medicalChecks ?? [],
      habitsStreakScore: streakScore,
    });
  }, [syllabusProgress, mocks, olqScores, medicalChecks]);

  const weak = weakTopicsFromMocks(mocks ?? []);
  const weakSorted = Object.entries(weak).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const doneTasks = (tasks ?? []).filter((t) => t.done).length;
  const heatColor = (i: number) => {
    if (i <= 0.05) return "var(--border)";
    if (i < 0.3) return "color-mix(in oklch, var(--chart-3) 30%, transparent)";
    if (i < 0.6) return "color-mix(in oklch, var(--chart-3) 60%, transparent)";
    return "var(--chart-3)";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 14 · analytics"
        title="Analytics"
        description="Every tick, rep and mock feeds these charts. Watch the trend, not the day."
      />

      {/* Predictions */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={<TrendingUp className="size-4" />} label="Predicted written" value={`${preds.writtenPredicted}/900`} note={`${preds.writtenRange[0]}–${preds.writtenRange[1]} range`} accent="var(--chart-1)" />
        <StatCard icon={<Target className="size-4" />} label="Predicted SSB readiness" value={`${preds.ssbReadiness}%`} note="from OLQ + consistency" accent="var(--chart-2)" />
        <StatCard icon={<CalendarDays className="size-4" />} label="Medical readiness" value={`${preds.medicalReadiness}%`} note="standards checklist" accent="var(--chart-3)" />
      </section>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-2">
        <PaperCard withMargin className="p-5">
          <SectionHeading title="Study Hours" note="last 14 days" className="mb-3" />
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyByDay}>
                <defs>
                  <linearGradient id="study" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--rule-line)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--paper-ink-soft)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--paper-ink-soft)" width={30} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="hours" stroke="var(--chart-1)" strokeWidth={2} fill="url(#study)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Link to="/app/dashboard" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
            Log study hours on the dashboard <ArrowRight className="size-3" />
          </Link>
        </PaperCard>

        <PaperCard withMargin className="p-5">
          <SectionHeading title="Mock Score Trend" note="% accuracy" className="mb-3" />
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={mockTrend}>
                <CartesianGrid stroke="var(--rule-line)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--paper-ink-soft)" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="var(--paper-ink-soft)" width={30} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3, fill: "var(--chart-2)" }} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
          {mockTrend.length === 0 && (
            <p className="font-hand -mt-36 text-center text-base text-muted-foreground">take a mock to start this line</p>
          )}
        </PaperCard>

        <PaperCard withMargin className="p-5">
          <SectionHeading title="Weight Trend" note="kg" className="mb-3" />
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={weightTrend}>
                <CartesianGrid stroke="var(--rule-line)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--paper-ink-soft)" />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} stroke="var(--paper-ink-soft)" width={34} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="weight" stroke="var(--chart-4)" strokeWidth={2} dot={{ r: 3, fill: "var(--chart-4)" }} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
          {weightTrend.length === 0 && (
            <p className="font-hand -mt-28 text-center text-base text-muted-foreground">log weight in Fitness to chart it</p>
          )}
        </PaperCard>

        {/* Heatmap */}
        <PaperCard withMargin className="p-5">
          <SectionHeading title="Consistency Heatmap" note="study + habits · 12 weeks" className="mb-3" />
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, d) => (
              <div key={d} className="flex flex-1 flex-col gap-1.5">
                <span className="text-center text-[9px] uppercase text-muted-foreground">
                  {["M", "T", "W", "T", "F", "S", "S"][d]}
                </span>
                {heatmap
                  .filter((c) => weekdayIndex(c.date) === d)
                  .map((c) => (
                    <div
                      key={c.date}
                      title={`${c.date} · ${(c.intensity * 100).toFixed(0)}%`}
                      className="aspect-square w-full rounded-[4px]"
                      style={{ background: heatColor(c.intensity) }}
                    />
                  ))}
              </div>
            ))}
          </div>
          <p className="font-hand mt-3 text-sm text-muted-foreground">
            greener = a fuller day · today {doneTasks}/{tasks?.length ?? 0} tasks done
          </p>
        </PaperCard>
      </div>

      {/* Weak topics */}
      <section>
        <SectionHeading title="Weak Topics" note="from wrong answers in mocks" className="mb-3" />
        <PaperCard withMargin className="p-5">
          {weakSorted.length ? (
            <ul className="space-y-2.5">
              {weakSorted.map(([topic, count]) => (
                <li key={topic} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-sm font-medium">{topic}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/60">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (count / Math.max(...weakSorted.map((w) => w[1]))) * 100)}%`,
                        background: "var(--chart-1)",
                      }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs font-bold text-chart-1">×{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-hand py-4 text-center text-lg text-muted-foreground">
              Complete a mock with wrong answers to reveal your weak spots.
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-3">
            <Stamp>Revise</Stamp>
            <HandNote className="text-lg">attack the top 3 weak topics before the next mock</HandNote>
          </div>
        </PaperCard>
      </section>
      <LineChart className="hidden" />
      <Weight className="hidden" />
    </div>
  );
}
