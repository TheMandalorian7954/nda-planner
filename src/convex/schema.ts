import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // --- NDA Operating System tables ---

    // per-user settings / profile
    profiles: defineTable({
      userId: v.string(),
      examDate: v.string(), // YYYY-MM-DD
      wakeTime: v.string(), // "05:30"
      studyHours: v.number(), // target study hours/day
      fitnessMode: v.string(), // running | home | gym
      dietType: v.string(), // vegetarian | eggetarian
      knockKnee: v.boolean(),
    }).index("by_user", ["userId"]),

    // daily tasks (mission mode blocks + custom)
    tasks: defineTable({
      userId: v.string(),
      date: v.string(), // YYYY-MM-DD
      title: v.string(),
      category: v.string(), // mission | study | fitness | ssb | personal
      done: v.boolean(),
      order: v.number(),
    }).index("by_user_date", ["userId", "date"]),

    // weekly goals
    goals: defineTable({
      userId: v.string(),
      weekStart: v.string(), // YYYY-MM-DD (monday)
      title: v.string(),
      done: v.boolean(),
    }).index("by_user_week", ["userId", "weekStart"]),

    // habit definitions
    habits: defineTable({
      userId: v.string(),
      name: v.string(),
      icon: v.string(),
      active: v.boolean(),
      order: v.number(),
    }).index("by_user", ["userId"]),

    // daily habit check-in
    habitLogs: defineTable({
      userId: v.string(),
      habitId: v.id("habits"),
      date: v.string(),
      done: v.boolean(),
    }).index("by_user_habit_date", ["userId", "habitId", "date"]),

    // study sessions
    studyLogs: defineTable({
      userId: v.string(),
      date: v.string(),
      subject: v.string(), // Maths | English | GK | SSB | Programming | Other
      hours: v.number(),
      topic: v.optional(v.string()),
    }).index("by_user_date", ["userId", "date"]),

    // fitness activity logs
    fitnessLogs: defineTable({
      userId: v.string(),
      date: v.string(),
      activity: v.string(),
      value: v.number(),
      unit: v.string(),
    }).index("by_user_date", ["userId", "date"]),

    // body measurements + daily wellness (sleep/water/calories/protein)
    measurements: defineTable({
      userId: v.string(),
      date: v.string(),
      weight: v.optional(v.number()),
      bodyFat: v.optional(v.number()),
      waist: v.optional(v.number()),
      chest: v.optional(v.number()),
      shoulders: v.optional(v.number()),
      arms: v.optional(v.number()),
      legs: v.optional(v.number()),
      sleepHours: v.optional(v.number()),
      waterL: v.optional(v.number()),
      calories: v.optional(v.number()),
      proteinG: v.optional(v.number()),
    }).index("by_user_date", ["userId", "date"]),

    // diet entries
    dietLogs: defineTable({
      userId: v.string(),
      date: v.string(),
      meal: v.string(), // Breakfast | Lunch | Snack | Dinner
      food: v.string(),
      proteinG: v.number(),
      calories: v.number(),
    }).index("by_user_date", ["userId", "date"]),

    // medical standard checklist status per item
    medicalChecks: defineTable({
      userId: v.string(),
      item: v.string(), // Vision | Hearing | Dental | ...
      status: v.string(), // not-started | in-progress | cleared | referral
      note: v.optional(v.string()),
      updatedAt: v.number(),
    }).index("by_user_item", ["userId", "item"]),

    // knock knee tracker logs
    knockKneeLogs: defineTable({
      userId: v.string(),
      date: v.string(),
      kneeGapCm: v.optional(v.number()),
      ankleGapCm: v.optional(v.number()),
      pain: v.optional(v.number()), // 0-10
      note: v.optional(v.string()),
    }).index("by_user_date", ["userId", "date"]),

    // OLQ daily self scores
    olqScores: defineTable({
      userId: v.string(),
      date: v.string(),
      quality: v.string(),
      score: v.number(), // 1-10
      note: v.optional(v.string()),
    }).index("by_user_date", ["userId", "date"]),

    // mock test results
    mockTests: defineTable({
      userId: v.string(),
      date: v.string(),
      title: v.string(),
      subject: v.string(), // Maths | English | GK | Full NDA
      total: v.number(),
      correct: v.number(),
      wrong: v.number(),
      skipped: v.number(),
      score: v.number(),
      weakTopics: v.optional(v.array(v.string())),
    }).index("by_user_date", ["userId", "date"]),

    // syllabus topic progress
    syllabusProgress: defineTable({
      userId: v.string(),
      itemId: v.string(),
      status: v.string(), // todo | learning | done | revision
      updatedAt: v.number(),
    }).index("by_user_item", ["userId", "itemId"]),

    // dev roadmap item progress
    roadmapProgress: defineTable({
      userId: v.string(),
      itemId: v.string(),
      done: v.boolean(),
      note: v.optional(v.string()),
      updatedAt: v.number(),
    }).index("by_user_item", ["userId", "itemId"]),

    // user-added roadmap items
    roadmapCustom: defineTable({
      userId: v.string(),
      phaseId: v.string(),
      title: v.string(),
      done: v.boolean(),
    }).index("by_user_phase", ["userId", "phaseId"]),

    // quick notes
    notes: defineTable({
      userId: v.string(),
      title: v.string(),
      body: v.string(),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // speaking / communication practice logs
    speakingLogs: defineTable({
      userId: v.string(),
      date: v.string(),
      kind: v.string(), // lecturette | debate | speech | mock-interview
      minutes: v.number(),
      confidence: v.optional(v.number()),
      note: v.optional(v.string()),
    }).index("by_user_date", ["userId", "date"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
