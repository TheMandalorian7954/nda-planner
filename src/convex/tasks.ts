import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listTasks = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const userId = await requireUserId(ctx);
    const rows = await ctx.db
      .query("tasks")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", date))
      .collect();
    return rows.sort((a, b) => a.order - b.order);
  },
});

/** Seeds mission-mode blocks for a date if none exist yet for that date. */
export const ensureMissionTasks = mutation({
  args: {
    date: v.string(),
    blocks: v.array(
      v.object({
        title: v.string(),
        category: v.string(),
        order: v.number(),
      }),
    ),
  },
  handler: async (ctx, { date, blocks }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("tasks")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", date))
      .filter((q) => q.eq(q.field("category"), "mission"))
      .collect();
    if (existing.length > 0) return existing.length;
    for (const b of blocks) {
      await ctx.db.insert("tasks", { ...b, date, done: false, userId });
    }
    return blocks.length;
  },
});

export const addTask = mutation({
  args: { date: v.string(), title: v.string(), category: v.string() },
  handler: async (ctx, { date, title, category }) => {
    const userId = await requireUserId(ctx);
    const count = await ctx.db
      .query("tasks")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", date))
      .collect();
    return await ctx.db.insert("tasks", {
      userId,
      date,
      title,
      category,
      done: false,
      order: count.length,
    });
  },
});

export const toggleTask = mutation({
  args: { id: v.id("tasks"), done: v.boolean() },
  handler: async (ctx, { id, done }) => {
    await ctx.db.patch(id, { done });
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// ---------- Weekly goals ----------

export const listGoals = query({
  args: { weekStart: v.string() },
  handler: async (ctx, { weekStart }) => {
    const userId = await requireUserId(ctx);
    const rows = await ctx.db
      .query("goals")
      .withIndex("by_user_week", (q) => q.eq("userId", userId).eq("weekStart", weekStart))
      .collect();
    return rows.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
  },
});

export const addGoal = mutation({
  args: { weekStart: v.string(), title: v.string() },
  handler: async (ctx, { weekStart, title }) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert("goals", { userId, weekStart, title, done: false });
  },
});

export const toggleGoal = mutation({
  args: { id: v.id("goals"), done: v.boolean() },
  handler: async (ctx, { id, done }) => {
    await ctx.db.patch(id, { done });
  },
});

export const deleteGoal = mutation({
  args: { id: v.id("goals") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
