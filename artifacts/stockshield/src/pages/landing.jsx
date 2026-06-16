import { Link } from "wouter";
import { Shield, Activity, Lock, Eye, ArrowRight, Zap, CheckCircle2, TrendingUp, AlertTriangle, Bot, ChevronRight, Github, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};
const stagger = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};
const FEATURES = [{
  icon: Activity,
  title: "Real-time Monitoring",
  desc: "Constant surveillance of price action and volume patterns for anomalies across 12+ monitored stocks.",
  color: "text-primary",
  bg: "bg-primary/10 border-primary/20"
}, {
  icon: Lock,
  title: "AI Risk Analysis",
  desc: "Gemini AI performs deep evaluation of fundamental and technical risk factors to score each asset.",
  color: "text-secondary",
  bg: "bg-secondary/10 border-secondary/20"
}, {
  icon: Eye,
  title: "Sentiment Tracking",
  desc: "Natural language processing detects coordinated pump schemes across news headlines in real time.",
  color: "text-amber-400",
  bg: "bg-amber-400/10 border-amber-400/20"
}, {
  icon: TrendingUp,
  title: "Volume Spike Alerts",
  desc: "Automatic detection of unusual trading volume that may signal wash trading or coordinated buying.",
  color: "text-emerald-400",
  bg: "bg-emerald-400/10 border-emerald-400/20"
}, {
  icon: AlertTriangle,
  title: "Insider Activity Signals",
  desc: "Pattern recognition to identify potential insider trading before information becomes public.",
  color: "text-orange-400",
  bg: "bg-orange-400/10 border-orange-400/20"
}, {
  icon: Bot,
  title: "ShieldBot Assistant",
  desc: "Your personal AI analyst explains fraud risks in plain English — no finance degree required.",
  color: "text-violet-400",
  bg: "bg-violet-400/10 border-violet-400/20"
}];
const HOW_IT_WORKS = [{
  step: "01",
  title: "Monitor the Market",
  desc: "StockShield continuously tracks price action, volume, and social sentiment for suspicious activity."
}, {
  step: "02",
  title: "AI Detection Engine",
  desc: "Our Gemini-powered engine analyzes patterns and scores each stock's fraud risk from 0 to 100."
}, {
  step: "03",
  title: "Instant Alerts",
  desc: "When manipulation is detected, you get a detailed alert explaining the threat — before it's too late."
}, {
  step: "04",
  title: "Protect Your Portfolio",
  desc: "Use our AI chat assistant to get plain-language explanations and actionable recommendations."
}];
const TESTIMONIALS = [{
  name: "Sarah K.",
  role: "Retail Investor",
  text: "StockShield caught a pump-and-dump scheme on MMAT before I invested. Saved me thousands.",
  avatar: "SK"
}, {
  name: "Marcus T.",
  role: "Day Trader",
  text: "The volume spike detection is incredibly accurate. It flagged GME activity 2 hours before the mainstream news.",
  avatar: "MT"
}, {
  name: "Priya R.",
  role: "Financial Student",
  text: "ShieldBot explains fraud patterns in a way I can actually understand. Best learning tool for beginners.",
  avatar: "PR"
}];
const STATS = [{
  value: "12+",
  label: "Stocks Monitored"
}, {
  value: "94%",
  label: "AI Accuracy"
}, {
  value: "2h",
  label: "Avg. Early Warning"
}, {
  value: "100%",
  label: "Free to Use"
}];
export default function Landing() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,212,255,0.12),transparent)]" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_16px_-4px_hsl(var(--primary))]">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">StockShield <span className="text-primary">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </nav>
          <Link href="/dashboard">
            <Button className="h-9 text-sm shadow-[0_0_16px_-4px_hsl(var(--primary))]">
              Launch App <ArrowRight className="ml-1.5 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-20 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8 shadow-[0_0_20px_-8px_hsl(var(--primary))]">
            <Zap className="w-3.5 h-3.5" />
            Powered by Gemini AI · Built for Retail Investors
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-[1.05]">
            We see what <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary">others miss.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            An intelligent watchdog for the retail investor. Detect market manipulation, suspicious volume spikes, and insider activity before they impact your portfolio.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-[0_0_40px_-10px_hsl(var(--primary))] hover:shadow-[0_0_60px_-10px_hsl(var(--primary))] transition-shadow">
                Enter Dashboard <ChevronRight className="ml-1 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base border-border/50 hover:bg-white/5 hover:border-primary/40">
                <Bot className="mr-2 w-4 h-4" />
                Talk to ShieldBot
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.6
      }} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {STATS.map(s => <div key={s.label} className="text-center p-4 rounded-xl bg-card/40 border border-border/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>)}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{
        once: true,
        margin: "-80px"
      }}>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Features</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to <br className="hidden md:block" /> trade with confidence.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => {
            const Icon = f.icon;
            return <motion.div key={f.title} variants={fadeUp} className="p-6 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm hover:border-border/80 transition-all group hover:scale-[1.01]">
                  <div className={`w-11 h-11 rounded-xl ${f.bg} border flex items-center justify-center ${f.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>;
          })}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{
        once: true,
        margin: "-80px"
      }}>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">From alert to action in minutes.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent hidden lg:block" />
            {HOW_IT_WORKS.map(step => <motion.div key={step.step} variants={fadeUp} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center mb-4 shadow-[0_0_20px_-8px_hsl(var(--primary))] z-10 bg-background">
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">{step.step}</span>
                </div>
                <h3 className="text-base font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>)}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{
        once: true,
        margin: "-80px"
      }}>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Trusted by investors.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => <motion.div key={t.name} variants={fadeUp} className="p-6 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm hover:border-border/80 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
              </motion.div>)}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-20">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center p-10 md:p-16 rounded-3xl bg-gradient-to-br from-primary/10 via-card/40 to-secondary/10 border border-primary/20 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08),transparent)] pointer-events-none" />
          <Shield className="w-12 h-12 text-primary mx-auto mb-6 drop-shadow-[0_0_16px_hsl(var(--primary))]" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Start protecting your portfolio today.</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">No sign-up needed. Completely free. AI-powered fraud detection for retail investors.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 font-semibold shadow-[0_0_40px_-10px_hsl(var(--primary))]">
                Enter Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            {["Free forever", "No credit card", "AI-powered", "Real-time alerts"].map(item => <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {item}
              </span>)}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">StockShield AI</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            For educational purposes only. Not financial advice. Always do your own research.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>;
}