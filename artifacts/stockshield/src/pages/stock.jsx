import { Shell } from "@/components/layout/Shell";
import { useParams } from "wouter";
import { useGetStock, useGetStockAnalysis, useGetStockSentiment, useAddToWatchlist, useListWatchlist, useRemoveFromWatchlist, getGetStockQueryKey, getGetStockAnalysisQueryKey, getGetStockSentimentQueryKey, getListWatchlistQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskMeter } from "@/components/ui/risk-meter";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { motion } from "framer-motion";
import { ShieldAlert, Activity, TrendingUp, TrendingDown, BookOpen, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, BarChart, Bar } from "recharts";
export default function StockAnalysis() {
  const {
    ticker
  } = useParams();
  const queryClient = useQueryClient();
  const {
    data: stock,
    isLoading: stockLoading
  } = useGetStock(ticker || "", {
    query: {
      enabled: !!ticker,
      queryKey: getGetStockQueryKey(ticker || "")
    }
  });
  const {
    data: analysis,
    isLoading: analysisLoading
  } = useGetStockAnalysis(ticker || "", {
    query: {
      enabled: !!ticker,
      queryKey: getGetStockAnalysisQueryKey(ticker || "")
    }
  });
  const {
    data: sentiment,
    isLoading: sentimentLoading
  } = useGetStockSentiment(ticker || "", {
    query: {
      enabled: !!ticker,
      queryKey: getGetStockSentimentQueryKey(ticker || "")
    }
  });
  const {
    data: watchlist
  } = useListWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  if (stockLoading || analysisLoading || sentimentLoading || !stock || !analysis || !sentiment) {
    return <Shell>
        <div className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </Shell>;
  }
  const isPositive = stock.change >= 0;
  const watchlistItem = watchlist?.find(item => item.ticker === stock.ticker);
  const isWatched = !!watchlistItem;
  const toggleWatchlist = () => {
    if (isWatched) {
      removeFromWatchlist.mutate({
        id: watchlistItem.id
      }, {
        onSuccess: () => queryClient.invalidateQueries({
          queryKey: getListWatchlistQueryKey()
        })
      });
    } else {
      addToWatchlist.mutate({
        data: {
          ticker: stock.ticker,
          stockName: stock.name
        }
      }, {
        onSuccess: () => queryClient.invalidateQueries({
          queryKey: getListWatchlistQueryKey()
        })
      });
    }
  };
  return <Shell>
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-bold tracking-tight">{stock.ticker}</h1>
              <span className="px-2 py-1 rounded bg-secondary/20 text-secondary text-sm font-medium">{stock.sector}</span>
              <Button variant="outline" size="sm" onClick={toggleWatchlist} disabled={addToWatchlist.isPending || removeFromWatchlist.isPending} className={isWatched ? "bg-primary/20 text-primary border-primary/30" : ""}>
                {addToWatchlist.isPending || removeFromWatchlist.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Star className={`w-4 h-4 mr-2 ${isWatched ? "fill-primary" : ""}`} />}
                {isWatched ? "Watched" : "Watch"}
              </Button>
            </div>
            <p className="text-xl text-muted-foreground">{stock.name}</p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-4xl font-mono font-bold">${stock.price.toFixed(2)}</div>
            <div className={`flex items-center md:justify-end gap-1 text-lg font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Price & Volume Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stock.priceHistory} margin={{
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 0
                  }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={val => new Date(val).toLocaleDateString()} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))'
                    }} labelFormatter={val => new Date(val).toLocaleDateString()} />
                      <Area type="monotone" dataKey="close" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPrice)" />
                      {stock.priceHistory.map((pt, i) => pt.anomaly ? <ReferenceDot key={i} x={pt.date} y={pt.close} r={4} fill="hsl(var(--destructive))" stroke="none" /> : null)}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[100px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stock.priceHistory}>
                      <Bar dataKey="volume" fill="hsl(var(--muted-foreground))" opacity={0.3} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  Sentiment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium">Overall Sentiment</span>
                    <span className="capitalize font-bold text-lg" style={{
                    color: sentiment.overallSentiment === 'positive' ? 'hsl(var(--success))' : sentiment.overallSentiment === 'negative' ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'
                  }}>
                      {sentiment.overallSentiment}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-border z-10" />
                    <div className="h-full bg-gradient-to-r from-destructive via-muted to-success" style={{
                    width: '100%',
                    opacity: 0.2
                  }} />
                    <div className="absolute top-0 bottom-0 bg-primary shadow-[0_0_10px_rgba(0,212,255,0.8)]" style={{
                    left: sentiment.score < 0 ? `${(sentiment.score + 1) / 2 * 100}%` : '50%',
                    width: `${Math.abs(sentiment.score) / 2 * 100}%`
                  }} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Headlines</h4>
                  {sentiment.headlines.map((hl, i) => <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded bg-black/20 gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground/90">{hl.title}</p>
                        <p className="text-xs text-muted-foreground">{hl.source} • {new Date(hl.publishedAt).toLocaleDateString()}</p>
                      </div>
                      <SeverityBadge severity={hl.sentiment === 'negative' ? 'critical' : hl.sentiment === 'positive' ? 'low' : 'medium'} className={hl.sentiment === 'neutral' ? 'bg-muted/20 text-muted-foreground border-border' : ''} />
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-border/50 text-center flex flex-col items-center justify-center p-6 py-8">
              <RiskMeter score={analysis.riskScore} />
              <div className="mt-6 font-medium text-lg">Risk Level: <span className="capitalize" style={{
                color: analysis.riskLevel === 'critical' || analysis.riskLevel === 'high' ? 'hsl(var(--destructive))' : analysis.riskLevel === 'medium' ? 'hsl(var(--warning))' : 'hsl(var(--success))'
              }}>{analysis.riskLevel}</span></div>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-destructive" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.riskFactors.map((rf, i) => <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">{rf.label}</span>
                      <SeverityBadge severity={rf.severity} />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{rf.description}</p>
                  </div>)}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20 backdrop-blur relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <CardTitle className="text-primary">AI Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.recommendation}</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </motion.div>
    </Shell>;
}
// Production release cleanup and documentation refresh
