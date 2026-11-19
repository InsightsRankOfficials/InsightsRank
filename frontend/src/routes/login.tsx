import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail, Building2, User as UserIcon, Loader2, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login form state - prefilled with demo credentials for instant 1-click test
  const [loginEmail, setLoginEmail] = useState("admin@insightsrank.com");
  const [loginPassword, setLoginPassword] = useState("Password123!");

  // Register form state
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regOrgName, setRegOrgName] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate({ to: "/", replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogin = async (e?: React.FormEvent, overrideEmail?: string, overridePassword?: string) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const email = overrideEmail || loginEmail;
    const password = overridePassword || loginPassword;

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back to InsightsRank!");
      navigate({ to: "/" });
    } catch (err: any) {
      setErrorMessage(err?.message || "Invalid credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regEmail || !regPassword || !regOrgName) {
      setErrorMessage("Please fill in all required fields (Email, Password, Organization).");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email: regEmail,
        password: regPassword,
        firstName: regFirstName,
        lastName: regLastName,
        organizationName: regOrgName,
      });
      toast.success("Account & Organization created successfully!");
      navigate({ to: "/" });
    } catch (err: any) {
      setErrorMessage(err?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            InsightsRank
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Google Business Profile Intelligence Platform
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Dummy Mode (Frontend Only — No Backend Needed)
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pb-3 text-center">
            <CardTitle className="text-xl font-semibold">
              Portal Access
            </CardTitle>
            <CardDescription className="text-xs">
              Sign in with any credentials or click Quick Demo Sign-In
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive" className="text-xs py-2">
                <AlertTitle className="text-xs font-semibold">Authentication Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login" className="text-xs">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="text-xs">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={(e) => handleLogin(e)} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="login-email" className="text-xs font-medium">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="user@organization.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-9 text-xs"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-xs font-medium">Password</Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-9 pr-9 text-xs"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-xs font-medium mt-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                {/* 1-Click Demo Account Quick Action Buttons */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Quick 1-Click Access</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-8"
                    disabled={isSubmitting}
                    onClick={() => handleLogin(undefined, "admin@insightsrank.com", "Password123!")}
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-500" /> Demo Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-8"
                    disabled={isSubmitting}
                    onClick={() => handleLogin(undefined, "ops@insightsrank.com", "Password123!")}
                  >
                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-blue-500" /> Demo Owner
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-3">
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="reg-first" className="text-xs font-medium">First name</Label>
                      <Input
                        id="reg-first"
                        type="text"
                        placeholder="John"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        className="text-xs"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="reg-last" className="text-xs font-medium">Last name</Label>
                      <Input
                        id="reg-last"
                        type="text"
                        placeholder="Doe"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        className="text-xs"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reg-org" className="text-xs font-medium">Organization name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-org"
                        type="text"
                        placeholder="Acme Franchise Group"
                        value={regOrgName}
                        onChange={(e) => setRegOrgName(e.target.value)}
                        className="pl-9 text-xs"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reg-email" className="text-xs font-medium">Work email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="john@acme.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="pl-9 text-xs"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reg-password" className="text-xs font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="pl-9 text-xs"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-xs font-medium mt-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                      </>
                    ) : (
                      "Create Demo Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
