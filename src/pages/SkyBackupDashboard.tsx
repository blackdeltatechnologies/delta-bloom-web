import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Cloud, Upload, FolderOpen, Clock, HardDrive, FileText, 
  Image, Video, Music, Archive, Trash2, CheckCircle, AlertCircle, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

const getFileIcon = (type: string | null) => {
  switch (type) {
    case 'image': return Image;
    case 'video': return Video;
    case 'audio': return Music;
    case 'archive': return Archive;
    default: return FileText;
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
  if (mimeType.includes('zip') || mimeType.includes('rar')) return 'archive';
  return 'document';
};

const getPlanStorage = (plan: string) => {
  const storages: Record<string, number> = {
    basic: 50 * 1024 * 1024 * 1024, // 50 GB
    professional: 500 * 1024 * 1024 * 1024, // 500 GB
    enterprise: 2 * 1024 * 1024 * 1024 * 1024 // 2 TB
  };
  return storages[plan] || storages.basic;
};

const SkyBackupDashboard = () => {
  const { user, isApproved, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [files, setFiles] = useState<BackupFile[]>([]);
  const [subscription, setSubscription] = useState<{ plan: string; status: string; storage_used_bytes: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleLogout = async () => {
    await signOut();
    navigate("/skybackup");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  const totalStorage = subscription ? getPlanStorage(subscription.plan) : 0;
  const usedStorage = files.reduce((acc, f) => acc + f.file_size, 0);
  const usedPercent = totalStorage > 0 ? (usedStorage / totalStorage) * 100 : 0;

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Cloud className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">SkyBackup Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </ScrollReveal>

        {/* Status Banner */}
        {subscription && subscription.status !== "approved" && (
          <ScrollReveal direction="up">
            <Card className="mb-8 border-yellow-500/50 bg-yellow-500/10">
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Area */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="left">
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-6 h-6 text-primary" />
                      Upload Files
                    </CardTitle>
                    <CardDescription>
                      Drag and drop files or click to browse
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 cursor-pointer ${
                        isDragging 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50 hover:bg-card'
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
                        <Cloud className="w-16 h-16 text-primary mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">
                          {isDragging ? 'Drop files here' : 'Drag & Drop files here'}
                        </p>
                        <p className="text-muted-foreground mb-4">or click to browse</p>
                        <Button variant="outline" disabled={uploading}>
                          <FolderOpen className="w-4 h-4 mr-2" />
                          {uploading ? "Uploading..." : "Browse Files"}
                        </Button>
                      </label>
                    </div>

                    {/* Files List */}
                    {files.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Your Backups ({files.length})
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {files.map((file) => {
                            const IconComponent = getFileIcon(file.file_type);
                            return (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
                              >
                                <div className="flex items-center gap-3">
                                  <IconComponent className="w-5 h-5 text-primary" />
                                  <div>
                                    <p className="font-medium text-sm truncate max-w-[200px]">{file.file_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteFile(file)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Storage Stats */}
            <div>
              <ScrollReveal direction="right">
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-primary" />
                      Storage Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Used</span>
                          <span className="font-medium">
                            {formatFileSize(usedStorage)} / {formatFileSize(totalStorage)}
                          </span>
                        </div>
                        <Progress value={usedPercent} className="h-3" />
                      </div>
                      <div className="pt-4 border-t border-border/50">
                        <p className="text-sm text-muted-foreground mb-2">Plan Details</p>
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                          <p className="font-bold capitalize">{subscription?.plan} Plan</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(totalStorage)} Total Storage
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border/50">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-background/50 rounded-lg">
                            <p className="text-2xl font-bold text-primary">{files.length}</p>
                            <p className="text-xs text-muted-foreground">Files</p>
                          </div>
                          <div className="text-center p-3 bg-background/50 rounded-lg">
                            <Clock className="w-5 h-5 mx-auto text-primary mb-1" />
                            <p className="text-xs text-muted-foreground">Auto Backup</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        ) : (
          <ScrollReveal direction="up">
            <Card className="max-w-2xl mx-auto bg-card/50 border-border/50 text-center py-12">
              <CardContent>
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
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
    </div>
  );
};

export default SkyBackupDashboard;
