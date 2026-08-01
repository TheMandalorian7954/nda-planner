import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import { Dumbbell, Plus, Ruler, Trash2 } from "lucide-react";
import { PageHeader, PaperCard, SectionHeading, Stamp, HandNote, StatCard } from "@/components/notebook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EXERCISES } from "@/data/exercises";
import { addDays, fmtShort, todayStr } from "@/lib/date";
import { toast } from "sonner";

const MEASURE_FIELDS = [
  { key: "weight", label: "Weight (kg)", step: 0.1 },
  { key: "bodyFat", label: "Body Fat %", step: 0.1 },
  { key: "waist", label: "Waist (cm)", step: 0.5 },
  { key: "chest", label: "Chest (cm)", step: 0.5 },
  { key: "shoulders", label: "Shoulders (cm)", step: 0.5 },
  { key: "arms", label: "Arms (cm)", step: 0.5 },
  { key: "legs", label: "Legs (cm)", step: 0.5 },
] as const;

const WELLNESS = [
  { key: "sleepHours", label: "Sleep (hours)", step: 0.5 },
  { key: "waterL", label: "Water (litres)", step: 0.1 },
  { key: "calories", label: "Calories", step: 10 },
  { key: "proteinG", label: "Protein (g)", step: 1 },
] as const;

export default function Fitness() {
  const today = todayStr();
  const from = addDays(today, -30);
  const logs = useQuery(api.fitness.listFitness, { from, to: today });
  const measurements = useQuery(api.fitness.listMeasurements, { from, to: today });
  const logFitness = useMutation(api.fitness.logFitness);
  const upsertMeasurements = useMutation(api.fitness.upsertMeasurements);

  const [activity, setActivity] = useState(EXERCISES[0].name);
  const [value, setValue] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});

  const todayLogs = (logs ?? []).filter((l) => l.date === today);
  const recent = measurements?.length ? measurements[measurements.length - 1] : undefined;

  const totals = useMemo(() => {
    const out: Record<string, number> = {};
    for (const l of logs ?? []) out[l.activity] = (out[l.activity] ?? 0) + l.value;
    return out;
  }, [logs]);

  const ex = EXERCISES.find((e) => e.name === activity)!;

  const saveLog = () => {
    const v = parseFloat(value);
    if (isNaN(v) || v <= 0) {
      toast.error("Enter a valid number");
      return;
    }
    void logFitness({ date: today, activity, value: v, unit: ex.unit });
    setValue("");
    toast.success(`${activity}: +${v} ${ex.unit}`);
  };

  const saveMeasurements = () => {
    const patch: Record<string, number> = {};
    for (const f of [...MEASURE_FIELDS, ...WELLNESS]) {
      const v = parseFloat(form[f.key] ?? "");
      if (!isNaN(v)) patch[f.key] = v;
    }
    void upsertMeasurements({ date: today, ...patch });
    setForm({});
    toast.success("Measurements saved for today");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 9 · physical fitness"
        title="Physical Fitness"
        description="Log every push-up, run and plank. Track weight, measurements, sleep, water and nutrition in one place."
      />

      {/* Quick log */}
      <section>
        <SectionHeading title="Quick Exercise Log" note="today" className="mb-3" />
        <PaperCard ruled tape className="p-5 sm:p-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px]">
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Exercise</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger className="w-full bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXERCISES.map((e) => (
                    <SelectItem key={e.name} value={e.name}>
                      {e.name} ({e.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-36">
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Value ({ex.unit})
              </Label>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`e.g. 15 ${ex.unit}`}
                type="number"
                className="bg-background/60"
                onKeyDown={(e) => e.key === "Enter" && saveLog()}
              />
            </div>
            <Button onClick={saveLog} className="gap-1.5">
              <Plus className="size-4" /> Log it
            </Button>
          </div>
          <p className="font-hand mt-2 text-sm text-muted-foreground">hint: {ex.hint}</p>

          {todayLogs.length > 0 && (
            <div className="mt-4 border-t border-border/70 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today</p>
              <div className="flex flex-wrap gap-2">
                {todayLogs.map((l) => (
                  <span key={l._id} className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs">
                    {l.activity}: <strong>{l.value}</strong> {l.unit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </PaperCard>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Dumbbell className="size-4" />} label="Sessions (30d)" value={(logs ?? []).length} note={`${Object.keys(totals).length} different activities`} accent="var(--chart-1)" />
        <StatCard icon={<Dumbbell className="size-4" />} label="Run distance (30d)" value={`${(totals["Running"] ?? 0).toFixed(1)} km`} note="keep the legs honest" accent="var(--chart-2)" />
        <StatCard icon={<Dumbbell className="size-4" />} label="Push-up volume (30d)" value={`${totals["Push-ups"] ?? 0} reps`} note="daily 3 sets beats weekly 1" accent="var(--chart-3)" />
        <StatCard icon={<Dumbbell className="size-4" />} label="Weight" value={recent?.weight ? `${recent.weight} kg` : "—"} note={recent ? `logged ${fmtShort(recent.date)}` : "log in the sheet below"} accent="var(--chart-4)" />
      </section>

      {/* Measurements */}
      <section>
        <SectionHeading title="Body & Wellness Sheet" note="same time each morning" className="mb-3" />
        <PaperCard withMargin className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MEASURE_FIELDS.map((f) => (
              <div key={f.key}>
                <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{f.label}</Label>
                <Input
                  type="number"
                  step={f.step}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((m) => ({ ...m, [f.key]: e.target.value }))}
                  placeholder={recent?.[f.key] ? `last: ${recent[f.key]}` : "—"}
                  className="bg-background/60"
                />
              </div>
            ))}
            {WELLNESS.map((f) => (
              <div key={f.key}>
                <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{f.label}</Label>
                <Input
                  type="number"
                  step={f.step}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((m) => ({ ...m, [f.key]: e.target.value }))}
                  placeholder={recent?.[f.key] ? `last: ${recent[f.key]}` : "—"}
                  className="bg-background/60"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={saveMeasurements} className="gap-1.5">
              <Ruler className="size-4" /> Save sheet
            </Button>
            <HandNote className="text-lg">measure once, weigh twice — consistency over precision</HandNote>
          </div>
        </PaperCard>
      </section>
      <Trash2 className="hidden" />
    </div>
  );
}
