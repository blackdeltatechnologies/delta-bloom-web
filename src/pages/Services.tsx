import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Bug, Palette, Video, Calendar, Headphones, Cloud, Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const services = [
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Comprehensive security solutions protecting your business from digital threats with advanced monitoring, threat detection, and incident response.",
    features: ["Security Audits", "Threat Detection", "Incident Response", "Compliance Management"],
    action: "book",
  },
  {
    icon: Bug,
    title: "Ethical Hacking",
    description: "Identify vulnerabilities before malicious actors do with our professional penetration testing and security assessment services.",
    features: ["Penetration Testing", "Vulnerability Assessment", "Security Consulting", "Risk Analysis"],
    action: "book",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Create stunning visual identities that captivate your audience and strengthen your brand presence across all platforms.",
    features: ["Brand Identity", "UI/UX Design", "Marketing Materials", "Digital Assets"],
    action: "book",
  },
  {
    icon: Video,
    title: "Multimedia Solutions",
    description: "Professional video production, animation, and multimedia content that tells your story and engages your audience.",
    features: ["Video Production", "Animation", "Audio Engineering", "Content Strategy"],
    action: "book",
  },
  {
    icon: Headphones,
    title: "IT Support",
    description: "Professional technical support services to keep your business running smoothly. Submit tickets for any IT issues and get expert assistance.",
    features: ["24/7 Support", "Remote Assistance", "Hardware & Software Issues", "Network Troubleshooting"],
    action: "ticket",
  },
  {
    icon: Cloud,
    title: "SkyBackup",
    description: "Secure cloud backup for all your files, music, videos, and documents. Access your data anywhere, anytime with our reliable backup service.",
    features: ["Cloud Storage", "File Backup", "Access Anywhere", "Secure & Encrypted"],
    action: "skybackup",
  },
];

const skybackupPlans = [
  {
    name: "Basic",
    storage: "50 GB",
    price: "TSh 15,000/mo",
    features: ["50 GB Cloud Storage", "File Backup", "Access Anywhere", "Basic Support"],
    plan: "basic",
  },
  {
    name: "Professional",
    storage: "500 GB",
    price: "TSh 45,000/mo",
    features: ["500 GB Cloud Storage", "Priority Backup", "Access Anywhere", "Priority Support", "File Sharing"],
    plan: "professional",
    popular: true,
  },
  {
    name: "Enterprise",
    storage: "2 TB",
    price: "TSh 120,000/mo",
    features: ["2 TB Cloud Storage", "Instant Backup", "Access Anywhere", "24/7 Support", "Team Sharing", "Advanced Security"],
    plan: "enterprise",
  },
];

const Services = () => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showSkyBackupModal, setShowSkyBackupModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    date: "",
    message: "",
  });

  const [ticketData, setTicketData] = useState({
    name: "",
    email: "",
    phone: "",
    issue: "",
    priority: "",
    description: "",
  });

  const handleServiceClick = (service: typeof services[0]) => {
    if (service.action === "ticket") {
      setShowTicketModal(true);
    } else if (service.action === "skybackup") {
      setShowSkyBackupModal(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello! I'd like to book a service.\n\nName: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\nPreferred Date: ${formData.date}\n\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/255756377013?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Redirecting to WhatsApp...");
    setFormData({ name: "", email: "", service: "", date: "", message: "" });
  };

  const generateTicketPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 20;

    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("DARIUS DELTA", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("CEO - Black Delta Technologies", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 15;
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    
    yPosition += 15;
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("IT SUPPORT TICKET", margin, yPosition);
    
    yPosition += 12;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, margin, yPosition);
    
    yPosition += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information:", margin, yPosition);
    
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${ticketData.name}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Email: ${ticketData.email}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Phone: ${ticketData.phone}`, margin, yPosition);
    
    yPosition += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Issue Details:", margin, yPosition);
    
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Priority: ${ticketData.priority}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Issue Type: ${ticketData.issue}`, margin, yPosition);
    
    yPosition += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Problem Description:", margin, yPosition);
    
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    const splitDescription = doc.splitTextToSize(ticketData.description, pageWidth - 2 * margin);
    doc.text(splitDescription, margin, yPosition);
    
    yPosition += splitDescription.length * 7 + 15;
    
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 35, "FD");
    
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Need Immediate Assistance?", margin + 5, yPosition);
    
    yPosition += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Contact CEO directly for urgent matters:", margin + 5, yPosition);
    
    yPosition += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Phone: +255 756 377 013", margin + 5, yPosition);
    
    yPosition += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Available for critical support issues", margin + 5, yPosition);
    
    doc.save(`IT-Support-Ticket-${ticketData.name.replace(/\s+/g, "-")}-${Date.now()}.pdf`);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    generateTicketPDF();
    
    const ticketMessage = `🎫 NEW IT SUPPORT TICKET\n\n👤 Name: ${ticketData.name}\n📧 Email: ${ticketData.email}\n📱 Phone: ${ticketData.phone}\n\n⚠️ Priority: ${ticketData.priority}\n🔧 Issue: ${ticketData.issue}\n\n📝 Description:\n${ticketData.description}`;
    const whatsappUrl = `https://wa.me/255756377013?text=${encodeURIComponent(ticketMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success("PDF downloaded! Redirecting to WhatsApp...");
    setTicketData({ name: "", email: "", phone: "", issue: "", priority: "", description: "" });
    setShowTicketModal(false);
  };

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-gradient">Our Services</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive technology solutions tailored to your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-card/30">
        <div className="container px-4">
          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <StaggerItem key={index}>
                  <Card 
                    className="p-8 bg-card/50 border-border hover:border-primary transition-smooth card-shadow group h-full cursor-pointer"
                    onClick={() => handleServiceClick(service)}
                  >
                    <Icon className="w-16 h-16 text-primary mb-6 group-hover:animate-glow" />
                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                      {service.action === "ticket" ? "Submit Ticket" : service.action === "skybackup" ? "View Plans" : "Book Now"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* IT Support Ticket Modal */}
      <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Headphones className="w-6 h-6 text-primary" />
              Submit IT Support Ticket
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-name">Full Name</Label>
                <Input
                  id="ticket-name"
                  placeholder="Your full name"
                  value={ticketData.name}
                  onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket-email">Email</Label>
                <Input
                  id="ticket-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={ticketData.email}
                  onChange={(e) => setTicketData({ ...ticketData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticket-phone">Phone Number</Label>
              <Input
                id="ticket-phone"
                type="tel"
                placeholder="+255 XXX XXX XXX"
                value={ticketData.phone}
                onChange={(e) => setTicketData({ ...ticketData, phone: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-issue">Issue Type</Label>
                <Select
                  value={ticketData.issue}
                  onValueChange={(value) => setTicketData({ ...ticketData, issue: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hardware Issue">Hardware Issue</SelectItem>
                    <SelectItem value="Software Issue">Software Issue</SelectItem>
                    <SelectItem value="Network Problem">Network Problem</SelectItem>
                    <SelectItem value="Email Issue">Email Issue</SelectItem>
                    <SelectItem value="Password Reset">Password Reset</SelectItem>
                    <SelectItem value="System Error">System Error</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-priority">Priority</Label>
                <Select
                  value={ticketData.priority}
                  onValueChange={(value) => setTicketData({ ...ticketData, priority: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticket-description">Issue Description</Label>
              <Textarea
                id="ticket-description"
                placeholder="Please describe the issue in detail..."
                rows={4}
                value={ticketData.description}
                onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Submit Support Ticket
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* SkyBackup Plans Modal */}
      <Dialog open={showSkyBackupModal} onOpenChange={setShowSkyBackupModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cloud className="w-6 h-6 text-primary" />
              SkyBackup Plans
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mb-6">
            Choose a plan that fits your storage needs. After signup and payment, your account will be approved by admin.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {skybackupPlans.map((plan, index) => (
              <Card key={index} className={`p-6 bg-card/50 border-border hover:border-primary transition-smooth relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                  <p className="text-2xl font-bold text-primary">{plan.storage}</p>
                  <p className="text-sm text-muted-foreground">{plan.price}</p>
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to={`/skybackup/auth?plan=${plan.plan}`}>
                  <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                    Get Started
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
          <div className="text-center mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/skybackup/auth?mode=login" className="text-primary hover:underline">
                Sign in to your dashboard
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              Admin?{" "}
              <Link to="/skybackup/auth?mode=login" className="text-primary/70 hover:text-primary hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <Calendar className="w-16 h-16 text-primary mx-auto mb-4 animate-glow" />
                <h2 className="text-gradient mb-4">Book a Service</h2>
                <p className="text-muted-foreground">
                  Schedule a consultation with our experts to discuss your project.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="scale">
              <Card className="p-8 bg-card/50 border-border card-shadow">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.filter(s => s.action === "book").map((service, idx) => (
                          <SelectItem key={idx} value={service.title}>
                            {service.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" variant="hero" className="w-full">
                    Submit Booking Request
                  </Button>
                </form>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
