import { Router } from "express";
import { SearchStocksQueryParams } from "@workspace/api-zod";
const router = Router();

// Mock stock data
const STOCKS = {
  AAPL: {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 189.45,
    change: 1.23,
    changePercent: 0.65,
    marketCap: 2_950_000_000_000,
    volume: 52_400_000,
    avgVolume: 58_200_000,
    sector: "Technology",
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    riskScore: 12
  },
  TSLA: {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    price: 248.79,
    change: -5.43,
    changePercent: -2.13,
    marketCap: 792_000_000_000,
    volume: 98_300_000,
    avgVolume: 102_000_000,
    sector: "Consumer Discretionary",
    description: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.",
    riskScore: 61
  },
  GME: {
    ticker: "GME",
    name: "GameStop Corp.",
    price: 14.22,
    change: 3.45,
    changePercent: 32.0,
    marketCap: 4_300_000_000,
    volume: 245_000_000,
    avgVolume: 8_100_000,
    sector: "Consumer Discretionary",
    description: "GameStop Corp. operates as a specialty retailer of games, entertainment software, and consumer electronics.",
    riskScore: 87
  },
  AMC: {
    ticker: "AMC",
    name: "AMC Entertainment Holdings",
    price: 4.87,
    change: 1.12,
    changePercent: 29.8,
    marketCap: 2_100_000_000,
    volume: 189_000_000,
    avgVolume: 22_000_000,
    sector: "Communication Services",
    description: "AMC Entertainment Holdings, Inc. engages in the theatrical exhibition business.",
    riskScore: 82
  },
  MSFT: {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    price: 415.32,
    change: 2.17,
    changePercent: 0.52,
    marketCap: 3_080_000_000_000,
    volume: 21_600_000,
    avgVolume: 24_000_000,
    sector: "Technology",
    description: "Microsoft Corporation develops and supports software, services, devices and solutions worldwide.",
    riskScore: 8
  },
  NVDA: {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    price: 875.40,
    change: 15.60,
    changePercent: 1.82,
    marketCap: 2_160_000_000_000,
    volume: 43_500_000,
    avgVolume: 45_800_000,
    sector: "Technology",
    description: "NVIDIA Corporation provides graphics and compute and networking solutions worldwide.",
    riskScore: 22
  },
  BBBY: {
    ticker: "BBBY",
    name: "Bed Bath & Beyond Inc.",
    price: 0.11,
    change: 0.03,
    changePercent: 37.5,
    marketCap: 5_200_000,
    volume: 892_000_000,
    avgVolume: 45_000_000,
    sector: "Consumer Discretionary",
    description: "Bed Bath & Beyond Inc. operates a chain of retail stores.",
    riskScore: 96
  },
  SNDL: {
    ticker: "SNDL",
    name: "SNDL Inc.",
    price: 1.74,
    change: 0.42,
    changePercent: 31.8,
    marketCap: 412_000_000,
    volume: 78_400_000,
    avgVolume: 9_200_000,
    sector: "Consumer Staples",
    description: "SNDL Inc. engages in the production, distribution, and sale of cannabis products.",
    riskScore: 78
  },
  META: {
    ticker: "META",
    name: "Meta Platforms, Inc.",
    price: 512.67,
    change: 4.32,
    changePercent: 0.85,
    marketCap: 1_310_000_000_000,
    volume: 18_700_000,
    avgVolume: 19_800_000,
    sector: "Communication Services",
    description: "Meta Platforms, Inc. engages in the development of social media applications.",
    riskScore: 19
  },
  GOOGL: {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: 171.23,
    change: 0.89,
    changePercent: 0.52,
    marketCap: 2_120_000_000_000,
    volume: 24_500_000,
    avgVolume: 26_300_000,
    sector: "Communication Services",
    description: "Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.",
    riskScore: 11
  },
  MMAT: {
    ticker: "MMAT",
    name: "Meta Materials Inc.",
    price: 0.34,
    change: 0.09,
    changePercent: 35.9,
    marketCap: 180_000_000,
    volume: 42_000_000,
    avgVolume: 3_100_000,
    sector: "Materials",
    description: "Meta Materials Inc. develops functional materials and nanocomposites.",
    riskScore: 91
  },
  SPY: {
    ticker: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    price: 521.43,
    change: 1.87,
    changePercent: 0.36,
    marketCap: 503_000_000_000,
    volume: 65_400_000,
    avgVolume: 70_200_000,
    sector: "ETF",
    description: "The SPDR S&P 500 ETF Trust seeks to provide investment results that correspond to the price and yield of the S&P 500 Index.",
    riskScore: 5
  }
};
function generatePriceHistory(basePrice, days = 90) {
  const history = [];
  let price = basePrice * 0.85;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const volatility = 0.02 + Math.random() * 0.03;
    const drift = (Math.random() - 0.48) * volatility;
    price = Math.max(price * (1 + drift), 0.01);
    const open = price;
    const high = price * (1 + Math.random() * 0.02);
    const low = price * (1 - Math.random() * 0.02);
    const close = (open + high + low) / 3 + (Math.random() - 0.5) * price * 0.01;
    const baseVol = 1_000_000 + Math.random() * 5_000_000;
    const volume = Math.random() > 0.9 ? baseVol * (3 + Math.random() * 7) : baseVol;
    const anomaly = volume > baseVol * 3 || Math.abs(drift) > 0.04;
    history.push({
      date: date.toISOString().split("T")[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.round(volume),
      anomaly
    });
  }
  return history;
}
router.get("/search", (req, res) => {
  const parsed = SearchStocksQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid query"
    });
    return;
  }
  const q = parsed.data.q.toLowerCase();
  const results = Object.values(STOCKS).filter(s => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)).slice(0, 10).map(s => ({
    ticker: s.ticker,
    name: s.name,
    price: s.price,
    change: s.change,
    changePercent: s.changePercent,
    riskScore: s.riskScore,
    sector: s.sector
  }));
  res.json(results);
});
router.get("/:ticker", (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const stock = STOCKS[ticker];
  if (!stock) {
    res.status(404).json({
      error: "Stock not found"
    });
    return;
  }
  res.json({
    ...stock,
    priceHistory: generatePriceHistory(stock.price)
  });
});
export { router as stocksRouter };
// Production release cleanup and documentation refresh
