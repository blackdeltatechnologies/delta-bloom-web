import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello! I'm ${formData.name}.\n\nEmail: ${formData.email}\n\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/254756377013?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Redirecting to WhatsApp...");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-gradient">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Ready to start your project? Let's discuss how we can help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  We're here to help and answer any questions you might have. We look forward to hearing from you.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-card/50 border-border card-shadow hover:border-primary transition-smooth group">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-primary group-hover:animate-glow flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:blackdeltatechnologies@gmail.com" className="text-muted-foreground hover:text-primary transition-smooth">
                        blackdeltatechnologies@gmail.com
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 border-border card-shadow hover:border-primary transition-smooth group">
                  <div className="flex items-start gap-4">
                    <MessageCircle className="w-6 h-6 text-primary group-hover:animate-glow flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">WhatsApp</h3>
                      <a 
                        href="https://wa.me/254756377013" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-smooth"
                      >
                        +254 756 377 013
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 border-border card-shadow hover:border-primary transition-smooth group">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-primary group-hover:animate-glow flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a 
                        href="tel:+254756377013"
                        className="text-muted-foreground hover:text-primary transition-smooth"
                      >
                        +254 756 377 013
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 border-border card-shadow hover:border-primary transition-smooth group">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary group-hover:animate-glow flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Office</h3>
                      <p className="text-muted-foreground">123 Tech Boulevard</p>
                      <p className="text-muted-foreground">San Francisco, CA 94105</p>
                      <p className="text-muted-foreground">United States</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Map Placeholder */}
              <Card className="p-6 bg-card/50 border-border card-shadow">
                <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center border border-border">
                  <MapPin className="w-16 h-16 text-primary animate-glow" />
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="p-8 bg-card/50 border-border card-shadow">
                <h2 className="text-3xl font-bold mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us about your project or inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" variant="hero" className="w-full group">
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
