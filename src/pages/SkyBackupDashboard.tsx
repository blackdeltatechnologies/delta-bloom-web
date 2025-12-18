import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Cloud, Upload, FolderOpen, Clock, HardDrive, FileText, 
  Image, Video, Music, Archive, Trash2, CheckCircle, AlertCircle, LogOut,
  Download, Eye, Search, Filter, Grid, List, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface BackupFile {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string | null;
  created_at: string;
  storage_path: string;
}

type FileCategory = 'all' | 'image' | 'video' | 'audio' | 'document' | 'archive';

const FILE_CATEGORIES: { key: FileCategory; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'all', label: 'All Files', icon: FolderOpen, color: 'text-primary' },
  { key: 'image', label: 'Images', icon: Image, color: 'text-green-400' },
  { key: 'video', label: 'Videos', icon: Video, color: 'text-purple-400' },
  { key: 'audio', label: 'Audio', icon: Music, color: 'text-pink-400' },
  { key: 'document', label: 'Documents', icon: FileText, color: 'text-blue-400' },
  { key: 'archive', label: 'Archives', icon: Archive, color: 'text-yellow-400' },
];

const getFileIcon = (type: string | null) => {
  switch (type) {
    case 'image': return Image;
    case 'video': return Video;
    case 'audio': return Music;
    case 'archive': return Archive;
    default: return FileText;
  }
};

const getFileIconColor = (type: string | null) => {
  switch (type) {
    case 'image': return 'text-green-400';
    case 'video': return 'text-purple-400';
    case 'audio': return 'text-pink-400';
    case 'archive': return 'text-yellow-400';
    default: return 'text-blue-400';
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileType = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') || mimeType.includes('7z')) return 'archive';
  return 'document';
};

const getPlanStorage = (plan: string) => {
  const storages: Record<string, number> = {
    basic: 50 * 1024 * 1024 * 1024,
    professional: 500 * 1024 * 1024 * 1024,
    enterprise: 2 * 1024 * 1024 * 1024 * 1024
  };
  return storages[plan] || storages.basic;
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return "bg-red-500";
  if (percentage >= 70) return "bg-yellow-500";
  return "bg-primary";
};

const SkyBackupDashboard = () => {
  const { user, isApproved, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [files, setFiles] = useState<BackupFile[]>([]);
  const [subscription, setSubscription] = useState<{ plan: string; status: string; storage_used_bytes: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [previewFile, setPreviewFile] = useState<BackupFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/skybackup/auth?mode=login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSubscription();
      if (isApproved) {
        fetchFiles();
      }
    }
  }, [user, isApproved]);

  const fetchSubscription = async () => {
    const { data } = await supabase
      .from("subscriptions")
      .select("plan, status, storage_used_bytes")
      .eq("user_id", user!.id)
      .maybeSingle();
    
    if (data) setSubscription(data);
  };

  const fetchFiles = async () => {
    const { data } = await supabase
      .from("backup_files")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    
    if (data) setFiles(data);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isApproved) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isApproved) return;
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && isApproved) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (selectedFiles: File[]) => {
    if (!user || !isApproved) return;
    setUploading(true);

    for (const file of selectedFiles) {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from("backups")
        .upload(filePath, file);

      if (uploadError) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}: ${uploadError.message}`,
          variant: "destructive"
        });
        continue;
      }

      const { error: dbError } = await supabase
        .from("backup_files")
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_size: file.size,
          file_type: getFileType(file.type),
          storage_path: filePath
        });

      if (dbError) {
        toast({
          title: "Error",
          description: `Failed to save file record: ${dbError.message}`,
          variant: "destructive"
        });
      }
    }

    toast({
      title: "Upload Complete",
      description: `${selectedFiles.length} file(s) uploaded successfully.`
    });
    
    fetchFiles();
    fetchSubscription();
    setUploading(false);
  };

  const deleteFile = async (file: BackupFile) => {
    const { error: storageError } = await supabase.storage
      .from("backups")
      .remove([file.storage_path]);

    if (storageError) {
      toast({
        title: "Error",
        description: "Failed to delete file from storage.",
        variant: "destructive"
      });
      return;
    }

    const { error: dbError } = await supabase
      .from("backup_files")
      .delete()
      .eq("id", file.id);

    if (dbError) {
      toast({
        title: "Error",
        description: "Failed to delete file record.",
        variant: "destructive"
      });
      return;
    }

    toast({ title: "File Deleted", description: file.file_name });
    fetchFiles();
    fetchSubscription();
  };

  const downloadFile = async (file: BackupFile) => {
    const { data, error } = await supabase.storage
      .from("backups")
      .download(file.storage_path);

    if (error) {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Download Started", description: file.file_name });
  };

  const previewFileHandler = async (file: BackupFile) => {
    if (file.file_type !== 'image') {
      toast({
        title: "Preview Unavailable",
        description: "Preview is only available for images.",
        variant: "destructive"
      });
      return;
    }

    const { data } = await supabase.storage
      .from("backups")
      .createSignedUrl(file.storage_path, 300);

    if (data?.signedUrl) {
      setPreviewUrl(data.signedUrl);
      setPreviewFile(file);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/skybackup");
  };

  // Filtered files based on search and category
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.file_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || file.file_type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [files, searchTerm, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<FileCategory, number> = {
      all: files.length,
      image: files.filter(f => f.file_type === 'image').length,
      video: files.filter(f => f.file_type === 'video').length,
      audio: files.filter(f => f.file_type === 'audio').length,
      document: files.filter(f => f.file_type === 'document').length,
      archive: files.filter(f => f.file_type === 'archive').length,
    };
    return counts;
  }, [files]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const totalStorage = subscription ? getPlanStorage(subscription.plan) : 0;
  const usedStorage = files.reduce((acc, f) => acc + f.file_size, 0);
  const usedPercent = totalStorage > 0 ? (usedStorage / totalStorage) * 100 : 0;

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20 -z-10" />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20 glow-neon">
                <Cloud className="w-8 h-8 text-primary animate-glow" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-neon">SkyBackup Dashboard</h1>
                <p className="text-muted-foreground text-sm">Welcome back, {user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="neon-border hover:bg-primary/10">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </ScrollReveal>

        {/* Status Banner */}
        {subscription && subscription.status !== "approved" && (
          <ScrollReveal direction="up">
            <Card className="mb-8 border-yellow-500/50 bg-yellow-500/10 neon-border">
              <CardContent className="py-6 flex items-center gap-4">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
                <div>
                  <h3 className="font-bold text-lg">Pending Approval</h3>
                  <p className="text-muted-foreground">
                    Your {subscription.plan} plan subscription is pending admin approval. 
                    You'll be able to upload files once approved.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Approved Content */}
        {isApproved ? (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Categories & Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Storage Stats */}
              <ScrollReveal direction="left">
                <Card className="bg-card/80 backdrop-blur neon-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <HardDrive className="w-5 h-5 text-primary" />
                      Storage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Used</span>
                          <span className="font-medium text-foreground">
                            {formatFileSize(usedStorage)}
                          </span>
                        </div>
                        <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
                          <div 
                            className={`h-full transition-all duration-500 ${getProgressColor(usedPercent)}`}
                            style={{ width: `${Math.min(usedPercent, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {usedPercent.toFixed(1)}% used
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(totalStorage)}
                          </span>
                        </div>
                        {usedPercent >= 90 && (
                          <p className="text-xs text-red-400 mt-2 font-medium">
                            ⚠️ Storage almost full!
                          </p>
                        )}
                      </div>
                      <div className="pt-3 border-t border-border/50">
                        <div className="p-3 bg-primary/10 rounded-lg neon-border">
                          <p className="font-bold capitalize text-primary">{subscription?.plan} Plan</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(totalStorage)} Total
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Categories */}
              <ScrollReveal direction="left" delay={0.1}>
                <Card className="bg-card/80 backdrop-blur neon-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Filter className="w-5 h-5 text-primary" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {FILE_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.key}
                          onClick={() => setSelectedCategory(cat.key)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                            selectedCategory === cat.key 
                              ? 'bg-primary/20 neon-border' 
                              : 'hover:bg-secondary/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${cat.color}`} />
                            <span className="text-sm">{cat.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {categoryCounts[cat.key]}
                          </span>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Upload Area */}
              <ScrollReveal direction="up">
                <Card className="bg-card/80 backdrop-blur neon-border">
                  <CardContent className="p-6">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                        isDragging 
                          ? 'border-primary bg-primary/10 glow' 
                          : 'border-border/50 hover:border-primary/50 hover:bg-card'
                      }`}
                    >
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        disabled={uploading}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="p-4 rounded-full bg-primary/20 w-fit mx-auto mb-4 glow-neon">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-lg font-medium mb-1">
                          {isDragging ? 'Drop files here' : 'Drag & Drop files'}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                        <Button 
                          variant="outline" 
                          disabled={uploading}
                          className="neon-border hover:bg-primary/10"
                        >
                          <FolderOpen className="w-4 h-4 mr-2" />
                          {uploading ? "Uploading..." : "Browse Files"}
                        </Button>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Files Section */}
              <ScrollReveal direction="up" delay={0.1}>
                <Card className="bg-card/80 backdrop-blur neon-border">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Your Files ({filteredFiles.length})
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1 sm:w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Search files..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-secondary/50 border-border/50"
                          />
                        </div>
                        <div className="flex border border-border/50 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-primary/20' : 'hover:bg-secondary'}`}
                          >
                            <List className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-primary/20' : 'hover:bg-secondary'}`}
                          >
                            <Grid className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredFiles.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{files.length === 0 ? "No files uploaded yet" : "No files match your search"}</p>
                      </div>
                    ) : viewMode === 'list' ? (
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {filteredFiles.map((file) => {
                          const IconComponent = getFileIcon(file.file_type);
                          const iconColor = getFileIconColor(file.file_type);
                          return (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/30 transition-all group"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="p-2 rounded-lg bg-secondary">
                                  <IconComponent className={`w-5 h-5 ${iconColor}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-sm truncate">{file.file_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {file.file_type === 'image' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => previewFileHandler(file)}
                                    className="text-muted-foreground hover:text-primary"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => downloadFile(file)}
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteFile(file)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2">
                        {filteredFiles.map((file) => {
                          const IconComponent = getFileIcon(file.file_type);
                          const iconColor = getFileIconColor(file.file_type);
                          return (
                            <div
                              key={file.id}
                              className="p-4 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/30 transition-all group text-center"
                            >
                              <div className="p-4 rounded-lg bg-secondary w-fit mx-auto mb-3">
                                <IconComponent className={`w-8 h-8 ${iconColor}`} />
                              </div>
                              <p className="font-medium text-sm truncate mb-1">{file.file_name}</p>
                              <p className="text-xs text-muted-foreground mb-3">
                                {formatFileSize(file.file_size)}
                              </p>
                              <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {file.file_type === 'image' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => previewFileHandler(file)}
                                    className="h-8 w-8"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => downloadFile(file)}
                                  className="h-8 w-8"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteFile(file)}
                                  className="h-8 w-8 hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        ) : (
          <ScrollReveal direction="up">
            <Card className="max-w-2xl mx-auto bg-card/80 backdrop-blur neon-border text-center py-12">
              <CardContent>
                <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                  <Clock className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Awaiting Approval</h2>
                <p className="text-muted-foreground mb-4">
                  Your subscription is being reviewed by our team. 
                  Once approved, you'll be able to start uploading files.
                </p>
                <p className="text-sm text-muted-foreground">
                  Need help? Contact us via WhatsApp: +255 756 377 013
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => { setPreviewFile(null); setPreviewUrl(null); }}>
        <DialogContent className="max-w-3xl bg-card/95 backdrop-blur neon-border">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate">{previewFile?.file_name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt={previewFile?.file_name} 
                className="max-w-full max-h-[60vh] rounded-lg object-contain"
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => previewFile && downloadFile(previewFile)}
              className="neon-border"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkyBackupDashboard;