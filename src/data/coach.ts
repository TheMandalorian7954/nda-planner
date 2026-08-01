export const QUOTES = [
  { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "You don't have to be extreme, just consistent.", author: "Unknown" },
  { text: "Sweat more in peace, bleed less in war.", author: "Military adage" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "An army is a team. It lives, eats, sleeps, fights as a team.", author: "Gen. George S. Patton" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
];

export const COACH_TIPS = [
  "Attempt 2–3 mock tests every week and analyse every wrong answer — that's where marks are hiding.",
  "For SSB, your stories and examples must come from YOUR real life. Practice TAT with a 4-minute timer daily.",
  "Aim for 1.2–1.5 g of protein per kg of body weight — as a vegetarian, plan your paneer, dal and soy intake.",
  "Sleep 7–8 hours. A tired brain scores 20% worse on reasoning tests.",
  "Run 3 times a week and do push-ups/pull-ups daily for the physical standards.",
  "Revise a topic 3 times (next day, after 3 days, after a week) to move it into long-term memory.",
  "In WAT, write the first positive thought that comes — 15 seconds, no overthinking.",
  "Talk to your family about your NDA goal — their support compounds your consistency.",
];

export function pickQuote(seed: number) {
  return QUOTES[Math.abs(seed) % QUOTES.length];
}

export function pickTip(seed: number) {
  return COACH_TIPS[Math.abs(seed) % COACH_TIPS.length];
}
