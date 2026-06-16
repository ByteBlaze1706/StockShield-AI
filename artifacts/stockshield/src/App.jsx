import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuthContext } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import StockAnalysis from "@/pages/stock";
import Chat from "@/pages/chat";
import Analytics from "@/pages/analytics";
import SettingsPage from "@/pages/settings";
import { Shield } from "lucide-react";
const queryClient = new QueryClient();
function AuthLoading() {
  return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_40px_-8px_hsl(var(--primary))]">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]" />
        </div>
        <p className="text-muted-foreground text-sm animate-pulse">Authenticating...</p>
      </div>
    </div>;
}
function ProtectedRoute({
  component: Component
}) {
  const {
    isLoading,
    isAuthenticated
  } = useAuthContext();
  if (isLoading) return <AuthLoading />;
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <Component />;
}
function Router() {
  return <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/stock/:ticker">
        {() => <ProtectedRoute component={StockAnalysis} />}
      </Route>
      <Route path="/chat">
        {() => <ProtectedRoute component={Chat} />}
      </Route>
      <Route path="/analytics">
        {() => <ProtectedRoute component={Analytics} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={SettingsPage} />}
      </Route>
      <Route component={NotFound} />
    </Switch>;
}
function App() {
  return <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>;
}
export default App;
// Production release cleanup and documentation refresh
