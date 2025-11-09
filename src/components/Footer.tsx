import { Link } from "react-router-dom";
import { Shield, Mail, MessageCircle, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary animate-glow" />
              <span className="text-lg font-bold text-gradient">BLACK DELTA TECHNOLOGIES</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering businesses with cutting-edge cybersecurity, design, and multimedia solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Home</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-smooth">About</Link></li>
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Services</Link></li>
              <li><Link to="/portfolio" className="text-sm text-muted-foreground hover:text-primary transition-smooth">Portfolio</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Services</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Cybersecurity</li>
              <li className="text-sm text-muted-foreground">Ethical Hacking</li>
              <li className="text-sm text-muted-foreground">Graphic Design</li>
              <li className="text-sm text-muted-foreground">Multimedia</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:blackdeltatechnologies@gmail.com" className="text-muted-foreground hover:text-primary transition-smooth">
                  blackdeltatechnologies@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4 text-primary" />
                <a 
                  href="https://wa.me/255756377013" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  +255 756 377 013
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                Arusha
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BLACK DELTA TECHNOLOGIES. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
