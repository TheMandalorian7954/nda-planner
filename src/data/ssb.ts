export interface PiQuestion {
  category: string;
  questions: string[];
}

export const OIR_SAMPLES = [
  {
    q: "Complete the series: 2, 4, 8, 16, ?",
    a: "32",
  },
  {
    q: "Pick the odd one out: Apple, Mango, Potato, Orange",
    a: "Potato (vegetable, rest are fruits)",
  },
  {
    q: "If CAT is coded as DBU, then DOG is coded as:",
    a: "EPH (each letter +1)",
  },
  {
    q: "Doctor : Hospital :: Teacher : ?",
    a: "School",
  },
  {
    q: "Find the missing number: 5, 10, 17, 26, ?",
    a: "37 (+5, +7, +9, +11)",
  },
  {
    q: "Mirror image of the word 'VICTORY' appears reversed. Which pair looks identical in a mirror?",
    a: "Letters like A, H, I, M, O, T, U, V, W, X, Y are vertically symmetric",
  },
  {
    q: "If '+' means '×', '−' means '+', then 4 + 3 − 2 = ?",
    a: "4 × 3 + 2 = 14",
  },
];

export const WAT_WORDS = [
  "Ambition", "Courage", "Discipline", "Fear", "Family", "Friendship", "Failure",
  "Success", "Duty", "Country", "Honesty", "Hard work", "Leader", "Army", "Navy",
  "Air Force", "War", "Peace", "Enemy", "Soldier", "Sacrifice", "Respect",
  "Punctuality", "Fitness", "Study", "Exam", "Career", "Money", "Power", "Service",
  "Responsibility", "Decision", "Risk", "Competition", "Team", "Alone", "Dream",
  "Goal", "Problem", "Solution", "Change", "Luck", "Perseverance", "Patience",
  "Courageous", "Obedience", "Initiative", "Crisis", "Challenge", "Self-control",
];

export const SRT_SITUATIONS = [
  {
    s: "You are in a moving train and see a child about to fall from the open door.",
    theme: "Act immediately to prevent harm, then involve others calmly.",
  },
  {
    s: "Your friend is spreading a false rumour about you in college.",
    theme: "Confront calmly, clarify facts, don't retaliate or gossip back.",
  },
  {
    s: "During an important group task, one teammate is not contributing at all.",
    theme: "Motivate and involve them privately; keep the team goal primary.",
  },
  {
    s: "You witness a senior bullying a junior in the hostel.",
    theme: "Intervene respectfully, protect the junior, report if needed.",
  },
  {
    s: "You are the leader of a trekking group and one member gets injured halfway.",
    theme: "Prioritise medical care, redistribute the load, inform base, keep morale up.",
  },
  {
    s: "Your unit has a limited water supply during a long exercise and a soldier takes extra water.",
    theme: "Correct firmly but fairly, ensure discipline without humiliation.",
  },
  {
    s: "You discover a shortcut that saves time but violates the exercise rules.",
    theme: "Follow the rules; integrity beats convenience.",
  },
  {
    s: "A junior asks you to help him cheat in an important test.",
    theme: "Refuse clearly, guide him to study, report per regulations.",
  },
  {
    s: "You are alone on night duty and hear an unusual sound near the equipment store.",
    theme: "Stay alert, investigate cautiously, inform the guard commander, don't panic.",
  },
  {
    s: "Your best friend is selected and you are not, for a national camp.",
    theme: "Accept gracefully, congratulate genuinely, work on weaknesses.",
  },
  {
    s: "You have to deliver bad news to a colleague's family about his transfer delay.",
    theme: "Be honest and empathetic; offer practical help.",
  },
  {
    s: "A group member keeps disagreeing with every plan even when the plan is sound.",
    theme: "Listen for valid points, give a chance to explain, decide for the team, move on.",
  },
];

export const TAT_PROMPTS = [
  "A farmer looking at dark clouds over his dry field",
  "A soldier helping an old man cross a busy road",
  "Two students studying under a street lamp at night",
  "A captain addressing his team before a big match",
  "A woman teaching children in a village under a tree",
  "A pilot climbing into his fighter jet at dawn",
  "A group of friends clearing debris after a storm",
  "A runner training alone on a misty track",
  "A scientist pointing at a rocket on a launch pad",
  "A young man carrying an elderly woman on his back through floodwater",
  "A boy mending a broken kite while others play",
  "A doctor attending to a patient in a remote clinic",
  "A sailor looking through a telescope at the horizon",
  "A mountaineer tying a rope for the team below",
  "A volunteer distributing food to people in a queue",
];

export const SD_PROMPTS = [
  { id: "parents", label: "What my parents say about me" },
  { id: "teachers", label: "What my teachers say about me" },
  { id: "friends", label: "What my friends say about me" },
  { id: "self", label: "What I think about myself" },
  { id: "goals", label: "What I want to become in life" },
];

export const GTO_TASKS: { name: string; desc: string; tips: string }[] = [
  {
    name: "Group Discussion",
    desc: "A topic is given and the group discusses it. Assessors watch for content, logic, and how you involve others.",
    tips: "Speak early but not dominantly. Build on others' points. Stay on track and avoid arguments.",
  },
  {
    name: "Group Planning Exercise",
    desc: "You are given a map, a set of resources, and an incident. Plan the best utilisation of resources.",
    tips: "Prioritise casualties, use resources efficiently, write clearly, be realistic with time.",
  },
  {
    name: "Progressive Group Task (PGT)",
    desc: "The group crosses obstacles; new rules are added as the task progresses.",
    tips: "Volunteer, cooperate, follow the leader's plan, help slower members.",
  },
  {
    name: "Group Obstacle Race (GTO)",
    desc: "A competitive obstacle race against time with all members.",
    tips: "Sheer effort, coordination and speed matter. Keep the group together.",
  },
  {
    name: "Half Group Task (HGT)",
    desc: "Half the group solves an obstacle with limited resources.",
    tips: "Plan fast, take responsibility, involve everyone.",
  },
  {
    name: "Command Task",
    desc: "You command a group and use the given resources while a helper assists.",
    tips: "Give clear orders, treat helpers with respect, show confidence.",
  },
  {
    name: "Final Group Task (FGT)",
    desc: "The whole group solves a bigger obstacle; assessors look for final impression.",
    tips: "Show sustained involvement, initiative and team spirit till the end.",
  },
  {
    name: "Individual Obstacles",
    desc: "Each candidate attempts individual obstacles for marks.",
    tips: "Attempt what you can; show courage, agility and honesty in attempts.",
  },
  {
    name: "Lecturette",
    desc: "A 3-minute talk on a topic picked by chance, after 3 minutes of preparation.",
    tips: "Structure: intro, 2–3 points, conclusion. Maintain eye contact and voice modulation.",
  },
  {
    name: "Snake Race",
    desc: "A competitive team race that tests speed, coordination and leadership.",
    tips: "Stay together, encourage teammates, give maximum effort.",
  },
];

export const PI_QUESTIONS: PiQuestion[] = [
  {
    category: "Family",
    questions: [
      "Tell me about your family background.",
      "What does your father/mother do?",
      "What is your relationship with your siblings?",
      "Who is your biggest inspiration in the family?",
      "What values did your family teach you?",
    ],
  },
  {
    category: "Education",
    questions: [
      "Why did you choose engineering?",
      "Which subject do you like the most and why?",
      "What is your favourite subject and your scores in it?",
      "How do you manage academics along with NDA preparation?",
      "Describe your typical study day.",
    ],
  },
  {
    category: "Strengths & Weaknesses",
    questions: [
      "What are your strengths?",
      "What is your biggest weakness?",
      "Give an example of a time you overcame a failure.",
      "Are you an introvert or an extrovert?",
      "What makes you suitable for the Armed Forces?",
    ],
  },
  {
    category: "Current Affairs",
    questions: [
      "What are the latest developments in India's defence sector?",
      "Tell me about a recent international summit.",
      "What do you know about the Agnipath scheme?",
      "Name some recent military exercises with other countries.",
      "What is your opinion on India's space programme?",
    ],
  },
  {
    category: "Hobbies & Interests",
    questions: [
      "What do you do in your free time?",
      "Which sports do you play?",
      "What books have you read recently?",
      "Do you follow any hobby regularly?",
      "What kind of movies do you like?",
    ],
  },
  {
    category: "Life Goals",
    questions: [
      "Why do you want to join the Armed Forces?",
      "Where do you see yourself in 10 years?",
      "What will you do if you don't get recommended?",
      "How will you contribute as an officer?",
      "What does 'service before self' mean to you?",
    ],
  },
  {
    category: "Situational",
    questions: [
      "You see two of your men fighting. What do you do?",
      "Your subordinate disobeys an order in public. How do you handle it?",
      "You are stranded in a remote area with limited food. How do you act?",
      "A teammate takes credit for your work. What do you do?",
      "You receive two conflicting orders. What is your course of action?",
    ],
  },
  {
    category: "Rapid Fire",
    questions: [
      "Your favourite colour? Why?",
      "One quality an officer must never have?",
      "What is your daily routine?",
      "Who is your role model?",
      "Are you afraid of anything?",
    ],
  },
  {
    category: "Stress Questions",
    questions: [
      "You look underconfident to me. Why should we select you?",
      "Your marks in maths are poor. How will you clear the exam?",
      "Why do you want to join just for the lifestyle?",
      "You seem to be repeating rehearsed answers.",
      "What if we tell you you're not fit for the forces?",
    ],
  },
];

export const LECTURETTE_TOPICS = [
  "Importance of discipline in life",
  "Cyber security in India",
  "Space technology and its benefits",
  "Role of youth in nation building",
  "Artificial intelligence: boon or bane",
  "Water conservation",
  "Importance of physical fitness",
  "Disaster management in India",
  "Women in the armed forces",
  "One nation, one election",
  "Digital India",
  "Self-reliance in defence production",
];

export const SPEAKING_CHECKLIST = [
  "Spoke clearly with moderate pace",
  "Maintained eye contact",
  "Used confident body language",
  "Structured my thoughts (intro → points → conclusion)",
  "Avoided filler words (um, uh, like)",
  "Used a varied vocabulary",
  "Finished within the time limit",
  "Stayed calm under pressure",
];
