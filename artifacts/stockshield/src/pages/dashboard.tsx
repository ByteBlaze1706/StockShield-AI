import { Shell } from "@/components/layout/Shell";
import { useGetDashboardStats, useListWatchlist, useAddToWatchlist, useRemoveFromWatchlist, useGetAlertsSummary, getListWatchlistQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, ShieldAlert, TrendingUp, Star, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: watchlist, isLoading: watchlistLoading } = useListWatchlist();
  const { data: alertsSummary, isLoading: summaryLoading } = useGetAlertsSummary();
  const removeWatchlist = useRemoveFromWatchlist();

  const handleRemoveWatchlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeWatchlist.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListWatchlistQueryKey() });
      }
    });
  };

  if (statsLoading || watchlistLoading || summaryLoading || !stats) {
    return (
      <Shell>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </Shell>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <Shell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time threat assessment and market monitoring.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={item}>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monitored Assets</CardTitle>
                <Activity className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalStocksMonitored.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
                <AlertTriangle className="w-4 h-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">{stats.highRiskCount.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
                <ShieldAlert className="w-4 h-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{stats.activeAlerts.toLocaleString()}</div>
                {alertsSummary && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {alertsSummary.critical} critical, {alertsSummary.high} high
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Risk Score</CardTitle>
                <TrendingUp className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{stats.avgMarketRiskScore}/100</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <motion.div variants={item} className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>Top Risky Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topRiskyStocks.map((stock) => (
                    <Link key={stock.ticker} href={`/stock/${stock.ticker}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-border/50 transition-all cursor-pointer">
                        <div>
                          <div className="font-semibold text-lg">{stock.ticker}</div>
                          <div className="text-sm text-muted-foreground">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-destructive">{stock.riskScore}/100</div>
                          <div className="text-xs text-muted-foreground">Risk Score</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>Recent Alerts Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 rounded-lg bg-black/20 border border-border/30">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Link href={`/stock/${alert.ticker}`}>
                            <span className="font-bold text-primary hover:underline cursor-pointer">{alert.ticker}</span>
                          </Link>
                          <SeverityBadge severity={alert.severity} />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.detectedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1 capitalize text-foreground/80">{alert.type.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-card/50 backdrop-blur border-border/50 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(!watchlist || watchlist.length === 0) ? (
                  <div className="text-center p-8 text-muted-foreground text-sm">
                    Your watchlist is empty. Search for a stock to add it.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {watchlist.map(item => (
                      <Link key={item.id} href={`/stock/${item.ticker}`}>
                        <div className="flex flex-col p-3 rounded-lg bg-black/20 border border-border/30 hover:border-primary/50 transition-colors cursor-pointer relative group">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold">{item.ticker}</span>
                            <span className="font-mono">${item.currentPrice?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground truncate pr-2 max-w-[120px]">{item.stockName}</span>
                            <span className={item.change >= 0 ? 'text-success' : 'text-destructive'}>
                              {item.change >= 0 ? '+' : ''}{item.change?.toFixed(2)}%
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 bg-background/80 hover:bg-destructive/20 hover:text-destructive"
                            onClick={(e) => handleRemoveWatchlist(item.id, e)}
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
