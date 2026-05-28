import { Router } from "express";
import { db, watchlistTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AddToWatchlistBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const items = await db.select().from(watchlistTable);
    res.json(items.map(i => ({
      id: i.id,
      ticker: i.ticker,
      stockName: i.stockName,
      addedAt: i.addedAt.toISOString(),
      riskScore: i.riskScore,
      currentPrice: i.currentPrice,
      change: i.change,
    })));
  } catch (err) {
    req.log.error({ err }, "Error fetching watchlist");
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

router.post("/", async (req, res) => {
  const parsed = AddToWatchlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const PRICE_MAP: Record<string, { price: number; change: number; riskScore: number }> = {
      GME: { price: 14.22, change: 3.45, riskScore: 87 },
      AAPL: { price: 189.45, change: 1.23, riskScore: 12 },
      TSLA: { price: 248.79, change: -5.43, riskScore: 61 },
      MSFT: { price: 415.32, change: 2.17, riskScore: 8 },
      NVDA: { price: 875.40, change: 15.60, riskScore: 22 },
      AMC: { price: 4.87, change: 1.12, riskScore: 82 },
      BBBY: { price: 0.11, change: 0.03, riskScore: 96 },
    };
    const info = PRICE_MAP[parsed.data.ticker.toUpperCase()] ?? { price: 50 + Math.random() * 200, change: (Math.random() - 0.5) * 5, riskScore: Math.round(Math.random() * 100) };
    const [item] = await db.insert(watchlistTable).values({
      ticker: parsed.data.ticker.toUpperCase(),
      stockName: parsed.data.stockName,
      riskScore: info.riskScore,
      currentPrice: info.price,
      change: info.change,
    }).returning();
    res.status(201).json({
      id: item.id,
      ticker: item.ticker,
      stockName: item.stockName,
      addedAt: item.addedAt.toISOString(),
      riskScore: item.riskScore,
      currentPrice: item.currentPrice,
      change: item.change,
    });
  } catch (err) {
    req.log.error({ err }, "Error adding to watchlist");
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(watchlistTable).where(eq(watchlistTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error removing from watchlist");
    res.status(500).json({ error: "Failed to remove from watchlist" });
  }
});

export { router as watchlistRouter };
