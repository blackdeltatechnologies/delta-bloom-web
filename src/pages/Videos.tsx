import { useState, useEffect } from "react";
import { 
  Play, Search, Filter, ChevronDown, Clock, Star, 
  Youtube, Video as VideoIcon, ExternalLink
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  duration: string | null;
  is_featured: boolean;
  created_at: string;
}

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching videos:", error);
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const categories = ["all", ...Array.from(new Set(videos.map(v => v.category)))];
  const featuredVideos = videos.filter(v => v.is_featured);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // Get embed URL for video
  const getEmbedUrl = (url: string) => {
    const youtubeId = getYouTubeId(url);
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}`;
    }
    // For other video URLs, return as is
    return url;
  };

  // Get thumbnail from YouTube URL if no custom thumbnail
  const getThumbnail = (video: Video) => {
    if (video.thumbnail_url) return video.thumbnail_url;
    const youtubeId = getYouTubeId(video.video_url);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20 -z-10" />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-accent/5 to-transparent -z-10" />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
              <Play className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Learning Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-purple">
              Video Library
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Learn cybersecurity through our educational video content. 
              Tutorials, walkthroughs, and expert insights.
            </p>
          </div>
        </ScrollReveal>

        {/* Featured Videos */}
        {featuredVideos.length > 0 && (
          <ScrollReveal direction="up" delay={0.1}>
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Featured Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredVideos.slice(0, 2).map((video) => (
                  <Card 
                    key={video.id}
                    className="bg-card/80 backdrop-blur neon-border-purple overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative aspect-video">
                      {getThumbnail(video) ? (
                        <img 
                          src={getThumbnail(video)!}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                          <VideoIcon className="w-16 h-16 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="p-4 rounded-full bg-accent glow-purple">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      {video.duration && (
                        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                          <Clock className="w-3 h-3 mr-1" />
                          {video.duration}
                        </Badge>
                      )}
                      <Badge className="absolute top-2 left-2 bg-yellow-500/90 text-black">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{video.description}</p>
                      <Badge variant="outline" className="mt-3">{video.category}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Filters */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/50 neon-border"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="neon-border-purple">
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedCategory === "all" ? "All Categories" : selectedCategory}
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
          </div>
        </ScrollReveal>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-20">
            <VideoIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No videos found</h3>
            <p className="text-muted-foreground">
              {videos.length === 0 
                ? "Check back soon for new educational content!"
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.filter(v => !v.is_featured).map((video) => (
              <StaggerItem key={video.id}>
                <Card 
                  className="bg-card/80 backdrop-blur neon-border hover:neon-border-purple transition-all duration-300 overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative aspect-video">
                    {getThumbnail(video) ? (
                      <img 
                        src={getThumbnail(video)!}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                        <VideoIcon className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 rounded-full bg-accent glow-purple">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {video.duration && (
                      <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        {video.duration}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{video.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{video.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(video.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* Video Player Modal */}
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl bg-card border-border">
            <DialogHeader>
              <DialogTitle>{selectedVideo?.title}</DialogTitle>
            </DialogHeader>
            {selectedVideo && (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={getEmbedUrl(selectedVideo.video_url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Badge>{selectedVideo.category}</Badge>
                  {selectedVideo.duration && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedVideo.duration}
                    </span>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="ml-auto"
                  >
                    <a href={selectedVideo.video_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Original
                    </a>
                  </Button>
                </div>
                {selectedVideo.description && (
                  <p className="text-muted-foreground">{selectedVideo.description}</p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Videos;