import { Shell } from "@/components/layout/Shell";
import { useGetDashboardStats, useListWatchlist, useRemoveFromWatchlist, useGetAlertsSummary, getListWatchlistQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, ShieldAlert, TrendingUp, Star, Trash2, Zap, Eye, BarChart2, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } } };

function FearGreedGauge({ value }: { value: number }) {
  const color = value > 70 ? "#ef4444" : value > 40 ? "#f59e0b" : "#22c55e";
  const label = value > 70 ? "Extreme Fear" : value > 55 ? "Fear" : value > 45 ? "Neutral" : value > 30 ? "Greed" : "Extreme Greed";
  const data = [{ value, fill: color }, { value: 100 - value, fill: "rgba(255,255,255,0.05)" }];
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={56} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
              {data.map((_, i) => <Cell key={i} fill={data[i].fill} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{value}</span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <p className="text-sm font-semibold mt-1" style={{ color }}>{label}</p>
      <p className="text-xs text-muted-foreground">Market Sentiment</p>
    </div>
  );
}

const ALERT_ICONS: Record<string, string> = {
  pump_and_dump: "🚨",
  wash_trading: "🔄",
  insider_activity: "👁️",
  volume_spike: "📈",
  social_manipulation: "📢",
  coordinated_trading: "🤝",
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: watchlist, isLoading: watchlistLoading } = useListWatchlist();
  const { data: alertsSummary, isLoading: summaryLoading } = useGetAlertsSummary();
  const removeWatchlist = useRemoveFromWatchlist();

  const handleRemoveWatchlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeWatchlist.mutate({ id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListWatchlistQueryKey() }) });
  };

  if (statsLoading || watchlistLoading || summaryLoading || !stats) {
    return (
      <Shell>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </Shell>
    );
  }

  const fearGreedValue = Math.round(100 - stats.avgMarketRiskScore);

  const statCards = [
    {
      label: "Monitored Assets",
      value: stats.totalStocksMonitored.toLocaleString(),
      icon: Activity,
      color: "text-primary",
      glow: "shadow-[0_0_20px_-8px_hsl(var(--primary))]",
      bg: "from-primary/10 to-transparent",
      sub: "Active surveillance",
    },
    {
      label: "High Risk",
      value: stats.highRiskCount.toLocaleString(),
      icon: AlertTriangle,
      color: "text-amber-400",
      glow: "shadow-[0_0_20px_-8px_rgba(251,191,36,0.6)]",
      bg: "from-amber-500/10 to-transparent",
      sub: "Needs attention",
    },
    {
      label: "Active Alerts",
      value: stats.activeAlerts.toLocaleString(),
      icon: ShieldAlert,
      color: "text-destructive",
      glow: "shadow-[0_0_20px_-8px_hsl(var(--destructive))]",
      bg: "from-destructive/10 to-transparent",
      sub: alertsSummary ? `${alertsSummary.critical} critical, ${alertsSummary.high} high` : "—",
    },
    {
      label: "Avg Risk Score",
      value: `${stats.avgMarketRiskScore}/100`,
      icon: TrendingUp,
      color: "text-secondary",
      glow: "shadow-[0_0_20px_-8px_hsl(var(--secondary))]",
      bg: "from-secondary/10 to-transparent",
      sub: "Market-wide average",
    },
  ];

  return (
    <Shell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Overview</h1>
            <p className="text-muted-foreground text-sm mt-1">Real-time threat assessment and market monitoring.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live · Updated just now
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} variants={item}>
                <Card className={`bg-gradient-to-br ${s.bg} backdrop-blur border-border/50 hover:border-border transition-all duration-300 ${s.glow} hover:scale-[1.02] cursor-default`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className={`text-2xl md:text-3xl font-bold ${s.color}`}>{s.value}</div>
                    <p className="text-[11px] text-muted-foreground mt-1">{s.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2 space-y-6">
            {/* Top Risky Assets */}
            <Card className="bg-card/40 backdrop-blur border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldAlert className="w-4 h-4 text-destructive" />
                  Top Risky Assets
                  <span className="ml-auto text-xs text-muted-foreground font-normal">Click to analyze</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {stats.topRiskyStocks.map((stock, idx) => (
                  <Link key={stock.ticker} href={`/stock/${stock.ticker}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-border/50 transition-all cursor-pointer group">
                      <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{stock.ticker}</span>
                          <span className="text-xs text-muted-foreground truncate hidden sm:block">{stock.name}</span>
                        </div>
                        <div className="mt-1 h-1.5 bg-black/40 rounded-full overflow-hidden w-full">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stock.riskScore}%` }}
                            transition={{ delay: 0.3 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: stock.riskScore > 80 ? "hsl(var(--destructive))" : stock.riskScore > 50 ? "#f59e0b" : "hsl(var(--success))" }}
                          />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-destructive text-sm">{stock.riskScore}<span className="text-xs text-muted-foreground">/100</span></div>
                        <div className="text-[10px] text-emerald-400">+{stock.changePercent.toFixed(1)}%</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="bg-card/40 backdrop-blur border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Recent Alerts Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.recentAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 rounded-xl bg-black/20 border border-border/30 hover:border-border/60 transition-colors">
                    <div className="flex items-start justify-between mb-1.5 gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg">{ALERT_ICONS[alert.type] || "⚠️"}</span>
                        <Link href={`/stock/${alert.ticker}`}>
                          <span className="font-bold text-primary hover:underline cursor-pointer text-sm">{alert.ticker}</span>
                        </Link>
                        <SeverityBadge severity={alert.severity} />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(alert.detectedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-semibold capitalize text-foreground/70 mb-0.5">{alert.type.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{alert.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right column */}
          <motion.div variants={item} className="space-y-6">
            {/* Fear & Greed */}
            <Card className="bg-card/40 backdrop-blur border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-secondary" />
                  Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FearGreedGauge value={fearGreedValue} />
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                  <div className="text-center p-2 rounded-lg bg-black/20">
                    <p className="text-[10px] text-muted-foreground">AI Confidence</p>
                    <p className="text-lg font-bold text-primary">94%</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-black/20">
                    <p className="text-[10px] text-muted-foreground">Hype Score</p>
                    <p className="text-lg font-bold text-amber-400">72</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-black/20">
                    <p className="text-[10px] text-muted-foreground">Manipulation</p>
                    <p className="text-lg font-bold text-destructive">38%</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-black/20">
                    <p className="text-[10px] text-muted-foreground">Social Risk</p>
                    <p className="text-lg font-bold text-orange-400">High</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Watchlist */}
            <Card className="bg-card/40 backdrop-blur border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="w-4 h-4 text-primary" />
                  Watchlist
                  <Link href="/analytics" className="ml-auto">
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-primary px-2">
                      <BarChart2 className="w-3 h-3 mr-1" />
                      Analyze
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(!watchlist || watchlist.length === 0) ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <Star className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    Search a stock to add it here.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {watchlist.map(wl => (
                      <Link key={wl.id} href={`/stock/${wl.ticker}`}>
                        <div className="flex items-center p-3 rounded-xl bg-black/20 border border-border/30 hover:border-primary/40 transition-all cursor-pointer relative group">
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm">{wl.ticker}</span>
                              <span className="font-mono text-sm">${wl.currentPrice?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mt-0.5">
                              <span className="text-xs text-muted-foreground truncate pr-2 max-w-[120px]">{wl.stockName}</span>
                              <span className={`text-xs font-medium ${wl.change >= 0 ? "text-emerald-400" : "text-destructive"}`}>
                                {wl.change >= 0 ? "+" : ""}{wl.change?.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1.5 right-1.5 w-6 h-6 opacity-0 group-hover:opacity-100 bg-background/80 hover:bg-destructive/20 hover:text-destructive transition-all"
                            onClick={(e) => handleRemoveWatchlist(wl.id, e)}
                            disabled={removeWatchlist.isPending}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </Shell>
  );
}
