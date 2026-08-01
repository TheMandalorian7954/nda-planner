import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listDiet = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("dietLogs")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", date))
      .collect();
  },
});

export const logDiet = mutation({
  args: {
    date: v.string(),
    meal: v.string(),
    food: v.string(),
    proteinG: v.number(),
    calories: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert("dietLogs", { ...args, userId });
  },
});

export const deleteDiet = mutation({
  args: { id: v.id("dietLogs") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
