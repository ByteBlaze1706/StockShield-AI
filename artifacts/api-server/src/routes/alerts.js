import { Router } from "express";
import { db } from "@workspace/db";
import { alertsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
const router = Router();

router.get("/", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const alerts = await db.select()
      .from(alertsTable)
      .where(eq(alertsTable.userId, req.user.id))
      .orderBy(desc(alertsTable.detectedAt))
      .limit(50);

    res.json(alerts.map(a => ({
      id: a.id,
      ticker: a.ticker,
      stockName: a.stockName,
      type: a.type,
      severity: a.severity,
      description: a.description,
      detectedAt: a.detectedAt.toISOString(),
      riskScore: a.riskScore
    })));
  } catch (err) {
    req.log.error({
      err
    }, "Error fetching alerts");
    res.status(500).json({
      error: "Failed to fetch alerts"
    });
  }
});

router.get("/summary", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const alerts = await db.select()
      .from(alertsTable)
      .where(eq(alertsTable.userId, req.user.id));

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    res.json({
      total: alerts.length,
      critical: alerts.filter(a => a.severity === "critical").length,
      high: alerts.filter(a => a.severity === "high").length,
      medium: alerts.filter(a => a.severity === "medium").length,
      low: alerts.filter(a => a.severity === "low").length,
      recentCount: alerts.filter(a => a.detectedAt >= yesterday).length
    });
  } catch (err) {
    req.log.error({
      err
    }, "Error fetching alerts summary");
    res.status(500).json({
      error: "Failed to fetch summary"
    });
  }
});

export { router as alertsRouter };