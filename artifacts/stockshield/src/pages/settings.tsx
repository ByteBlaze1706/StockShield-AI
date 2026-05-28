import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Activity, Moon, Sliders, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } } };

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${value ? "bg-primary" : "bg-border"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function RangeSlider({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, hsl(var(--primary)) ${value}%, hsl(var(--border)) ${value}%)`
      }}
    />
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    highRiskAlerts: true,
    volumeSpikes: true,
    sentimentShifts: false,
    weeklyDigest: false,
  });
  const [riskThreshold, setRiskThreshold] = useState(60);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Shell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-2xl">
        <motion.div variants={item}>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Configure your StockShield AI preferences.</p>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item}>
          <Card className="bg-card/40 backdrop-blur border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                Alert Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "criticalAlerts" as const, label: "Critical Alerts", desc: "Immediate alerts for critical fraud detections (risk score 90+)" },
                { key: "highRiskAlerts" as const, label: "High Risk Alerts", desc: "Alerts for high-risk events (risk score 70–89)" },
                { key: "volumeSpikes" as const, label: "Volume Spike Detection", desc: "Notify when abnormal trading volume is detected" },
                { key: "sentimentShifts" as const, label: "Sentiment Shifts", desc: "Alert on major sentiment changes in tracked stocks" },
                { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "A summary of the week's top fraud detections" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between gap-4 py-1">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Toggle value={notifications[key]} onChange={(v) => setNotifications(prev => ({ ...prev, [key]: v }))} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Threshold */}
        <motion.div variants={item}>
          <Card className="bg-card/40 backdrop-blur border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                Risk Threshold
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-muted-foreground">Alert me when risk score exceeds:</p>
                  <span className="text-lg font-bold text-primary">{riskThreshold}</span>
                </div>
                <RangeSlider value={riskThreshold} onChange={setRiskThreshold} />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0 (Safe)</span>
                  <span>50 (Medium)</span>
                  <span>100 (Critical)</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl text-xs border ${
                riskThreshold >= 80 ? "bg-destructive/10 border-destructive/20 text-destructive" :
                riskThreshold >= 50 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}>
                {riskThreshold >= 80 ? "⚠️ High threshold — only critical manipulation events will trigger alerts." :
                 riskThreshold >= 50 ? "⚡ Moderate threshold — medium and high risk events will trigger alerts." :
                 "✅ Low threshold — most suspicious activity will trigger alerts."}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Display */}
        <motion.div variants={item}>
          <Card className="bg-card/40 backdrop-blur border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Moon className="w-4 h-4 text-secondary" />
                Display
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Always enabled for optimal chart readability</p>
                </div>
                <Toggle value={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Animated Charts</p>
                  <p className="text-xs text-muted-foreground">Enable chart entry animations</p>
                </div>
                <Toggle value={true} onChange={() => {}} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div variants={item}>
          <Card className="bg-card/40 backdrop-blur border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                About StockShield AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "Version", value: "1.0.0" },
                  { label: "AI Model", value: "Gemini 2.5 Flash" },
                  { label: "Data Provider", value: "Real-time Mock" },
                  { label: "Stocks Monitored", value: "12 assets" },
                  { label: "Alert Database", value: "PostgreSQL" },
                  { label: "Framework", value: "React + Express" },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-xl bg-black/20 border border-border/30">
                    <p className="text-muted-foreground">{label}</p>
                    <p className="font-semibold text-foreground mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs leading-relaxed">
                <Shield className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
                <strong>Disclaimer:</strong> StockShield AI is for educational purposes only. This is not financial advice. Always do your own research before making investment decisions.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-3">
          <Button onClick={handleSave} className="shadow-[0_0_16px_-4px_hsl(var(--primary))]">
            {saved ? "✓ Saved!" : "Save Preferences"}
          </Button>
          {saved && <span className="text-xs text-emerald-400">Changes saved successfully.</span>}
        </motion.div>
      </motion.div>
    </Shell>
  );
}
