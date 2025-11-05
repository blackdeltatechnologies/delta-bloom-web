import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import cyberShield from "@/assets/cyber-shield.jpg";
import cyberDatacenter from "@/assets/cyber-datacenter.jpg";
import cyberWorkspace from "@/assets/cyber-workspace.jpg";
import cyberEncryption from "@/assets/cyber-encryption.jpg";
import cyberHologram from "@/assets/cyber-hologram.jpg";

const carouselImages = [
  { src: cyberShield, alt: "Digital Security Shield" },
  { src: cyberDatacenter, alt: "Secure Data Center" },
  { src: cyberWorkspace, alt: "Cybersecurity Operations" },
  { src: cyberEncryption, alt: "Data Encryption Network" },
  { src: cyberHologram, alt: "Holographic Security Interface" },
];

const Home = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          <Carousel
            opts={{ loop: true }}
            plugins={[plugin.current]}
            className="w-full h-full"
          >
            <CarouselContent className="h-screen">
              {carouselImages.map((image, index) => (
                <CarouselItem key={index} className="h-screen">
                  <div className="relative w-full h-full">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Content */}
        <div className="container relative z-10 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-gradient animate-glow">
              Empowering Businesses with Cybersecurity, Design & Multimedia Solutions
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology solutions that protect, innovate, and elevate your business to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services">
                <Button size="lg" variant="hero" className="group">
                  View Services
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-gradient mb-4">Why Choose BLACKDELTA?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We combine expertise, innovation, and dedication to deliver exceptional results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-card/50 border border-border card-shadow hover:border-primary transition-smooth group">
              <Shield className="w-12 h-12 text-primary mb-4 group-hover:animate-glow" />
              <h3 className="text-2xl font-bold mb-3">Secure Solutions</h3>
              <p className="text-muted-foreground">
                Enterprise-grade cybersecurity protecting your digital assets with advanced threat detection and prevention.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 border border-border card-shadow hover:border-primary transition-smooth group">
              <Zap className="w-12 h-12 text-primary mb-4 group-hover:animate-glow" />
              <h3 className="text-2xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Rapid deployment and implementation without compromising quality or security standards.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card/50 border border-border card-shadow hover:border-primary transition-smooth group">
              <Users className="w-12 h-12 text-primary mb-4 group-hover:animate-glow" />
              <h3 className="text-2xl font-bold mb-3">Expert Team</h3>
              <p className="text-muted-foreground">
                Seasoned professionals with years of experience in cybersecurity, design, and multimedia production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container relative z-10 px-4 text-center">
          <h2 className="text-gradient mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help you achieve your goals with our comprehensive technology solutions.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="hero" className="group">
              Get Started Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
