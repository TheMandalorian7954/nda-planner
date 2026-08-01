import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./helpers";

export const listNotes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const rows = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const addNote = mutation({
  args: { title: v.string(), body: v.string() },
  handler: async (ctx, { title, body }) => {
    const userId = await requireUserId(ctx);
    return await ctx.db.insert("notes", { userId, title, body, createdAt: Date.now() });
  },
});

export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
