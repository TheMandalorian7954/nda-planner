import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import { Flame, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, PaperCard, SectionHeading, Stamp, HandNote } from "@/components/notebook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDays, fmtShort, lastNDays, todayStr } from "@/lib/date";
import { toast } from "sonner";

export default function Habits() {
  const today = todayStr();
  const habits = useQuery(api.habits.listHabits);
  const logs = useQuery(api.habits.listHabitLogs, { from: addDays(today, -21), to: today });
  const toggleLog = useMutation(api.habits.toggleHabitLog);
  const addHabit = useMutation(api.habits.addHabit);
  const deleteHabit = useMutation(api.habits.deleteHabit);

  const [name, setName] = useState("");
  const days = lastNDays(14);

  const logsByHabit = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const l of logs ?? []) {
      if (!l.done) continue;
      const s = m.get(l.habitId) ?? new Set<string>();
      s.add(l.date);
      m.set(l.habitId, s);
    }
    return m;
  }, [logs]);

  const streakOf = (habitId: string) => {
    const dates = logsByHabit.get(habitId);
    let streak = 0;
    let d = today;
    if (!dates?.has(d)) d = addDays(d, -1);
    while (dates?.has(d)) {
      streak++;
      d = addDays(d, -1);
    }
    return streak;
  };

  const bestStreak = habits?.length
    ? Math.max(...habits.map((h) => streakOf(h._id)))
    : 0;

  const handleAdd = () => {
    if (!name.trim()) return;
    void addHabit({ name: name.trim(), icon: "Repeat" });
    setName("");
    toast.success("Habit added to your chain");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 12 · habits"
        title="Habits & Streaks"
        description="Twelve core habits, ticked daily. The streak is the point — consistency compounds into everything else."
        right={
          <PaperCard className="px-5 py-3 text-center">
            <p className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Flame className="size-3.5 text-chart-4" /> best streak
            </p>
            <p className="font-display text-3xl font-bold text-chart-4">{bestStreak}</p>
            <p className="text-[11px] text-muted-foreground">days</p>
          </PaperCard>
        }
      />

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a habit… (e.g. Cold shower)"
          className="max-w-sm bg-card"
        />
        <Button type="submit" className="gap-1.5">
          <Plus className="size-4" /> Add habit
        </Button>
      </form>

      <PaperCard ruled tape className="overflow-x-auto p-5 sm:p-6">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Habit
              </th>
              {days.map((d) => (
                <th key={d} className="pb-3 text-center text-[10px] font-medium text-muted-foreground">
                  <span className="hidden sm:inline">{fmtShort(d)}</span>
                  <span className="sm:hidden">{d.slice(8)}</span>
                </th>
              ))}
              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Streak
              </th>
            </tr>
          </thead>
          <tbody>
            {(habits ?? []).map((h) => {
              const dates = logsByHabit.get(h._id);
              const streak = streakOf(h._id);
              return (
                <tr key={h._id} className="group border-t border-border/60">
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="max-w-[180px] truncate text-sm font-medium">{h.name}</span>
                      <button
                        type="button"
                        className="opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
                        onClick={() => void deleteHabit({ id: h._id })}
                        aria-label={`Delete ${h.name}`}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </button>
                    </div>
                  </td>
                  {days.map((d) => {
                    const done = dates?.has(d) ?? false;
                    return (
                      <td key={d} className="py-2 text-center">
                        <button
                          type="button"
                          aria-label={`${h.name} on ${d}`}
                          onClick={() => void toggleLog({ habitId: h._id, date: d, done: !done })}
                          className={cn(
                            "mx-auto flex size-6 items-center justify-center rounded-md border-2 text-[10px] font-bold transition-all",
                            done
                              ? "border-transparent bg-chart-1 text-white"
                              : d === today
                                ? "border-chart-1/40 hover:bg-chart-1/10"
                                : "border-border hover:bg-muted",
                          )}
                        >
                          {done ? "✓" : ""}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-2 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-chart-4/15 px-2 py-0.5 text-xs font-bold text-chart-4">
                      <Flame className="size-3" /> {streak}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!habits?.length && (
          <p className="font-hand py-6 text-center text-lg text-muted-foreground">
            No habits yet — they seed automatically from your dashboard, or add one above.
          </p>
        )}
      </PaperCard>

      <div className="flex items-center gap-2">
        <Stamp>Chain</Stamp>
        <HandNote className="text-lg">never break two days in a row — one miss is fine, two is a new start</HandNote>
      </div>
    </div>
  );
}
