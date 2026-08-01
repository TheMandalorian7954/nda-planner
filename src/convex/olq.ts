import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listOlqScores = query({
  args: { from: v.string(), to: v.string() },
  handler: async (ctx, { from, to }) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("olqScores")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("date"), from) && q.lte(q.field("date"), to))
      .collect();
  },
});

export const upsertOlqScore = mutation({
  args: {
    date: v.string(),
    quality: v.string(),
    score: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { date, quality, score, note }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("olqScores")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", date))
      .filter((q) => q.eq(q.field("quality"), quality))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { score, note });
      return existing._id;
    }
    return await ctx.db.insert("olqScores", { userId, date, quality, score, note });
  },
});
