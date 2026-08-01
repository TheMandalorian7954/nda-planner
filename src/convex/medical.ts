import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listMedicalChecks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("medicalChecks")
      .withIndex("by_user_item", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const upsertMedicalCheck = mutation({
  args: { item: v.string(), status: v.string(), note: v.optional(v.string()) },
  handler: async (ctx, { item, status, note }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("medicalChecks")
      .withIndex("by_user_item", (q) => q.eq("userId", userId).eq("item", item))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { status, note, updatedAt: Date.now() });
      return existing._id;
    }
    return await ctx.db.insert("medicalChecks", {
      userId,
      item,
      status,
      note,
      updatedAt: Date.now(),
    });
  },
});

export const listKnockKnee = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const rows = await ctx.db
      .query("knockKneeLogs")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .collect();
    return rows.sort((a, b) => (a.date < b.date ? -1 : 1));
  },
});

export const logKnockKnee = mutation({
  args: {
    date: v.string(),
    kneeGapCm: v.optional(v.number()),
    ankleGapCm: v.optional(v.number()),
    pain: v.optional(v.number()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert("knockKneeLogs", { ...args, userId });
  },
});
