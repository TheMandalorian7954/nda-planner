import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listSyllabusProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("syllabusProgress")
      .withIndex("by_user_item", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const setSyllabusStatus = mutation({
  args: { itemId: v.string(), status: v.string() },
  handler: async (ctx, { itemId, status }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("syllabusProgress")
      .withIndex("by_user_item", (q) => q.eq("userId", userId).eq("itemId", itemId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { status, updatedAt: Date.now() });
      return existing._id;
    }
    return await ctx.db.insert("syllabusProgress", {
      userId,
      itemId,
      status,
      updatedAt: Date.now(),
    });
  },
});
