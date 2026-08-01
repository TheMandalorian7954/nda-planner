import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listRoadmapProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("roadmapProgress")
      .withIndex("by_user_item", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const setRoadmapItem = mutation({
  args: { itemId: v.string(), done: v.boolean(), note: v.optional(v.string()) },
  handler: async (ctx, { itemId, done, note }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("roadmapProgress")
      .withIndex("by_user_item", (q) => q.eq("userId", userId).eq("itemId", itemId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { done, note, updatedAt: Date.now() });
      return existing._id;
    }
    return await ctx.db.insert("roadmapProgress", {
      userId,
      itemId,
      done,
      note,
      updatedAt: Date.now(),
    });
  },
});

export const listCustomItems = query({
  args: { phaseId: v.string() },
  handler: async (ctx, { phaseId }) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("roadmapCustom")
      .withIndex("by_user_phase", (q) => q.eq("userId", userId).eq("phaseId", phaseId))
      .collect();
  },
});

export const addCustomItem = mutation({
  args: { phaseId: v.string(), title: v.string() },
  handler: async (ctx, { phaseId, title }) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert("roadmapCustom", { userId, phaseId, title, done: false });
  },
});

export const toggleCustomItem = mutation({
  args: { id: v.id("roadmapCustom"), done: v.boolean() },
  handler: async (ctx, { id, done }) => {
    await ctx.db.patch(id, { done });
  },
});

export const deleteCustomItem = mutation({
  args: { id: v.id("roadmapCustom") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const listAllCustomItems = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("roadmapCustom")
      .withIndex("by_user_phase", (q) => q.eq("userId", userId))
      .collect();
  },
});
