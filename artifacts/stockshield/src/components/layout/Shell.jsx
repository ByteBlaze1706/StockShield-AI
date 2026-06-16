import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Shield, LayoutDashboard, MessageSquare, BarChart2, Settings, X, Menu, TrendingUp, TrendingDown, LogOut, ChevronDown } from "lucide-react";
import { StockSearch } from "../ui/stock-search";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/lib/auth-context";
const TICKER_DATA = [{
  ticker: "AAPL",
  price: 189.45,
  change: 0.65
}, {
  ticker: "TSLA",
  price: 248.79,
  change: -2.13
}, {
  ticker: "GME",
  price: 14.22,
  change: 32.0
}, {
  ticker: "NVDA",
  price: 875.40,
  change: 1.82
}, {
  ticker: "AMC",
  price: 4.87,
  change: 29.8
}, {
  ticker: "MSFT",
  price: 415.32,
  change: 0.52
}, {
  ticker: "META",
  price: 512.67,
  change: 0.85
}, {
  ticker: "MMAT",
  price: 0.34,
  change: 35.9
}, {
  ticker: "SPY",
  price: 521.43,
  change: 0.36
}, {
  ticker: "BBBY",
  price: 0.11,
  change: 37.5
}, {
  ticker: "GOOGL",
  price: 171.23,
  change: 0.52
}, {
  ticker: "SNDL",
  price: 1.74,
  change: 31.8
}];
function TickerTape() {
  const doubled = [...TICKER_DATA, ...TICKER_DATA];
  return <div className="w-full overflow-hidden bg-black/40 border-b border-border/30 py-1.5 relative">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/40 to-transparent z-10 pointer-events-none" />
      <div className="flex animate-ticker whitespace-nowrap" style={{
      width: "max-content"
    }}>
        {doubled.map((s, i) => <span key={i} className="inline-flex items-center gap-1.5 mx-6 text-xs font-mono">
            <span className="font-bold text-foreground/90">{s.ticker}</span>
            <span className="text-muted-foreground">${s.price.toFixed(2)}</span>
            <span className={`flex items-center gap-0.5 ${s.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {s.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}%
            </span>
          </span>)}
      </div>
    </div>;
}
function UserMenu() {
  const {
    user,
    logout
  } = useAuthContext();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [, navigate] = useLocation();
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const displayName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "User" : "User";
  const initials = user ? ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).toUpperCase() || "U" : "U";
  return <div ref={ref} className="relative p-3">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-border/30 transition-all duration-200 group">
        {user?.profileImageUrl ? <img src={user.profileImageUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover border border-primary/20 shadow-[0_0_10px_-2px_hsl(var(--primary))]" /> : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_-2px_hsl(var(--primary))]">
            {initials}
          </div>}
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
          {user?.email && <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && <motion.div initial={{
        opacity: 0,
        y: 6,
        scale: 0.97
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: 6,
        scale: 0.97
      }} transition={{
        duration: 0.15
      }} className="absolute bottom-full left-3 right-3 mb-2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="p-1">
              <button onClick={() => {
            navigate("/settings");
            setOpen(false);
          }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <div className="my-1 border-t border-border/30" />
              <button onClick={() => {
            logout();
            setOpen(false);
          }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}
export function Shell({
  children
}) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);
  const navItems = [{
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  }, {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart2
  }, {
    href: "/chat",
    label: "ShieldBot",
    icon: MessageSquare
  }, {
    href: "/settings",
    label: "Settings",
    icon: Settings
  }];
  const SidebarContent = () => <>
      <div className="p-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_16px_-4px_hsl(var(--primary))]">
          <Shield className="w-5 h-5" />
        </div>
        <Link href="/" className="font-bold text-lg tracking-tight text-foreground hover:text-primary transition-colors">
          StockShield <span className="text-primary">AI</span>
        </Link>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 py-2">Navigation</p>
        {navItems.map(navItem => {
        const Icon = navItem.icon;
        const isActive = location === navItem.href || navItem.href !== "/dashboard" && location.startsWith(navItem.href);
        return <Link key={navItem.href} href={navItem.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full shadow-[0_0_8px_2px_hsl(var(--primary))]" />}
              <Icon className={`w-4 h-4 ${isActive ? "drop-shadow-[0_0_6px_hsl(var(--primary))]" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-sm">{navItem.label}</span>
              {navItem.label === "ShieldBot" && <span className="ml-auto text-[9px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">AI</span>}
            </Link>;
      })}
      </nav>

      <div className="border-t border-border/50">
        <div className="px-3 pt-3 pb-1">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <p className="text-xs font-semibold text-primary mb-1">Live Monitoring</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]" />
              <p className="text-xs text-muted-foreground">12 assets tracked</p>
            </div>
          </div>
        </div>
        <UserMenu />
      </div>
    </>;
  return <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="w-64 border-r border-border/50 bg-sidebar/50 backdrop-blur-xl hidden md:flex flex-col">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && <>
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{
          x: "-100%"
        }} animate={{
          x: 0
        }} exit={{
          x: "-100%"
        }} transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }} className="fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-border/50 z-50 flex flex-col md:hidden">
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.div>
          </>}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Ticker Tape */}
        <TickerTape />

        {/* Topbar */}
        <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center px-4 md:px-6 z-10 shrink-0">
          <div className="flex-1 flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm">StockShield AI</span>
            </div>
            <div className="flex-1 max-w-sm ml-auto">
              <StockSearch />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>;
}