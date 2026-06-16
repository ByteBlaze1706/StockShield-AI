import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, Lock, TrendingUp, Eye, AlertTriangle, Zap, User, Mail } from "lucide-react";
import { useAuthContext } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const FEATURES = [{
  icon: Eye,
  label: "Real-time Fraud Detection",
  description: "AI-powered monitoring of 12+ stocks"
}, {
  icon: AlertTriangle,
  label: "Instant Risk Alerts",
  description: "Get notified before it's too late"
}, {
  icon: TrendingUp,
  label: "Market Intelligence",
  description: "Fear & Greed gauge + manipulation scoring"
}, {
  icon: Zap,
  label: "ShieldBot AI",
  description: "Chat with your personal fraud analyst"
}];

export default function Login() {
  const {
    isAuthenticated,
    isLoading,
    login,
    register
  } = useAuthContext();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!email) {
      toast({ title: "Validation Error", description: "Email is required", variant: "destructive" });
      return;
    }
    if (!password) {
      toast({ title: "Validation Error", description: "Password is required", variant: "destructive" });
      return;
    }

    if (isSignUp) {
      if (!username) {
        toast({ title: "Validation Error", description: "Username is required", variant: "destructive" });
        return;
      }
      if (username.length < 3) {
        toast({ title: "Validation Error", description: "Username must be at least 3 characters", variant: "destructive" });
        return;
      }
      if (password.length < 6) {
        toast({ title: "Validation Error", description: "Password must be at least 6 characters", variant: "destructive" });
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Validation Error", description: "Passwords do not match", variant: "destructive" });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await register(username, email, password);
        toast({ title: "Account Created", description: "Welcome to StockShield AI!" });
      } else {
        await login(email, password);
        toast({ title: "Welcome Back", description: "Logged in successfully." });
      }
    } catch (err) {
      toast({
        title: isSignUp ? "Registration Failed" : "Login Failed",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(147,51,234,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.5) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

        <div className="relative z-10 max-w-md w-full">
          {/* Logo */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_30px_-6px_hsl(var(--primary))]">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">StockShield</h1>
              <p className="text-xs text-primary font-semibold tracking-widest uppercase">AI Fraud Detection</p>
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="mb-10">
            <h2 className="text-4xl font-bold text-foreground leading-tight mb-4">
              Protect your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                investments
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              AI-powered fraud detection that watches the market so you don't have to.
            </p>
          </motion.div>

          {/* Feature list */}
          <div className="space-y-4">
            {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return <motion.div key={feature.label} initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.5,
              delay: 0.2 + i * 0.1
            }} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-border/30 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20 shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                  </div>
                </motion.div>;
          })}
          </div>

          {/* Stats */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.7
        }} className="mt-8 flex gap-8">
            {[{
            value: "94%",
            label: "Accuracy"
          }, {
            value: "12+",
            label: "Assets tracked"
          }, {
            value: "2h",
            label: "Early warning"
          }].map(stat => <div key={stat.label}>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>)}
          </motion.div>
        </div>
      </div>

      {/* Right panel - sign in / sign up */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-secondary/3" />

        <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.5
      }} className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_-4px_hsl(var(--primary))]">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">StockShield <span className="text-primary">AI</span></span>
          </div>

          {/* Card */}
          <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
            {/* Lock/User icon */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_24px_-6px_hsl(var(--primary))]">
                {isSignUp ? <User className="w-7 h-7 text-primary" /> : <Lock className="w-7 h-7 text-primary" />}
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {isSignUp ? "Create Account" : "Welcome back"}
              </h2>
              <p className="text-muted-foreground text-xs">
                {isSignUp 
                  ? "Sign up to track stocks, customize risk alerts, and chat with AI."
                  : "Sign in to access your dashboard, watchlist, and AI fraud alerts."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="username"
                      className="pl-9 bg-black/25 border-border/50 focus-visible:ring-primary focus-visible:ring-1"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9 bg-black/25 border-border/50 focus-visible:ring-primary focus-visible:ring-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 bg-black/25 border-border/50 focus-visible:ring-primary focus-visible:ring-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9 bg-black/25 border-border/50 focus-visible:ring-primary focus-visible:ring-1"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-2.5 px-4 mt-2 rounded-xl font-semibold text-white text-sm
                  bg-gradient-to-r from-primary to-secondary
                  shadow-[0_0_24px_-6px_hsl(var(--primary))]
                  hover:shadow-[0_0_32px_-4px_hsl(var(--primary))]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isSignUp ? "Creating account..." : "Signing in..."}
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    {isSignUp ? "Create Account" : "Sign In"}
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card/60 px-2 text-muted-foreground">secure credentials</span>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-primary hover:underline font-semibold"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground/60 mt-6">
            By continuing, you agree to StockShield's terms of service. 
            Not financial advice.
          </p>
        </motion.div>
      </div>
    </div>;
}