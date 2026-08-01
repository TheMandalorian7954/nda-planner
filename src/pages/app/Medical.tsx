import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { AlertTriangle, Camera, CheckCircle2, Footprints, Stethoscope, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, PaperCard, SectionHeading, Stamp, HandNote, ProgressBar } from "@/components/notebook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { addDays, fmtShort, todayStr } from "@/lib/date";
import { BALANCE_EXERCISES, MOBILITY_CHECKLIST, STRENGTHENING_EXERCISES } from "@/data/exercises";
import { toast } from "sonner";

const STANDARDS = [
  { id: "vision", name: "Vision", hint: "6/6 standard; book an eye test if unsure." },
  { id: "hearing", name: "Hearing", hint: "Audiometry check recommended." },
  { id: "dental", name: "Dental", hint: "Get cavities and wisdom teeth checked." },
  { id: "flat-feet", name: "Flat Feet", hint: "Track arch via wet-foot test; consult if painful." },
  { id: "knock-knee", name: "Knock Knee", hint: "See the dedicated tracker below — track, don't self-treat." },
  { id: "spine", name: "Spine", hint: "Posture check; physio if scoliosis suspected." },
  { id: "posture", name: "Posture", hint: "Work on desk posture daily." },
  { id: "flexibility", name: "Flexibility", hint: "Sit-and-reach progress monthly." },
  { id: "bmi", name: "BMI", hint: "Keep in normal band (18.5–24.9)." },
  { id: "skin", name: "Skin", hint: "Fungal infections are common — treat early." },
] as const;

const STATUS_OPTIONS = [
  { value: "not-started", label: "Not started" },
  { value: "in-progress", label: "In progress" },
  { value: "cleared", label: "Cleared / assessed" },
  { value: "referral", label: "Needs specialist" },
] as const;

export default function Medical() {
  const today = todayStr();
  const checks = useQuery(api.medical.listMedicalChecks);
  const kkLogs = useQuery(api.medical.listKnockKnee);
  const upsertCheck = useMutation(api.medical.upsertMedicalCheck);
  const logKk = useMutation(api.medical.logKnockKnee);

  const statusMap = new Map((checks ?? []).map((c) => [c.item, c.status]));
  const cleared = (checks ?? []).filter((c) => c.status === "cleared").length;
  const pct = (checks?.length ?? 0) ? (cleared / (checks?.length ?? 1)) * 100 : 0;

  const [kneeGap, setKneeGap] = useState("");
  const [ankleGap, setAnkleGap] = useState("");
  const [pain, setPain] = useState("");
  const [note, setNote] = useState("");
  const [doneStrengthen, setDoneStrengthen] = useState<Set<number>>(new Set());
  const [doneMobility, setDoneMobility] = useState<Set<number>>(new Set());
  const [doneBalance, setDoneBalance] = useState<Set<number>>(new Set());

  const toggle = (set: Set<number>, v: number) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };

  const saveKk = () => {
    void logKk({
      date: today,
      kneeGapCm: kneeGap ? parseFloat(kneeGap) : undefined,
      ankleGapCm: ankleGap ? parseFloat(ankleGap) : undefined,
      pain: pain ? parseInt(pain) : undefined,
      note: note || undefined,
    });
    setKneeGap("");
    setAnkleGap("");
    setPain("");
    setNote("");
    toast.success("Knock-knee check-in saved");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 10 · medical standards"
        title="Medical Readiness"
        description="Not a self-diagnosis tool — this tracks readiness and reminds you to get professional assessments where needed."
        right={
          <PaperCard className="px-5 py-3 text-center">
            <p className="font-display text-3xl font-bold text-chart-3">{pct.toFixed(0)}%</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">assessed</p>
          </PaperCard>
        }
      />

      {/* Alert banner */}
      <div className="flex items-start gap-3 rounded-lg border border-chart-4/40 bg-chart-4/10 p-4">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-chart-4" />
        <p className="text-[13px] leading-6 text-foreground">
          <strong className="font-semibold">Important:</strong> Whether a condition (like knock knees or flat feet)
          affects your eligibility depends on its severity and the official medical examination. This app only helps you
          <em> track and prepare</em>. For persistent or significant alignment issues, let a physiotherapist or
          orthopaedic specialist guide treatment.
        </p>
      </div>

      {/* Standards checklist */}
      <section>
        <SectionHeading title="Standards Checklist" note="mark what's assessed" className="mb-3" />
        <div className="mb-4 max-w-xs">
          <ProgressBar value={pct} color="var(--chart-3)" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {STANDARDS.map((s) => {
            const st = statusMap.get(s.id) ?? "not-started";
            return (
              <PaperCard key={s.id} className={cn("p-4", st === "cleared" && "border-chart-3/50")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{s.hint}</p>
                  </div>
                  {st === "cleared" ? (
                    <CheckCircle2 className="size-5 shrink-0 text-chart-3" />
                  ) : st === "referral" ? (
                    <XCircle className="size-5 shrink-0 text-destructive" />
                  ) : (
                    <Stethoscope className="size-5 shrink-0 text-muted-foreground" />
                  )}
                </div>
                <Select
                  value={st}
                  onValueChange={(v) => void upsertCheck({ item: s.id, status: v })}
                >
                  <SelectTrigger size="sm" className="mt-3 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </PaperCard>
            );
          })}
        </div>
        <p className="font-hand mt-3 text-lg text-muted-foreground">
          Also keep: medical history file, hospital records, doctor visit dates — one folder, always updated.
        </p>
      </section>

      {/* Knock knee tracker */}
      <section>
        <SectionHeading title="Knock-Knee Tracker" note="track honestly — don't promise fixes" className="mb-3" />
        <div className="grid gap-5 lg:grid-cols-2">
          <PaperCard ruled tape className="p-5 sm:p-6">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Footprints className="size-4 text-chart-2" /> Monthly measurement log
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Same stance, same angle, same time of day: measure the gap between your knees
              (ankles together) and ankles (knees together). Add a monthly photo for comparison.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <Label className="mb-1 block text-xs">Knee gap (cm)</Label>
                <Input type="number" step={0.1} value={kneeGap} onChange={(e) => setKneeGap(e.target.value)} className="bg-background/60" placeholder="—" />
              </div>
              <div>
                <Label className="mb-1 block text-xs">Ankle gap (cm)</Label>
                <Input type="number" step={0.1} value={ankleGap} onChange={(e) => setAnkleGap(e.target.value)} className="bg-background/60" placeholder="—" />
              </div>
              <div>
                <Label className="mb-1 block text-xs">Pain (0–10)</Label>
                <Input type="number" min={0} max={10} value={pain} onChange={(e) => setPain(e.target.value)} className="bg-background/60" placeholder="0" />
              </div>
            </div>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Physio assessment note, photo link, or anything notable…" className="mt-3 min-h-[70px] bg-background/50" />
            <div className="mt-3 flex items-center gap-3">
              <Button onClick={saveKk} className="gap-1.5">
                <Camera className="size-4" /> Save monthly check-in
              </Button>
              <HandNote className="text-lg">knee &amp; ankle gap + photo monthly</HandNote>
            </div>
          </PaperCard>

          <PaperCard withMargin className="p-5 sm:p-6">
            <p className="text-sm font-semibold">Recent check-ins</p>
            {kkLogs?.length ? (
              <ul className="mt-2 divide-y divide-border/70">
                {(kkLogs ?? []).slice(-6).reverse().map((l) => (
                  <li key={l._id} className="flex flex-wrap items-center gap-2 py-2.5 text-sm">
                    <span className="font-medium">{fmtShort(l.date)}</span>
                    {l.kneeGapCm != null && <span className="text-xs text-muted-foreground">knee {l.kneeGapCm}cm</span>}
                    {l.ankleGapCm != null && <span className="text-xs text-muted-foreground">ankle {l.ankleGapCm}cm</span>}
                    {l.pain != null && <span className="text-xs text-muted-foreground">pain {l.pain}/10</span>}
                    {l.note && <span className="font-hand w-full text-sm text-muted-foreground">{l.note}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-hand py-4 text-center text-lg text-muted-foreground">
                No check-ins yet — take your first measurement.
              </p>
            )}
            <p className="mt-3 border-t border-border/70 pt-3 text-[11px] leading-5 text-muted-foreground">
              Exercises below can strengthen muscles around the knee but are not proven to
              "correct" knock knees in adults — follow your physiotherapist's plan.
            </p>
          </PaperCard>
        </div>

        {/* Strengthening logs */}
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <PaperCard className="p-4">
            <p className="mb-2 text-sm font-semibold">Strengthening log</p>
            <ul className="space-y-1.5">
              {STRENGTHENING_EXERCISES.map((e, i) => (
                <li key={e}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] transition-colors hover:bg-muted/60"
                    onClick={() => setDoneStrengthen((s) => toggle(s, i))}
                  >
                    <span className={cn("flex size-4 items-center justify-center rounded border-2", doneStrengthen.has(i) ? "border-transparent bg-chart-2 text-white" : "border-border")}>
                      {doneStrengthen.has(i) && "✓"}
                    </span>
                    {e}
                  </button>
                </li>
              ))}
            </ul>
          </PaperCard>
          <PaperCard className="p-4">
            <p className="mb-2 text-sm font-semibold">Mobility routine</p>
            <ul className="space-y-1.5">
              {MOBILITY_CHECKLIST.map((e, i) => (
                <li key={e}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] transition-colors hover:bg-muted/60"
                    onClick={() => setDoneMobility((s) => toggle(s, i))}
                  >
                    <span className={cn("flex size-4 items-center justify-center rounded border-2", doneMobility.has(i) ? "border-transparent bg-chart-3 text-white" : "border-border")}>
                      {doneMobility.has(i) && "✓"}
                    </span>
                    {e}
                  </button>
                </li>
              ))}
            </ul>
          </PaperCard>
          <PaperCard className="p-4">
            <p className="mb-2 text-sm font-semibold">Balance exercises</p>
            <ul className="space-y-1.5">
              {BALANCE_EXERCISES.map((e, i) => (
                <li key={e}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] transition-colors hover:bg-muted/60"
                    onClick={() => setDoneBalance((s) => toggle(s, i))}
                  >
                    <span className={cn("flex size-4 items-center justify-center rounded border-2", doneBalance.has(i) ? "border-transparent bg-chart-4 text-white" : "border-border")}>
                      {doneBalance.has(i) && "✓"}
                    </span>
                    {e}
                  </button>
                </li>
              ))}
            </ul>
          </PaperCard>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Stamp>Track only</Stamp>
          <HandNote className="text-lg">log strength, mobility, balance — let professionals judge alignment</HandNote>
        </div>
      </section>
    </div>
  );
}
