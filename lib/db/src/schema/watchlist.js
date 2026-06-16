import { pgTable, text, serial, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const watchlistTable = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  ticker: text("ticker").notNull(),
  stockName: text("stock_name").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
  riskScore: real("risk_score").notNull().default(0),
  currentPrice: real("current_price").notNull().default(0),
  change: real("change").notNull().default(0)
});
export const insertWatchlistSchema = createInsertSchema(watchlistTable).omit({
  id: true,
  addedAt: true
});