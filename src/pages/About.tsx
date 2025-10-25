import { Target, Eye, Award } from "lucide-react";
import aboutImage from "@/assets/about-office.jpg";

const About = () => {
  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-gradient">About BLACKDELTA</h1>
            <p className="text-xl text-muted-foreground">
              Leading the future of technology with innovative solutions in cybersecurity, design, and multimedia.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-card/30">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-gradient">Our Story</h2>
              <p className="text-muted-foreground text-lg">
                Founded with a vision to revolutionize digital security and creative solutions, BLACKDELTA TECHNOLOGIES has grown into a trusted partner for businesses worldwide.
              </p>
              <p className="text-muted-foreground">
                Our team of expert professionals combines cutting-edge technology with creative excellence to deliver solutions that not only meet but exceed client expectations. We believe in building long-term relationships based on trust, innovation, and results.
              </p>
              <p className="text-muted-foreground">
                From Fortune 500 companies to innovative startups, we've helped organizations secure their digital infrastructure, enhance their brand presence, and create compelling multimedia content that resonates with their audience.
              </p>
            </div>
            <div className="relative">
              <img 
                src={aboutImage} 
                alt="Modern Office" 
                className="rounded-lg card-shadow border border-primary/20"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 border border-border card-shadow hover:border-primary transition-smooth">
              <Target className="w-16 h-16 text-primary mx-auto animate-glow" />
              <h3 className="text-2xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground">
                To empower businesses with secure, innovative, and creative technology solutions that drive growth and success in the digital age.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 border border-border card-shadow hover:border-primary transition-smooth">
              <Eye className="w-16 h-16 text-primary mx-auto animate-glow" />
              <h3 className="text-2xl font-bold">Our Vision</h3>
              <p className="text-muted-foreground">
                To be the global leader in integrated technology solutions, setting new standards for security, design excellence, and multimedia innovation.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 border border-border card-shadow hover:border-primary transition-smooth">
              <Award className="w-16 h-16 text-primary mx-auto animate-glow" />
              <h3 className="text-2xl font-bold">Our Values</h3>
              <p className="text-muted-foreground">
                Innovation, integrity, excellence, and client success guide every decision we make and every solution we deliver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/30">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">500+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">250+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">50+</div>
              <div className="text-muted-foreground">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">10+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
