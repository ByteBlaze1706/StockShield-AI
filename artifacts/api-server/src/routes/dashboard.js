import { Router } from "express";
import { db, alertsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
const router = Router();

const TOP_RISKY_STOCKS = [{
  ticker: "BBBY",
  name: "Bed Bath & Beyond Inc.",
  price: 0.11,
  change: 0.03,
  changePercent: 37.5,
  riskScore: 96,
  sector: "Consumer Discretionary"
}, {
  ticker: "MMAT",
  name: "Meta Materials Inc.",
  price: 0.34,
  change: 0.09,
  changePercent: 35.9,
  riskScore: 91,
  sector: "Materials"
}, {
  ticker: "GME",
  name: "GameStop Corp.",
  price: 14.22,
  change: 3.45,
  changePercent: 32.0,
  riskScore: 87,
  sector: "Consumer Discretionary"
}, {
  ticker: "AMC",
  name: "AMC Entertainment Holdings",
  price: 4.87,
  change: 1.12,
  changePercent: 29.8,
  riskScore: 82,
  sector: "Communication Services"
}, {
  ticker: "SNDL",
  name: "SNDL Inc.",
  price: 1.74,
  change: 0.42,
  changePercent: 31.8,
  riskScore: 78,
  sector: "Consumer Staples"
}];

router.get("/stats", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const allAlerts = await db.select()
      .from(alertsTable)
      .where(eq(alertsTable.userId, req.user.id))
      .orderBy(desc(alertsTable.detectedAt))
      .limit(100);

    const recent = allAlerts.slice(0, 5);
    res.json({
      totalStocksMonitored: 12,
      highRiskCount: 5,
      activeAlerts: allAlerts.length,
      avgMarketRiskScore: 47.3,
      topRiskyStocks: TOP_RISKY_STOCKS,
      recentAlerts: recent.map(a => ({
        id: a.id,
        ticker: a.ticker,
        stockName: a.stockName,
        type: a.type,
        severity: a.severity,
        description: a.description,
        detectedAt: a.detectedAt.toISOString(),
        riskScore: a.riskScore
      }))
    });
  } catch (err) {
    req.log.error({
      err
    }, "Error fetching dashboard stats");
    res.status(500).json({
      error: "Failed to fetch dashboard stats"
    });
  }
});

export { router as dashboardRouter };