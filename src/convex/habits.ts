import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listHabits = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const rows = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return rows.sort((a, b) => a.order - b.order);
  },
});

export const listHabitLogs = query({
  args: { from: v.string(), to: v.string() },
  handler: async (ctx, { from, to }) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("habitLogs")
      .withIndex("by_user_habit_date", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("date"), from) && q.lte(q.field("date"), to))
      .collect();
  },
});

export const seedHabits = mutation({
  args: { habits: v.array(v.object({ name: v.string(), icon: v.string() })) },
  handler: async (ctx, { habits }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    if (existing.length > 0) return existing.length;
    for (let i = 0; i < habits.length; i++) {
      await ctx.db.insert("habits", {
        userId,
        name: habits[i].name,
        icon: habits[i].icon,
        active: true,
        order: i,
      });
    }
    return habits.length;
  },
});

export const addHabit = mutation({
  args: { name: v.string(), icon: v.string() },
  handler: async (ctx, { name, icon }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return await ctx.db.insert("habits", {
      userId,
      name,
      icon,
      active: true,
      order: existing.length,
    });
  },
});

export const deleteHabit = mutation({
  args: { id: v.id("habits") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const toggleHabitLog = mutation({
  args: { habitId: v.id("habits"), date: v.string(), done: v.boolean() },
  handler: async (ctx, { habitId, date, done }) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("habitLogs")
      .withIndex("by_user_habit_date", (q) =>
        q.eq("userId", userId).eq("habitId", habitId).eq("date", date),
      )
      .first();
    if (existing) {
      if (done === existing.done) return;
      await ctx.db.patch(existing._id, { done });
    } else {
      await ctx.db.insert("habitLogs", { userId, habitId, date, done });
    }
  },
});
