import { pgTable, text, serial, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const alertsTable = pgTable("stockshield_alerts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  ticker: text("ticker").notNull(),
  stockName: text("stock_name").notNull(),
  type: text("type").notNull(),
  // volume_spike | price_manipulation | insider_trading | wash_trading | pump_and_dump
  severity: text("severity").notNull(),
  // low | medium | high | critical
  description: text("description").notNull(),
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
  riskScore: real("risk_score").notNull().default(0)
});
export const insertAlertSchema = createInsertSchema(alertsTable).omit({
  id: true,
  detectedAt: true
});