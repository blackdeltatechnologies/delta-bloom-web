import { useNavigate } from "react-router-dom";
import { 
  Cloud, Shield, Clock, Zap, CheckCircle, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: Shield,
    title: "Military-Grade Encryption",
    description: "Your data is protected with AES-256 encryption, ensuring maximum security."
  },
  {
    icon: Cloud,
    title: "Cloud Redundancy",
    description: "Multiple backup copies across secure data centers for ultimate reliability."
  },
  {
    icon: Clock,
    title: "Automatic Backups",
    description: "Schedule automatic backups to never lose important files again."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "High-speed uploads and downloads with our optimized infrastructure."
  }
];

const storagePlans = [
  {
    id: "basic",
    name: "Basic",
    storage: "50 GB",
    price: "TZS 15,000",
    period: "/month",
    features: ["50 GB Storage", "Basic Encryption", "Email Support", "Manual Backups"]
  },
  {
    id: "professional",
    name: "Professional",
    storage: "500 GB",
    price: "TZS 45,000",
    period: "/month",
    features: ["500 GB Storage", "Advanced Encryption", "Priority Support", "Auto Backups", "File Versioning"],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    storage: "2 TB",
    price: "TZS 120,000",
    period: "/month",
    features: ["2 TB Storage", "Military Encryption", "24/7 Support", "Auto Backups", "Unlimited Versioning", "API Access"]
  }
];

const SkyBackup = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isApproved } = useAuth();

  const handlePlanSelect = (planId: string) => {
    if (user) {
      if (isAdmin) {
        navigate("/skybackup/admin");
      } else if (isApproved) {
        navigate("/skybackup/dashboard");
      } else {
        navigate("/skybackup/dashboard");
      }
    } else {
      navigate(`/skybackup/auth?plan=${planId}`);
    }
  };

  const handleLogin = () => {
    if (user) {
      if (isAdmin) {
        navigate("/skybackup/admin");
      } else {
        navigate("/skybackup/dashboard");
      }
    } else {
      navigate("/skybackup/auth?mode=login");
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
                <Cloud className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Secure Cloud Storage</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gradient">SkyBackup</span>
                <br />
                <span className="text-foreground">SECURE DATA STORAGE</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Store your valuable data securely with military-grade encryption. 
                Never lose important files again with our reliable cloud backup solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => handlePlanSelect("professional")}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={handleLogin}>
                  {user ? "Go to Dashboard" : "Sign In"}
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose <span className="text-gradient">SkyBackup</span>
            </h2>
          </ScrollReveal>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <Card className="h-full bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Choose Your <span className="text-gradient">Storage Plan</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select a plan and create your account. Our team will review and approve your subscription.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {storagePlans.map((plan, index) => (
              <StaggerItem key={index}>
                <Card className={`h-full relative ${
                  plan.popular 
                    ? 'border-primary bg-gradient-to-b from-primary/10 to-card/50 shadow-lg shadow-primary/20' 
                    : 'bg-card/50 border-border/50'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.storage} Storage</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {user ? "View Dashboard" : "Sign Up Now"}
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="scale">
            <Card className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border-primary/30 overflow-hidden relative">
              <div className="absolute inset-0 cyber-grid opacity-10" />
              <CardContent className="py-12 text-center relative z-10">
                <Lock className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Secure Your Data?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Contact us today for custom enterprise solutions or special requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href="https://wa.me/255756377013?text=Hello%2C%20I%20want%20to%20learn%20more%20about%20SkyBackup" target="_blank" rel="noopener noreferrer">
                      Contact Us
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/services">View All Services</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default SkyBackup;
