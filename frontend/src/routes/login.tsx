import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { HARDCODED_CREDENTIALS } from "@/api/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync with document theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  // Pre-configured login credentials
  const [loginEmail, setLoginEmail] = useState(HARDCODED_CREDENTIALS.email);
  const [loginPassword, setLoginPassword] = useState(HARDCODED_CREDENTIALS.password);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate({ to: "/", replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Theme toggle handler
  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const themeName = nextDark ? "dark" : "light";
    localStorage.setItem("theme", themeName);
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.classList.toggle("light", !nextDark);
    if (document.body) {
      document.body.classList.toggle("dark", nextDark);
      document.body.classList.toggle("light", !nextDark);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = loginEmail.trim();
    const password = loginPassword;

    if (!email || !password) {
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back to InsightsRank!");
      navigate({ to: "/" });
    } catch (err: any) {
      setErrorMessage(err?.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("Please contact your organization administrator to reset your password.");
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat overflow-hidden transition-all duration-500"
      style={{
        backgroundImage: "url('/images/login-bg.jpg')",
      }}
    >
      {/* Dynamic Theme-Aware Backdrop Overlay */}
      {/* Light mode: crisp, soft frosted glaze to let the illustration shine without visual noise */}
      {/* Dark mode: deep obsidian & midnight-blue atmospheric gradient with glowing vignette for seamless contrast */}
      <div className="absolute inset-0 transition-all duration-500 bg-white/35 backdrop-blur-[2px] dark:bg-gradient-to-b dark:from-slate-950/92 dark:via-[#070d1e]/94 dark:to-slate-950/96 dark:backdrop-blur-[5px]" />

      {/* Dark mode ambient radial glow behind card */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent" />

      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleToggleTheme}
          className="size-9 rounded-full bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 shadow-md backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 transition-all"
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDark ? (
            <Sun className="size-4 text-amber-400 transition-transform rotate-0 scale-100" />
          ) : (
            <Moon className="size-4 text-slate-700 transition-transform rotate-0 scale-100" />
          )}
        </Button>
      </div>

      {/* Sign-in Card Container */}
      <div className="relative z-10 w-full max-w-[430px]">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl shadow-2xl shadow-slate-900/10 dark:shadow-[0_0_60px_-15px_rgba(37,99,235,0.25)] p-7 sm:p-9 transition-all duration-300">
          
          {/* Theme-Adaptive Logo Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-10 sm:h-11 flex items-center justify-center mb-2">
              <img
                src="/images/logo-light.png"
                alt="InsightsRank"
                className="h-8 sm:h-9 w-auto dark:hidden block object-contain select-none"
              />
              <img
                src="/images/logo-dark.png"
                alt="InsightsRank"
                className="h-8 sm:h-9 w-auto hidden dark:block object-contain select-none"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Google Business Profile Intelligence Platform
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <Alert variant="destructive" className="mb-4 text-xs py-2.5">
              <AlertTitle className="text-xs font-semibold">Sign In Failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-medium text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="pl-9 text-xs h-10 bg-slate-50/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-foreground"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-xs font-medium text-foreground">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pl-9 pr-10 text-xs h-10 bg-slate-50/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-foreground"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <Label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer select-none">
                Remember this device for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-10 text-xs font-semibold shadow-md shadow-primary/25 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Security & Multi-tenant Notice */}
          <div className="mt-6 pt-5 border-t border-border/40 text-center">
            <p className="text-[11px] text-muted-foreground">
              Protected by enterprise-grade encryption & multi-tenant isolation.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            © 2026 InsightsRank. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
