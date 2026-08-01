import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import { Apple, Droplets, Plus, Trash2 } from "lucide-react";
import { PageHeader, PaperCard, SectionHeading, Stamp, HandNote, ProgressBar } from "@/components/notebook";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FOODS, PROTEIN_TARGETS } from "@/data/diet";
import { addDays, fmtShort, todayStr } from "@/lib/date";
import { toast } from "sonner";

const MEALS = ["Breakfast", "Lunch", "Snack", "Dinner"] as const;

export default function Diet() {
  const today = todayStr();
  const entries = useQuery(api.diet.listDiet, { date: today });
  const measurements = useQuery(api.fitness.listMeasurements, { from: addDays(today, -2), to: today });
  const logDiet = useMutation(api.diet.logDiet);
  const deleteDiet = useMutation(api.diet.deleteDiet);
  const upsertMeasurements = useMutation(api.fitness.upsertMeasurements);

  const [food, setFood] = useState(FOODS[0].name);
  const [meal, setMeal] = useState<(typeof MEALS)[number]>("Breakfast");
  const [water, setWater] = useState("");

  const foodObj = FOODS.find((f) => f.name === food)!;

  const totals = useMemo(() => {
    const protein = (entries ?? []).reduce((a, e) => a + e.proteinG, 0);
    const calories = (entries ?? []).reduce((a, e) => a + e.calories, 0);
    const recentWater = measurements?.length ? measurements[measurements.length - 1].waterL : undefined;
    return { protein, calories, water: recentWater ?? 0 };
  }, [entries, measurements]);

  const target = PROTEIN_TARGETS.intermediate;

  const addEntry = () => {
    const perGrams = foodObj.servingGrams;
    const protein = Math.round(foodObj.proteinPer100 * (perGrams / 100) * 10) / 10;
    const calories = Math.round(foodObj.caloriesPer100 * (perGrams / 100));
    void logDiet({ date: today, meal, food: `${food} (${foodObj.serving})`, proteinG: protein, calories });
    toast.success(`${food} logged — ${protein}g protein`);
  };

  const saveWater = () => {
    const v = parseFloat(water);
    if (isNaN(v)) return;
    void upsertMeasurements({ date: today, waterL: v });
    setWater("");
    toast.success(`Water set to ${v} L`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 11 · diet"
        title="Diet & Nutrition"
        description="Vegetarian-first protein tracking (eggs optional), calories, micronutrients and water — because SSB physicals start at the dining table."
      />

      {/* Daily totals */}
      <section className="grid gap-4 sm:grid-cols-3">
        <PaperCard withMargin className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Protein</p>
          <p className="font-display mt-1 text-3xl font-bold text-chart-1">
            {totals.protein}<span className="text-base font-medium text-muted-foreground"> / {target}g</span>
          </p>
          <ProgressBar value={(totals.protein / target) * 100} color="var(--chart-1)" className="mt-2" />
        </PaperCard>
        <PaperCard withMargin className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Calories</p>
          <p className="font-display mt-1 text-3xl font-bold text-chart-2">
            {totals.calories}<span className="text-base font-medium text-muted-foreground"> kcal</span>
          </p>
          <p className="font-hand mt-2 text-sm text-muted-foreground">~2,200 kcal/day target for a training cadet</p>
        </PaperCard>
        <PaperCard withMargin className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Water</p>
          <p className="font-display mt-1 text-3xl font-bold text-chart-3">
            {totals.water}<span className="text-base font-medium text-muted-foreground"> L</span>
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="number"
              step={0.1}
              value={water}
              onChange={(e) => setWater(e.target.value)}
              placeholder="Set today's total"
              className="h-8 w-28 rounded-md border border-input bg-background/60 px-2 text-sm"
            />
            <Button size="sm" variant="outline" onClick={saveWater} className="gap-1">
              <Droplets className="size-3.5" /> Save
            </Button>
          </div>
        </PaperCard>
      </section>

      {/* Food logger */}
      <section>
        <SectionHeading title="Protein Logger" note="Indian vegetarian pantry" className="mb-3" />
        <PaperCard ruled tape className="p-5 sm:p-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px]">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Food</p>
              <Select value={food} onValueChange={setFood}>
                <SelectTrigger className="w-full bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOODS.map((f) => (
                    <SelectItem key={f.name} value={f.name}>
                      {f.name} · {f.proteinPer100}g/100g
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Meal</p>
              <Select value={meal} onValueChange={(v) => setMeal(v as (typeof MEALS)[number])}>
                <SelectTrigger className="w-full bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEALS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted/60 px-3 py-2 text-xs">
              <p><strong className="font-semibold">{foodObj.serving}</strong> → <span className="text-chart-1 font-semibold">{Math.round(foodObj.proteinPer100 * foodObj.servingGrams / 100 * 10) / 10}g protein</span> · <span className="font-semibold">{Math.round(foodObj.caloriesPer100 * foodObj.servingGrams / 100)} kcal</span></p>
            </div>
            <Button onClick={addEntry} className="gap-1.5">
              <Plus className="size-4" /> Add to {meal}
            </Button>
          </div>
          <p className="font-hand mt-2 text-sm text-muted-foreground">
            tip: paneer + dal + soy at different meals spreads your protein across the day.
          </p>
        </PaperCard>
      </section>

      {/* Today's log */}
      <section>
        <SectionHeading title="Today's Meals" note={fmtShort(today)} className="mb-3" />
        <PaperCard withMargin className="p-5 sm:p-6">
          {entries?.length ? (
            <ul className="divide-y divide-border/70">
              {(entries ?? []).map((e) => (
                <li key={e._id} className="group flex items-center gap-3 py-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
                    <Apple className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{e.food}</p>
                    <p className="text-xs text-muted-foreground">{e.meal}</p>
                  </div>
                  <span className="text-xs font-semibold text-chart-1">{e.proteinG}g protein</span>
                  <span className="w-16 text-right text-xs text-muted-foreground">{e.calories} kcal</span>
                  <button
                    type="button"
                    className="opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
                    onClick={() => void deleteDiet({ id: e._id })}
                    aria-label="Delete entry"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-hand py-6 text-center text-lg text-muted-foreground">
              No meals logged yet — add your breakfast.
            </p>
          )}
        </PaperCard>
      </section>

      <div className="flex items-center gap-2">
        <Stamp>Plan</Stamp>
        <HandNote className="text-lg">meal planner &amp; shopping list: paneer, curd, soy, dal, rajma, sprouts, oats — rotate weekly</HandNote>
      </div>
    </div>
  );
}
