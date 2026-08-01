import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const DEFAULT_EXAM_DATE = "2027-04-18";

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const upsertProfile = mutation({
  args: {
    examDate: v.optional(v.string()),
    wakeTime: v.optional(v.string()),
    studyHours: v.optional(v.number()),
    fitnessMode: v.optional(v.string()),
    dietType: v.optional(v.string()),
    knockKnee: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("profiles", {
      userId,
      examDate: args.examDate ?? DEFAULT_EXAM_DATE,
      wakeTime: args.wakeTime ?? "05:30",
      studyHours: args.studyHours ?? 6,
      fitnessMode: args.fitnessMode ?? "running",
      dietType: args.dietType ?? "vegetarian",
      knockKnee: args.knockKnee ?? false,
    });
  },
});
