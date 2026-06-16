import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart2, AlertTriangle, TrendingUp, Shield, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Legend } from "recharts";
const container = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};
const item = {
  hidden: {
    opacity: 0,
    y: 16
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};
const SECTOR_DATA = [{
  sector: "Consumer Disc.",
  risk: 87,
  stocks: 3,
  color: "#ef4444"
}, {
  sector: "Materials",
  risk: 68,
  stocks: 1,
  color: "#f59e0b"
}, {
  sector: "Technology",
  risk: 14,
  stocks: 3,
  color: "#22c55e"
}, {
  sector: "Comm. Services",
  risk: 37,
  stocks: 3,
  color: "#3b82f6"
}, {
  sector: "Consumer Staples",
  risk: 52,
  stocks: 1,
  color: "#f97316"
}, {
  sector: "ETF",
  risk: 5,
  stocks: 1,
  color: "#10b981"
}];
const FRAUD_TYPES = [{
  name: "Pump & Dump",
  count: 12,
  color: "#ef4444"
}, {
  name: "Volume Spike",
  count: 9,
  color: "#f59e0b"
}, {
  name: "Wash Trading",
  count: 7,
  color: "#8b5cf6"
}, {
  name: "Social Hype",
  count: 5,
  color: "#3b82f6"
}, {
  name: "Insider Signal",
  count: 3,
  color: "#06b6d4"
}];
const RISK_DISTRIBUTION = [{
  range: "0–20 (Safe)",
  count: 4,
  color: "#22c55e"
}, {
  range: "21–40 (Low)",
  count: 2,
  color: "#84cc16"
}, {
  range: "41–60 (Medium)",
  count: 1,
  color: "#f59e0b"
}, {
  range: "61–80 (High)",
  count: 1,
  color: "#f97316"
}, {
  range: "81–100 (Critical)",
  count: 4,
  color: "#ef4444"
}];
const RADAR_DATA = [{
  subject: "Volume",
  A: 82
}, {
  subject: "Sentiment",
  A: 67
}, {
  subject: "Price",
  A: 54
}, {
  subject: "Social",
  A: 73
}, {
  subject: "Insider",
  A: 38
}, {
  subject: "Fundamentals",
  A: 45
}];
const STOCK_COMPARISON = [{
  ticker: "BBBY",
  risk: 96,
  hype: 89,
  volume: 94,
  insider: 72
}, {
  ticker: "MMAT",
  risk: 91,
  hype: 78,
  volume: 88,
  insider: 61
}, {
  ticker: "GME",
  risk: 87,
  hype: 95,
  volume: 91,
  insider: 55
}, {
  ticker: "AMC",
  risk: 82,
  hype: 88,
  volume: 84,
  insider: 48
}, {
  ticker: "SNDL",
  risk: 78,
  hype: 65,
  volume: 79,
  insider: 41
}, {
  ticker: "TSLA",
  risk: 61,
  hype: 55,
  volume: 58,
  insider: 33
}, {
  ticker: "NVDA",
  risk: 22,
  hype: 42,
  volume: 30,
  insider: 15
}, {
  ticker: "META",
  risk: 19,
  hype: 28,
  volume: 22,
  insider: 12
}];
const CustomTooltip = ({
  active,
  payload,
  label
}) => {
  if (active && payload && payload.length) {
    return <div className="bg-card border border-border/50 rounded-xl p-3 text-xs shadow-xl">
        <p className="font-bold mb-1.5 text-foreground">{label}</p>
        {payload.map((p, i) => <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{
          background: p.color
        }} />
            <span className="text-muted-foreground capitalize">{p.dataKey}:</span>
            <span className="font-semibold text-foreground">{p.value}</span>
          </div>)}
      </div>;
  }
  return null;
};
export default function Analytics() {
  return <Shell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Market Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Deep insights into fraud patterns, sector risk, and manipulation detection.</p>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[{
          label: "Fraud Patterns Found",
          value: "36",
          icon: AlertTriangle,
          color: "text-destructive",
          glow: "shadow-[0_0_20px_-8px_hsl(var(--destructive))]"
        }, {
          label: "High Risk Sectors",
          value: "2",
          icon: BarChart2,
          color: "text-amber-400",
          glow: "shadow-[0_0_20px_-8px_rgba(251,191,36,0.5)]"
        }, {
          label: "Manipulation Score",
          value: "73/100",
          icon: Shield,
          color: "text-primary",
          glow: "shadow-[0_0_20px_-8px_hsl(var(--primary))]"
        }, {
          label: "Trending Anomalies",
          value: "+4 today",
          icon: TrendingUp,
          color: "text-emerald-400",
          glow: "shadow-[0_0_20px_-8px_rgba(52,211,153,0.5)]"
        }].map(c => {
          const Icon = c.icon;
          return <motion.div key={c.label} variants={item}>
                <Card className={`bg-card/40 backdrop-blur border-border/50 ${c.glow} hover:scale-[1.02] transition-all`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{c.label}</CardTitle>
                    <Icon className={`w-4 h-4 ${c.color}`} />
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className={`text-2xl md:text-3xl font-bold ${c.color}`}>{c.value}</div>
                  </CardContent>
                </Card>
              </motion.div>;
        })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sector Risk */}
          <motion.div variants={item}>
            <Card className="bg-card/40 backdrop-blur border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-primary" />
                  Risk by Sector
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SECTOR_DATA} margin={{
                    top: 0,
                    right: 0,
                    left: -20,
                    bottom: 0
                  }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
                      <XAxis dataKey="sector" stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{
                      fontSize: 10
                    }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                        {SECTOR_DATA.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Fraud Type Breakdown */}
          <motion.div variants={item}>
            <Card className="bg-card/40 backdrop-blur border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Fraud Type Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 h-56">
                  <div className="flex-1 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={FRAUD_TYPES} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" strokeWidth={0}>
                          {FRAUD_TYPES.map((_, i) => <Cell key={i} fill={FRAUD_TYPES[i].color} />)}
                        </Pie>
                        <Tooltip contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px"
                      }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 text-xs">
                    {FRAUD_TYPES.map(f => <div key={f.name} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{
                      background: f.color
                    }} />
                        <span className="text-muted-foreground">{f.name}</span>
                        <span className="font-bold ml-1">{f.count}</span>
                      </div>)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Risk Distribution */}
          <motion.div variants={item}>
            <Card className="bg-card/40 backdrop-blur border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-secondary" />
                  Risk Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mt-2">
                  {RISK_DISTRIBUTION.map(r => <div key={r.range} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{r.range}</span>
                        <span className="font-bold" style={{
                      color: r.color
                    }}>{r.count} stocks</span>
                      </div>
                      <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                        <motion.div initial={{
                      width: 0
                    }} animate={{
                      width: `${r.count / 12 * 100}%`
                    }} transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.2
                    }} className="h-full rounded-full" style={{
                      background: r.color
                    }} />
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Radar: Manipulation Factors */}
          <motion.div variants={item}>
            <Card className="bg-card/40 backdrop-blur border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-destructive" />
                  Manipulation Factor Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid stroke="hsl(var(--border))" opacity={0.5} />
                      <PolarAngleAxis dataKey="subject" tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))"
                    }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Risk" dataKey="A" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Multi-metric stock comparison */}
        <motion.div variants={item}>
          <Card className="bg-card/40 backdrop-blur border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Multi-Factor Stock Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={STOCK_COMPARISON} margin={{
                  top: 0,
                  right: 0,
                  left: -10,
                  bottom: 0
                }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
                    <XAxis dataKey="ticker" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{
                    fontSize: "11px",
                    color: "hsl(var(--muted-foreground))"
                  }} />
                    <Bar dataKey="risk" fill="#ef4444" radius={[2, 2, 0, 0]} fillOpacity={0.8} />
                    <Bar dataKey="hype" fill="#f59e0b" radius={[2, 2, 0, 0]} fillOpacity={0.8} />
                    <Bar dataKey="volume" fill="#3b82f6" radius={[2, 2, 0, 0]} fillOpacity={0.8} />
                    <Bar dataKey="insider" fill="#8b5cf6" radius={[2, 2, 0, 0]} fillOpacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Shell>;
}