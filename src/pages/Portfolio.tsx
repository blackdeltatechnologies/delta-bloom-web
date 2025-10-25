import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import productLaunchImage from "@/assets/portfolio-product-launch.jpg";

type FilterType = "all" | "cybersecurity" | "design" | "multimedia";

const projects = [
  {
    title: "Enterprise Security Overhaul",
    category: "cybersecurity",
    description: "Comprehensive security infrastructure redesign for a Fortune 500 company, including penetration testing and threat monitoring.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
    link: "#",
  },
  {
    title: "Brand Identity Redesign",
    category: "design",
    description: "Complete visual identity overhaul for a tech startup, including logo, color palette, and brand guidelines.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    link: "#",
  },
  {
    title: "Corporate Video Campaign",
    category: "multimedia",
    description: "Multi-platform video campaign featuring product demonstrations and customer testimonials.",
    image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop",
    link: "#",
  },
  {
    title: "Network Penetration Testing",
    category: "cybersecurity",
    description: "Comprehensive penetration testing and vulnerability assessment for healthcare provider.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    link: "#",
  },
  {
    title: "E-commerce Platform Design",
    category: "design",
    description: "User-centered UI/UX design for a high-traffic e-commerce platform with focus on conversion optimization.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    link: "#",
  },
  {
    title: "Product Launch Animation",
    category: "multimedia",
    description: "3D animation and motion graphics for new product launch across multiple channels.",
    image: productLaunchImage,
    link: "#",
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
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <a 
                      href={project.link} 
                      className="text-primary hover:text-primary-glow transition-smooth"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
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
