import { useState } from "react";
import { Shield, Bug, Palette, Video, Calendar, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const services = [
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Comprehensive security solutions protecting your business from digital threats with advanced monitoring, threat detection, and incident response.",
    features: ["Security Audits", "Threat Detection", "Incident Response", "Compliance Management"],
  },
  {
    icon: Bug,
    title: "Ethical Hacking",
    description: "Identify vulnerabilities before malicious actors do with our professional penetration testing and security assessment services.",
    features: ["Penetration Testing", "Vulnerability Assessment", "Security Consulting", "Risk Analysis"],
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Create stunning visual identities that captivate your audience and strengthen your brand presence across all platforms.",
    features: ["Brand Identity", "UI/UX Design", "Marketing Materials", "Digital Assets"],
  },
  {
    icon: Video,
    title: "Multimedia Solutions",
    description: "Professional video production, animation, and multimedia content that tells your story and engages your audience.",
    features: ["Video Production", "Animation", "Audio Engineering", "Content Strategy"],
  },
  {
    icon: Headphones,
    title: "IT Support",
    description: "Professional technical support services to keep your business running smoothly. Submit tickets for any IT issues and get expert assistance.",
    features: ["24/7 Support", "Remote Assistance", "Hardware & Software Issues", "Network Troubleshooting"],
  },
];

const Services = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello! I'd like to book a service.\n\nName: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\nPreferred Date: ${formData.date}\n\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/255756377013?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Redirecting to WhatsApp...");
    setFormData({ name: "", email: "", service: "", date: "", message: "" });
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketMessage = `🎫 NEW IT SUPPORT TICKET\n\n👤 Name: ${ticketData.name}\n📧 Email: ${ticketData.email}\n📱 Phone: ${ticketData.phone}\n\n⚠️ Priority: ${ticketData.priority}\n🔧 Issue: ${ticketData.issue}\n\n📝 Description:\n${ticketData.description}`;
    const whatsappUrl = `https://wa.me/255756377013?text=${encodeURIComponent(ticketMessage)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Support ticket created! Redirecting to WhatsApp...");
    setTicketData({ name: "", email: "", phone: "", issue: "", priority: "", description: "" });
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
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="p-8 bg-card/50 border-border hover:border-primary transition-smooth card-shadow group">
                  <Icon className="w-16 h-16 text-primary mb-6 group-hover:animate-glow" />
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* IT Support Ticket Section */}
      <section className="py-20 bg-card/30">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <Headphones className="w-16 h-16 text-primary mx-auto mb-4 animate-glow" />
              <h2 className="text-gradient mb-4">Submit IT Support Ticket</h2>
              <p className="text-muted-foreground">
                Having technical issues? Submit a support ticket and our team will assist you.
              </p>
            </div>

            <Card className="p-8 bg-card/50 border-border card-shadow">
              <form onSubmit={handleTicketSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
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

                <div className="grid md:grid-cols-2 gap-6">
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
                    rows={6}
                    value={ticketData.description}
                    onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" size="lg" variant="hero" className="w-full">
                  Submit Support Ticket
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <Calendar className="w-16 h-16 text-primary mx-auto mb-4 animate-glow" />
              <h2 className="text-gradient mb-4">Book a Service</h2>
              <p className="text-muted-foreground">
                Schedule a consultation with our experts to discuss your project.
              </p>
            </div>

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
                      {services.map((service, idx) => (
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
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
