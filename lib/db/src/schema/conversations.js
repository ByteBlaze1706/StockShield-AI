import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const conversationsTable = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
export const insertConversationSchema = createInsertSchema(conversationsTable).omit({
  id: true,
  createdAt: true
});