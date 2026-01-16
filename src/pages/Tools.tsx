import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, Search, Filter, Download, ExternalLink, Lock, 
  Unlock, ChevronDown, Sparkles, Zap, Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  is_paid: boolean;
  price: number | null;
  download_url: string | null;
  external_url: string | null;
  image_url: string | null;
  features: string[] | null;
  created_at: string;
}

const categoryIcons: Record<string, typeof Shield> = {
  "Network Security": Shield,
  "Penetration Testing": Zap,
  "Malware Analysis": Code,
  "Forensics": Search,
  "Encryption": Lock,
  "Default": Sparkles
};

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tools:", error);
    } else {
      setTools(data || []);
    }
    setLoading(false);
  };

  const categories = ["all", ...Array.from(new Set(tools.map(t => t.category)))];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesPrice = 
      priceFilter === "all" || 
      (priceFilter === "free" && !tool.is_paid) ||
      (priceFilter === "paid" && tool.is_paid);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || categoryIcons["Default"];
  };

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20 -z-10" />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Security Arsenal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-neon">
              Cybersecurity Tools
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our curated collection of professional cybersecurity tools. 
              Free and premium options available.
            </p>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/50 neon-border"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="neon-border">
                  <Filter className="w-4 h-4 mr-2" />
                  Category: {selectedCategory === "all" ? "All" : selectedCategory}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border">
                {categories.map((cat) => (
                  <DropdownMenuItem 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className="capitalize"
                  >
                    {cat === "all" ? "All Categories" : cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="neon-border-purple">
                  {priceFilter === "free" ? <Unlock className="w-4 h-4 mr-2" /> : 
                   priceFilter === "paid" ? <Lock className="w-4 h-4 mr-2" /> : 
                   <Sparkles className="w-4 h-4 mr-2" />}
                  {priceFilter === "all" ? "All Tools" : priceFilter === "free" ? "Free Only" : "Paid Only"}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border">
                <DropdownMenuItem onClick={() => setPriceFilter("all")}>All Tools</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceFilter("free")}>Free Only</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceFilter("paid")}>Paid Only</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="flex gap-4 mb-8 text-sm text-muted-foreground">
            <span>Total: <strong className="text-foreground">{tools.length}</strong> tools</span>
            <span>Free: <strong className="text-green-400">{tools.filter(t => !t.is_paid).length}</strong></span>
            <span>Premium: <strong className="text-accent">{tools.filter(t => t.is_paid).length}</strong></span>
          </div>
        </ScrollReveal>

        {/* Tools Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No tools found</h3>
            <p className="text-muted-foreground">
              {tools.length === 0 
                ? "Check back soon for new cybersecurity tools!"
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const CategoryIcon = getCategoryIcon(tool.category);
              return (
                <StaggerItem key={tool.id}>
                  <Card className="bg-card/80 backdrop-blur neon-border hover:neon-border-purple transition-all duration-300 h-full flex flex-col group">
                    {tool.image_url && (
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={tool.image_url} 
                          alt={tool.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <CategoryIcon className="w-4 h-4 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                        </div>
                        <Badge 
                          variant={tool.is_paid ? "default" : "secondary"}
                          className={tool.is_paid 
                            ? "bg-accent/20 text-accent border-accent/30" 
                            : "bg-green-500/20 text-green-400 border-green-500/30"
                          }
                        >
                          {tool.is_paid ? `$${tool.price}` : "Free"}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs">
                        {tool.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <CardDescription className="mb-4 flex-1">
                        {tool.description}
                      </CardDescription>
                      
                      {tool.features && tool.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {tool.features.slice(0, 3).map((feature, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 text-xs bg-secondary rounded-full text-muted-foreground"
                            >
                              {feature}
                            </span>
                          ))}
                          {tool.features.length > 3 && (
                            <span className="px-2 py-1 text-xs text-muted-foreground">
                              +{tool.features.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 mt-auto">
                        {tool.download_url && (
                          <Button 
                            asChild 
                            size="sm" 
                            className={tool.is_paid ? "bg-accent hover:bg-accent/80 flex-1" : "neon-glow flex-1"}
                          >
                            <a href={tool.download_url} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" />
                              {tool.is_paid ? "Purchase" : "Download"}
                            </a>
                          </Button>
                        )}
                        {tool.external_url && (
                          <Button 
                            asChild 
                            variant="outline" 
                            size="sm"
                            className="neon-border"
                          >
                            <a href={tool.external_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
};

export default Tools;