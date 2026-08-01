import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listMockTests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const rows = await ctx.db
      .query("mockTests")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .collect();
    return rows.sort((a, b) => (a.date < b.date ? -1 : 1));
  },
});

export const saveMockResult = mutation({
  args: {
    date: v.string(),
    title: v.string(),
    subject: v.string(),
    total: v.number(),
    correct: v.number(),
    wrong: v.number(),
    skipped: v.number(),
    score: v.number(),
    weakTopics: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert("mockTests", { ...args, userId });
  },
});
