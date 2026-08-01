import type { Doc } from "@/convex/_generated/dataModel";
import type { SyllabusSubject } from "@/data/syllabus";
import { OLQ_QUALITIES } from "@/data/olq";

type MockTest = Doc<"mockTests">;
type OlqScore = Doc<"olqScores">;
type MedicalCheck = Doc<"medicalChecks">;

export interface PredictionResult {
  writtenPredicted: number;
  writtenRange: [number, number];
  writtenConfidence: number; // 0-100 based on how much data exists
  ssbReadiness: number;
  medicalReadiness: number;
}

const WRITTEN_MAX = 900;

export function computePredictions(opts: {
  syllabusProgress: Record<string, string>;
  syllabus: SyllabusSubject[];
  mocks: MockTest[];
  olqScores: OlqScore[];
  medicalChecks: MedicalCheck[];
  habitsStreakScore: number; // 0-100
}): PredictionResult {
  const { syllabusProgress, syllabus, mocks, olqScores, medicalChecks, habitsStreakScore } =
    opts;

  // --- Written prediction: syllabus completion + mock performance ---
  const allItems = syllabus.flatMap((s) => s.sections.flatMap((sec) => sec.items));
  const done = allItems.filter((i) => {
    const st = syllabusProgress[i.id];
    return st === "done" || st === "revision";
  }).length;
  const totalItems = Math.max(allItems.length, 1);
  const syllabusPct = done / totalItems;

  const subjectBest: Record<string, number> = {};
  for (const m of mocks) {
    const pct = m.total > 0 ? m.score / m.total : 0;
    subjectBest[m.subject] = Math.max(subjectBest[m.subject] ?? 0, pct);
  }
  const mathPct = subjectBest["Maths"] ?? syllabusPct;
  const engPct = subjectBest["English"] ?? syllabusPct;
  const gkPct = subjectBest["GK"] ?? syllabusPct;

  // Maths 300 + English 300 + GK 300 (GAT is English+GK together in reality,
  // but the official syllabus weighs them this way) + completion bonus.
  const predicted = 300 * mathPct + 300 * engPct + 300 * gkPct + 90 * syllabusPct;
  const clamped = Math.min(WRITTEN_MAX, Math.max(0, Math.round(predicted)));
  const spread = mocks.length >= 3 ? 40 : 70;
  const writtenConfidence = Math.min(100, mocks.length * 15 + done * 2);

  // --- SSB readiness: OLQ self scores + habit consistency ---
  let olqAvg = 0;
  const olqByQuality: Record<string, number[]> = {};
  for (const s of olqScores) {
    (olqByQuality[s.quality] ??= []).push(s.score);
  }
  const qualityAvgs = Object.values(olqByQuality).map(
    (arr) => arr.reduce((a, b) => a + b, 0) / arr.length,
  );
  if (qualityAvgs.length > 0) {
    olqAvg = qualityAvgs.reduce((a, b) => a + b, 0) / qualityAvgs.length;
  }
  const qualityCoverage = qualityAvgs.length / Math.max(OLQ_QUALITIES.length, 1);
  const ssbReadiness = Math.round(
    Math.min(100, olqAvg * 6 + qualityCoverage * 20 + habitsStreakScore * 0.2 + 10),
  );

  // --- Medical readiness: checklist completion ---
  const totalChecks = Math.max(medicalChecks.length, 1);
  let cleared = 0;
  let progressing = 0;
  for (const c of medicalChecks) {
    if (c.status === "cleared") cleared++;
    if (c.status === "in-progress") progressing++;
  }
  const medicalReadiness = Math.round(
    Math.min(100, (cleared / totalChecks) * 80 + (progressing / totalChecks) * 20),
  );

  return {
    writtenPredicted: clamped,
    writtenRange: [Math.max(0, clamped - spread), Math.min(900, clamped + spread)],
    writtenConfidence,
    ssbReadiness,
    medicalReadiness,
  };
}

/** Topics to revise today: items flagged for revision, else lowest-coverage. */
export function pickRevisionTopics(
  syllabus: SyllabusSubject[],
  progress: Record<string, string>,
  count = 4,
): { id: string; label: string; subject: string }[] {
  const items = syllabus.flatMap((s) =>
    s.sections.flatMap((sec) =>
      sec.items.map((i) => ({ id: i.id, label: i.name, subject: s.name })),
    ),
  );
  const revision = items.filter((i) => progress[i.id] === "revision");
  const todo = items.filter((i) => !progress[i.id] || progress[i.id] === "todo");
  const pool = revision.length > 0 ? revision : todo.length > 0 ? todo : items;
  const bySubject: Record<string, typeof pool> = {};
  for (const i of pool) (bySubject[i.subject] ??= []).push(i);
  const out: typeof pool = [];
  const keys = Object.keys(bySubject);
  let idx = 0;
  while (out.length < count && idx < 50) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    const arr = bySubject[key];
    if (arr && arr.length > 0) out.push(arr.shift()!);
    idx++;
  }
  return out.slice(0, count);
}

export function weakTopicsFromMocks(mocks: MockTest[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of mocks) {
    for (const t of m.weakTopics ?? []) {
      counts[t] = (counts[t] ?? 0) + 1;
    }
  }
  return counts;
}
