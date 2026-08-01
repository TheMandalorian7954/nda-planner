import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listStudy = query({
  args: { from: v.string(), to: v.string() },
  handler: async (ctx, { from, to }) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("studyLogs")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("date"), from) && q.lte(q.field("date"), to))
      .collect();
  },
});

export const logStudy = mutation({
  args: {
    date: v.string(),
    subject: v.string(),
    hours: v.number(),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert("studyLogs", { ...args, userId });
  },
});
