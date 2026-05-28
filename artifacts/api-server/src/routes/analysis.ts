import { Router } from "express";
import { GoogleGenAI } from "@google/genai";

const router = Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const STOCK_RISK_DATA: Record<string, { riskScore: number; riskLevel: string; flags: string[] }> = {
  AAPL: { riskScore: 12, riskLevel: "safe", flags: [] },
  TSLA: { riskScore: 61, riskLevel: "medium", flags: ["high_volatility", "social_media_influence"] },
  GME: { riskScore: 87, riskLevel: "high", flags: ["volume_spike", "short_squeeze", "retail_speculation", "social_media_driven"] },
  AMC: { riskScore: 82, riskLevel: "high", flags: ["volume_spike", "pump_and_dump_pattern", "high_retail_activity"] },
  MSFT: { riskScore: 8, riskLevel: "safe", flags: [] },
  NVDA: { riskScore: 22, riskLevel: "low", flags: ["high_momentum"] },
  BBBY: { riskScore: 96, riskLevel: "critical", flags: ["bankruptcy_risk", "volume_spike", "pump_and_dump_pattern", "short_squeeze", "delisting_risk"] },
  SNDL: { riskScore: 78, riskLevel: "high", flags: ["volume_spike", "penny_stock", "regulatory_scrutiny"] },
  META: { riskScore: 19, riskLevel: "low", flags: [] },
  GOOGL: { riskScore: 11, riskLevel: "safe", flags: [] },
  MMAT: { riskScore: 91, riskLevel: "critical", flags: ["pump_and_dump_pattern", "volume_spike", "SEC_investigation", "penny_stock"] },
  SPY: { riskScore: 5, riskLevel: "safe", flags: [] },
};

function getDefaultRisk(ticker: string) {
  return { riskScore: 45, riskLevel: "medium", flags: ["insufficient_data"] };
}

router.get("/:ticker/analysis", async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const risk = STOCK_RISK_DATA[ticker] ?? getDefaultRisk(ticker);

  try {
    const prompt = `You are a stock fraud detection AI for StockShield AI. Analyze the following stock ticker: ${ticker}.

Risk score: ${risk.riskScore}/100 (${risk.riskLevel} risk)
Detected risk flags: ${risk.flags.length > 0 ? risk.flags.join(", ") : "none"}

Provide a JSON fraud risk analysis with this exact structure:
{
  "summary": "2-3 sentence analysis of the fraud risk",
  "riskFactors": [
    { "label": "factor name", "severity": "low|medium|high|critical", "description": "one sentence explanation" }
  ],
  "recommendation": "one sentence actionable recommendation for a beginner investor"
}

Only return valid JSON, no markdown, no extra text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    const rawText = response.text ?? "{}";
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json({
      ticker,
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel as "safe" | "low" | "medium" | "high" | "critical",
      summary: parsed.summary ?? "Analysis unavailable.",
      riskFactors: parsed.riskFactors ?? [],
      recommendation: parsed.recommendation ?? "Consult a financial advisor before investing.",
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Gemini analysis error");
    res.json({
      ticker,
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel as "safe" | "low" | "medium" | "high" | "critical",
      summary: `${ticker} shows a ${risk.riskLevel} fraud risk level with a score of ${risk.riskScore}/100.`,
      riskFactors: risk.flags.map(f => ({ label: f.replace(/_/g, " "), severity: risk.riskScore > 70 ? "high" : "medium", description: `This stock exhibits ${f.replace(/_/g, " ")} patterns that warrant caution.` })),
      recommendation: risk.riskScore > 70 ? "Exercise extreme caution. This stock shows multiple high-risk fraud indicators." : "Monitor closely and diversify your portfolio.",
      generatedAt: new Date().toISOString(),
    });
  }
});

router.get("/:ticker/sentiment", async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();

  const mockHeadlines: Record<string, { title: string; source: string; sentiment: "positive" | "neutral" | "negative" }[]> = {
    GME: [
      { title: "GameStop surges 200% as Reddit traders pile in again", source: "CNBC", sentiment: "negative" },
      { title: "SEC launches inquiry into GameStop trading surge", source: "Wall Street Journal", sentiment: "negative" },
      { title: "GameStop short sellers face $2.8B in losses", source: "Bloomberg", sentiment: "neutral" },
      { title: "Roaring Kitty returns: GameStop mania reignites", source: "Reuters", sentiment: "negative" },
    ],
    BBBY: [
      { title: "Bed Bath & Beyond files for bankruptcy protection", source: "Reuters", sentiment: "negative" },
      { title: "BBBY stock surges 300% despite bankruptcy filing", source: "CNBC", sentiment: "negative" },
      { title: "SEC warns investors about BBBY trading risks", source: "MarketWatch", sentiment: "negative" },
    ],
    AAPL: [
      { title: "Apple reports record quarterly earnings, beats estimates", source: "Bloomberg", sentiment: "positive" },
      { title: "iPhone 16 demand exceeds analyst expectations", source: "Wall Street Journal", sentiment: "positive" },
      { title: "Apple Vision Pro showing strong enterprise adoption", source: "Reuters", sentiment: "positive" },
    ],
    TSLA: [
      { title: "Tesla deliveries miss Q3 expectations", source: "CNBC", sentiment: "negative" },
      { title: "Elon Musk tweets send Tesla shares volatile", source: "Bloomberg", sentiment: "negative" },
      { title: "Tesla Cybertruck production ramps up", source: "Reuters", sentiment: "positive" },
      { title: "Tesla FSD beta gets regulatory scrutiny", source: "Wall Street Journal", sentiment: "neutral" },
    ],
  };

  const headlines = mockHeadlines[ticker] ?? [
    { title: `${ticker} trading volume remains stable`, source: "MarketWatch", sentiment: "neutral" as const },
    { title: `Analysts maintain hold rating on ${ticker}`, source: "Bloomberg", sentiment: "neutral" as const },
    { title: `${ticker} reports quarterly earnings in line with estimates`, source: "Reuters", sentiment: "positive" as const },
  ];

  try {
    const headlineText = headlines.map(h => `- "${h.title}" (${h.source})`).join("\n");
    const prompt = `You are a financial sentiment analyst. Based on these news headlines about ${ticker}:

${headlineText}

Provide a JSON sentiment summary with this exact structure:
{
  "summary": "2-3 sentence overall sentiment analysis for a beginner investor",
  "overallSentiment": "positive|neutral|negative",
  "score": <number between -1 and 1>
}

Only return valid JSON, no markdown, no extra text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    const rawText = response.text ?? "{}";
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json({
      ticker,
      overallSentiment: parsed.overallSentiment ?? "neutral",
      score: parsed.score ?? 0,
      headlines: headlines.map(h => ({ ...h, publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() })),
      summary: parsed.summary ?? "Sentiment analysis unavailable.",
    });
  } catch (err) {
    req.log.error({ err }, "Gemini sentiment error");
    const negCount = headlines.filter(h => h.sentiment === "negative").length;
    const posCount = headlines.filter(h => h.sentiment === "positive").length;
    const score = (posCount - negCount) / headlines.length;
    res.json({
      ticker,
      overallSentiment: score > 0.2 ? "positive" : score < -0.2 ? "negative" : "neutral",
      score,
      headlines: headlines.map(h => ({ ...h, publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() })),
      summary: `Market sentiment for ${ticker} is ${score > 0 ? "cautiously positive" : "broadly negative"} based on recent news coverage.`,
    });
  }
});

export { router as analysisRouter };
