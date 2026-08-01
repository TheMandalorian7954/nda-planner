import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listFitness = query({
  args: { from: v.string(), to: v.string() },
  handler: async (ctx, { from, to }) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("fitnessLogs")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("date"), from) && q.lte(q.field("date"), to))
      .collect();
  },
});

export const logFitness = mutation({
  args: {
    date: v.string(),
    activity: v.string(),
    value: v.number(),
    unit: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert("fitnessLogs", { ...args, userId });
  },
});

export const listMeasurements = query({
  args: { from: v.string(), to: v.string() },
  handler: async (ctx, { from, to }) => {
    const userId = await requireUserId(ctx);
    const rows = await ctx.db
      .query("measurements")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("date"), from) && q.lte(q.field("date"), to))
      .collect();
    return rows.sort((a, b) => (a.date < b.date ? -1 : 1));
  },
});

export const upsertMeasurements = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("measurements")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", args.date))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("measurements", { ...args, userId });
  },
});
