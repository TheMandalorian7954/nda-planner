import { seededRandom, weekdayIndex } from "@/lib/date";
import { SYLLABUS } from "@/data/syllabus";

export interface MissionBlock {
  time: string;
  title: string;
  category: "fitness" | "study" | "ssb" | "revision" | "personal";
  note: string;
}

export interface ProfileLike {
  wakeTime: string;
  studyHours: number;
  fitnessMode: string;
  examDate: string;
}

const SSB_TASKS = [
  "TAT story practice (1 image, 4 min)",
  "WAT — 20 words, 15 sec each",
  "SRT — 5 situations, 30 sec each",
  "Lecturette practice (3 min on a random topic)",
  "Self Description draft",
  "PI question practice — rapid fire round",
  "GTO theory revision — Group Planning Exercise",
];

const ENGLISH_TASKS = [
  "Daily vocabulary — 10 new words",
  "Grammar drill — error detection (10 Qs)",
  "Reading comprehension passage",
  "Idioms & phrases revision",
];

const GK_TASKS = [
  "Current affairs — defence news round-up",
  "ISRO / DRDO mission study",
  "Ranks, commands & abbreviations revision",
  "Static GK — polity or geography quiz",
];

/** Deterministic day-of-week subject rotation (stable across reloads). */
function rotate<T>(arr: T[], date: string): T {
  const r = Math.floor(seededRandom("rot-" + date) * 1000);
  return arr[r % arr.length];
}

/**
 * Builds today's Mission Mode plan.
 * - Spaced repetition: picks items marked "revision" from syllabus progress.
 * - Subject blocks rotate deterministically by weekday.
 * - Sunday gets a full mock test; 1st of month gets a review.
 */
export function buildMission(
  date: string,
  profile: ProfileLike,
  syllabusProgress: Record<string, string>,
): MissionBlock[] {
  const wake = profile.wakeTime || "05:30";
  const wd = weekdayIndex(date); // 0=Mon
  const isSunday = wd === 6;
  const isMonthStart = date.endsWith("-01");

  const [wh, wm] = wake.split(":").map(Number);
  const at = (addH: number, addM = 0): string => {
    const total = wh * 60 + wm + addH * 60 + addM;
    const h = Math.floor(total / 60) % 24;
    const m = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  // Spaced-revision pick: items flagged "revision" first, else todo.
  const allItems = SYLLABUS.flatMap((s) =>
    s.sections.flatMap((sec) =>
      sec.items.map((i) => ({ id: i.id, name: i.name, subj: s.name })),
    ),
  );
  const revisionPool = allItems.filter((i) => syllabusProgress[i.id] === "revision");
  const todoPool = allItems.filter(
    (i) => !syllabusProgress[i.id] || syllabusProgress[i.id] === "todo",
  );
  const revisionItem =
    revisionPool.length > 0
      ? rotate(revisionPool, date)
      : todoPool.length > 0
        ? rotate(todoPool, date)
        : rotate(allItems, date);

  const subjectPool = ["Maths", "English", "GK"];
  const subject = subjectPool[(wd + Math.floor(seededRandom(date) * 3)) % 3];
  const engTask = rotate(ENGLISH_TASKS, date);
  const gkTask = rotate(GK_TASKS, date);
  const ssbTask = rotate(SSB_TASKS, date);

  const blocks: MissionBlock[] = [
    { time: at(0, 15), title: "Wake up & morning routine", category: "personal", note: "Hydrate, stretch, make your bed — set the tone early." },
    { time: at(0, 45), title: `Morning fitness — ${profile.fitnessMode === "gym" ? "strength workout" : profile.fitnessMode === "home" ? "home workout" : "running"}`, category: "fitness", note: "30–40 min. Consistency beats intensity." },
    { time: at(1, 30), title: "News & current affairs", category: "study", note: "15 min of headlines, note 3 defence items." },
    { time: at(2, 0), title: `${subject} deep-work block`, category: "study", note: `2 focused hours on ${subject} — one topic, no phone.` },
    { time: at(4, 0), title: "English vocabulary", category: "study", note: engTask },
    { time: at(4, 45), title: "GK section", category: "study", note: gkTask },
    { time: at(6, 0), title: "SSB task of the day", category: "ssb", note: ssbTask },
    { time: at(7, 0), title: isSunday ? "Weekly full mock test" : "Evening fitness / sports", category: isSunday ? "study" : "fitness", note: isSunday ? "Simulate exam conditions — Maths + GAT, negative marking." : "Run, sports or strength — keep the body sharp." },
    { time: at(8, 0), title: "Spaced revision", category: "revision", note: `Revise: ${revisionItem.name} (${revisionItem.subj})` },
    { time: at(9, 0), title: "Evening reflection & journal", category: "personal", note: isMonthStart ? "Monthly review — reset goals for the month." : "3 wins of the day + 1 improvement for tomorrow." },
  ];

  return blocks;
}
