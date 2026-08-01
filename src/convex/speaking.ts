import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listSpeaking = query({
  args: { from: v.string(), to: v.string() },
  handler: async (ctx, { from, to }) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("speakingLogs")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("date"), from) && q.lte(q.field("date"), to))
      .collect();
  },
});

export const logSpeaking = mutation({
  args: {
    date: v.string(),
    kind: v.string(),
    minutes: v.number(),
    confidence: v.optional(v.number()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert("speakingLogs", { ...args, userId });
  },
});
