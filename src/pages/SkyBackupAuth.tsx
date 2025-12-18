import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Cloud, Mail, Lock, User, Phone, ArrowRight, Shield, Zap, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const SkyBackupAuth = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "basic";
  const mode = searchParams.get("mode") || "signup";
  
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signIn, user, isAdmin } = useAuth();

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/skybackup/admin");
      } else {
        navigate("/skybackup/dashboard");
      }
    }
  }, [user, isAdmin, navigate]);

  const getPlanLabel = (planKey: string) => {
    const plans: Record<string, string> = {
      basic: "Basic (50 GB)",
      professional: "Professional (500 GB)",
      enterprise: "Enterprise (2 TB)"
    };
    return plans[planKey] || "Basic (50 GB)";
  };

  const getPlanPrice = (planKey: string) => {
    const prices: Record<string, string> = {
      basic: "TZS 15,000/mo",
      professional: "TZS 45,000/mo",
      enterprise: "TZS 150,000/mo"
    };
    return prices[planKey] || "TZS 15,000/mo";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome Back!",
            description: "You have successfully logged in."
          });
        }
      } else {
        const result = signupSchema.safeParse({ fullName, email, phone, password });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, fullName, phone, plan);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Please login instead.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Signup Failed",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Account Created!",
            description: "Your account is pending admin approval. You'll be notified once approved."
          });
          navigate("/skybackup/dashboard");
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background -z-10" />
      <div className="absolute inset-0 cyber-grid opacity-30 -z-10" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Features */}
        <div className="hidden md:block space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient-neon">SkyBackup</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Secure cloud storage with military-grade encryption
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl neon-border bg-card/50 backdrop-blur">
              <div className="p-3 rounded-lg bg-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">Your files are encrypted before leaving your device</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl neon-border-purple bg-card/50 backdrop-blur">
              <div className="p-3 rounded-lg bg-accent/20">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Lightning Fast Sync</h3>
                <p className="text-sm text-muted-foreground">Access your files instantly from any device</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl neon-border bg-card/50 backdrop-blur">
              <div className="p-3 rounded-lg bg-primary/20">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Automatic Backups</h3>
                <p className="text-sm text-muted-foreground">Never lose your important files again</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <Card className="w-full bg-card/80 backdrop-blur neon-border animate-pulse-neon">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center gap-2 mx-auto mb-4">
              <div className="p-3 rounded-xl bg-primary/20 glow-neon">
                <Cloud className="w-8 h-8 text-primary animate-glow" />
              </div>
            </div>
            <CardTitle className="text-2xl">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin 
                ? "Sign in to access your backup dashboard" 
                : (
                  <span>
                    Sign up for <span className="text-primary font-semibold">{getPlanLabel(plan)}</span>
                    <br />
                    <span className="text-accent font-bold">{getPlanPrice(plan)}</span>
                  </span>
                )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/30 transition-all"
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/30 transition-all"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/30 transition-all"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/30 transition-all"
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold glow transition-all duration-300 hover:glow-lg" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-primary font-medium">{isLogin ? "Sign up" : "Sign in"}</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkyBackupAuth;