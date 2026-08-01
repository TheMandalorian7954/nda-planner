export interface Exercise {
  name: string;
  unit: string;
  hint: string;
}

export const EXERCISES: Exercise[] = [
  { name: "Push-ups", unit: "reps", hint: "Full range, core tight, chest to near floor." },
  { name: "Pull-ups", unit: "reps", hint: "Chin over bar; use a band if needed." },
  { name: "Squats", unit: "reps", hint: "Hips below knees, heels down." },
  { name: "Lunges", unit: "reps", hint: "Alternate legs, knee tracks over toes." },
  { name: "Plank", unit: "seconds", hint: "Straight line from head to heels." },
  { name: "Burpees", unit: "reps", hint: "Full extension + jump, controlled landing." },
  { name: "Farmer Carry", unit: "meters", hint: "Heavy in both hands, tall posture." },
  { name: "Skipping", unit: "minutes", hint: "Light on toes, steady rhythm." },
  { name: "Running", unit: "km", hint: "Easy conversational pace for endurance days." },
  { name: "Sprint", unit: "reps", hint: "Short max-effort efforts with full recovery." },
  { name: "Cycling", unit: "km", hint: "Steady cadence, moderate resistance." },
  { name: "Swimming", unit: "minutes", hint: "Continuous laps, controlled breathing." },
  { name: "Stretching", unit: "minutes", hint: "Hold each stretch 20-30s, no bouncing." },
  { name: "Yoga", unit: "minutes", hint: "Focus on breath and alignment (Surya Namaskar)." },
  { name: "Core / Abs", unit: "reps", hint: "Crunch, leg raise, bicycle — quality over speed." },
];

export const STRENGTHENING_EXERCISES = [
  "Glute bridges (hip strengthening)",
  "Clamshells (hip/glute activation)",
  "Hamstring curls (band or machine)",
  "Calf raises",
  "Wall sits",
  "Side leg raises",
  "Hip abduction with band",
  "Single-leg balance",
];

export const MOBILITY_CHECKLIST = [
  "10 min joint mobility warm-up",
  "Hip flexor stretch — 30s each side",
  "Hamstring stretch — 30s each side",
  "Calf stretch — 30s each side",
  "Inner-thigh (adductor) stretch — 30s",
  "Quad stretch — 30s each side",
  "Ankle rotations — 10 each direction",
  "Standing toe-touch progression",
];

export const BALANCE_EXERCISES = [
  "Single-leg stand — 30s per leg",
  "Single-leg stand with eyes closed — 10s",
  "Heel-to-toe walk — 10 steps",
  "Standing on one leg while brushing teeth",
  "Yoga tree pose — 30s each side",
  "Single-leg knee raises — 10 per leg",
];
