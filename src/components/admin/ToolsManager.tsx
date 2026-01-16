import { useState, useEffect } from "react";
import { 
  Plus, Pencil, Trash2, Shield, Search, X, 
  ExternalLink, Download, Lock, Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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

const defaultTool = {
  name: "",
  description: "",
  category: "",
  is_paid: false,
  price: null as number | null,
  download_url: "",
  external_url: "",
  image_url: "",
  features: [] as string[]
};

const ToolsManager = () => {
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState(defaultTool);
  const [featureInput, setFeatureInput] = useState("");

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const toolData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      is_paid: formData.is_paid,
      price: formData.is_paid ? formData.price : null,
      download_url: formData.download_url || null,
      external_url: formData.external_url || null,
      image_url: formData.image_url || null,
      features: formData.features.length > 0 ? formData.features : null
    };

    if (editingTool) {
      const { error } = await supabase
        .from("tools")
        .update(toolData)
        .eq("id", editingTool.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update tool.", variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Tool updated successfully." });
    } else {
      const { error } = await supabase
        .from("tools")
        .insert(toolData);

      if (error) {
        toast({ title: "Error", description: "Failed to create tool.", variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Tool created successfully." });
    }

    setIsDialogOpen(false);
    setEditingTool(null);
    setFormData(defaultTool);
    fetchTools();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return;

    const { error } = await supabase
      .from("tools")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete tool.", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Tool deleted successfully." });
    fetchTools();
  };

  const openEditDialog = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description,
      category: tool.category,
      is_paid: tool.is_paid,
      price: tool.price,
      download_url: tool.download_url || "",
      external_url: tool.external_url || "",
      image_url: tool.image_url || "",
      features: tool.features || []
    });
    setIsDialogOpen(true);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-card/80 backdrop-blur neon-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Tools Management
            </CardTitle>
            <CardDescription>Manage cybersecurity tools</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingTool(null);
              setFormData(defaultTool);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="neon-glow">
                <Plus className="w-4 h-4 mr-2" />
                Add Tool
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTool ? "Edit Tool" : "Add New Tool"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Tool name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Input
                      required
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Network Security"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the tool..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_paid}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_paid: checked }))}
                    />
                    <Label>Paid Tool</Label>
                  </div>
                  {formData.is_paid && (
                    <div className="flex-1">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || null }))}
                        placeholder="Price ($)"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Download URL</Label>
                    <Input
                      value={formData.download_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, download_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>External URL</Label>
                    <Input
                      value={formData.external_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, external_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Add a feature"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeFeature(i)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="neon-glow">
                    {editingTool ? "Update" : "Create"} Tool
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredTools.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No tools found</p>
            </div>
          ) : (
            filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="p-4 bg-background/50 rounded-lg border border-border/50 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold truncate">{tool.name}</span>
                    <Badge variant={tool.is_paid ? "default" : "secondary"} className={tool.is_paid ? "bg-accent/20 text-accent" : "bg-green-500/20 text-green-400"}>
                      {tool.is_paid ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
                      {tool.is_paid ? `$${tool.price}` : "Free"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
                  <Badge variant="outline" className="mt-2 text-xs">{tool.category}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(tool)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(tool.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolsManager;