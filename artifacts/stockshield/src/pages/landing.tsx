import { Link } from "wouter";
import { Shield, Activity, Lock, Eye, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      
      {/* Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">StockShield AI</span>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="border-primary/50 hover:bg-primary/10 text-primary">
            Launch App
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center z-10 pt-20 pb-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Fraud Detection</span>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight">
            We see what <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">others miss.</span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-xl text-muted-foreground mb-12 max-w-2xl">
            An intelligent watchdog for the retail investor. Detect market manipulation, suspicious volume spikes, and unusual insider activity before they impact your portfolio.
          </motion.p>
          
          <motion.div variants={fadeUp}>
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-[0_0_40px_-10px_rgba(0,212,255,0.5)]">
                Enter Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full"
        >
          {[
            { icon: Activity, title: "Real-time Monitoring", desc: "Constant surveillance of price action and volume patterns for anomalies." },
            { icon: Lock, title: "Risk Analysis", desc: "Deep AI evaluation of fundamental and technical risk factors." },
            { icon: Eye, title: "Sentiment Tracking", desc: "Natural language processing to detect coordinated pump schemes across news." }
          ].map((feat, i) => (
            <motion.div key={i} variants={fadeUp} className="p-6 rounded-2xl bg-card border border-border/50 backdrop-blur-sm text-left">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary mb-4">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
