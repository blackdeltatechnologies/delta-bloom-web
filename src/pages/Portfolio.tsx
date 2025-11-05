import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import productLaunchImage from "@/assets/portfolio-product-launch.jpg";

type FilterType = "all" | "cybersecurity" | "design" | "multimedia";

const projects = [
  {
    title: "Enterprise Security Overhaul",
    category: "cybersecurity",
    description: "Comprehensive security infrastructure redesign for a Fortune 500 company, including penetration testing and threat monitoring.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
  },
  {
    title: "Brand Identity Redesign",
    category: "design",
    description: "Complete visual identity overhaul for a tech startup, including logo, color palette, and brand guidelines.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
  },
  {
    title: "Corporate Video Campaign",
    category: "multimedia",
    description: "Multi-platform video campaign featuring product demonstrations and customer testimonials.",
    image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop",
  },
  {
    title: "Network Penetration Testing",
    category: "cybersecurity",
    description: "Comprehensive penetration testing and vulnerability assessment for healthcare provider.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
  },
  {
    title: "E-commerce Platform Design",
    category: "design",
    description: "User-centered UI/UX design for a high-traffic e-commerce platform with focus on conversion optimization.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
  {
    title: "Product Launch Animation",
    category: "multimedia",
    description: "3D animation and motion graphics for new product launch across multiple channels.",
    image: productLaunchImage,
  },
  {
    title: "Cloud Security Implementation",
    category: "cybersecurity",
    description: "Multi-cloud security architecture deployment with automated threat detection and compliance monitoring.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
  },
  {
    title: "Mobile App Interface",
    category: "design",
    description: "Intuitive mobile application design for fitness tracking with gamification elements.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
  },
  {
    title: "Documentary Production",
    category: "multimedia",
    description: "Full-length documentary covering technology innovation in East African startups.",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop",
  },
  {
    title: "Incident Response System",
    category: "cybersecurity",
    description: "Real-time security incident response platform with automated threat mitigation capabilities.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
  },
  {
    title: "SaaS Dashboard Design",
    category: "design",
    description: "Enterprise analytics dashboard with data visualization and customizable widgets.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
  {
    title: "Training Video Series",
    category: "multimedia",
    description: "Educational video content series for cybersecurity awareness training program.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
  },
  {
    title: "Data Encryption Solution",
    category: "cybersecurity",
    description: "End-to-end encryption implementation for financial services with regulatory compliance.",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=600&fit=crop",
  },
  {
    title: "Restaurant Brand Package",
    category: "design",
    description: "Complete brand identity for restaurant chain including menu design and interior signage.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
  },
  {
    title: "Event Coverage Package",
    category: "multimedia",
    description: "Comprehensive event documentation including photography, videography, and live streaming.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
  },
];

const Portfolio = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-gradient">Our Portfolio</h1>
            <p className="text-xl text-muted-foreground">
              Explore our successful projects and see how we've helped businesses achieve their goals.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-card/30 sticky top-16 z-40 border-b border-border/50 backdrop-blur-lg">
        <div className="container px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "glow" : ""}
            >
              All Projects
            </Button>
            <Button
              variant={filter === "cybersecurity" ? "default" : "outline"}
              onClick={() => setFilter("cybersecurity")}
              className={filter === "cybersecurity" ? "glow" : ""}
            >
              Cybersecurity
            </Button>
            <Button
              variant={filter === "design" ? "default" : "outline"}
              onClick={() => setFilter("design")}
              className={filter === "design" ? "glow" : ""}
            >
              Design
            </Button>
            <Button
              variant={filter === "multimedia" ? "default" : "outline"}
              onClick={() => setFilter("multimedia")}
              className={filter === "multimedia" ? "glow" : ""}
            >
              Multimedia
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Card 
                key={index} 
                className="overflow-hidden bg-card/50 border-border hover:border-primary transition-smooth card-shadow group"
              >
                <div className="relative overflow-hidden aspect-video">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="pt-2">
                    <span className="text-xs uppercase tracking-wide text-primary">
                      {project.category}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Portfolio;
