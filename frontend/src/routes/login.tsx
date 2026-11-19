import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
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

  // Form credentials initialized with standard access credentials
  const [loginEmail, setLoginEmail] = useState(HARDCODED_CREDENTIALS.email);
  const [loginPassword, setLoginPassword] = useState(HARDCODED_CREDENTIALS.password);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate({ to: "/", replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

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
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('/images/login-bg.jpg')",
      }}
    >
      {/* Visual Overlay for legibility & contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 via-background/40 to-slate-900/60 backdrop-blur-[3px]" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-card/90 dark:bg-card/85 backdrop-blur-2xl shadow-2xl shadow-black/20 p-6 sm:p-8 transition-all">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 mb-3">
              <span className="font-bold text-xl tracking-tight">IR</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              InsightsRank
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
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
                  className="pl-9 text-xs h-10 bg-background/80 border-border/70"
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
                  className="pl-9 pr-10 text-xs h-10 bg-background/80 border-border/70"
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
              className="w-full h-10 text-xs font-semibold shadow-md shadow-primary/20 mt-2"
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

          {/* Subtle Security & Enterprise Notice */}
          <div className="mt-6 pt-5 border-t border-border/40 text-center">
            <p className="text-[11px] text-muted-foreground">
              Protected by enterprise-grade encryption & multi-tenant isolation.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-200/90 drop-shadow-sm font-medium">
            © 2026 InsightsRank. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
