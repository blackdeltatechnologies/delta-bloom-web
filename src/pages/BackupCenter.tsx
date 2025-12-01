import { useState } from "react";
import { 
  HardDrive, 
  Cloud, 
  Shield, 
  Upload, 
  FolderOpen, 
  Clock, 
  Lock, 
  Zap,
  CheckCircle,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { useToast } from "@/hooks/use-toast";

const features = [
  {
    icon: Shield,
    title: "Military-Grade Encryption",
    description: "Your data is protected with AES-256 encryption, ensuring maximum security."
  },
  {
    icon: Cloud,
    title: "Cloud Redundancy",
    description: "Multiple backup copies across secure data centers for ultimate reliability."
  },
  {
    icon: Clock,
    title: "Automatic Backups",
    description: "Schedule automatic backups to never lose important files again."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "High-speed uploads and downloads with our optimized infrastructure."
  }
];

const storagePlans = [
  {
    name: "Basic",
    storage: "50 GB",
    price: "TZS 15,000",
    period: "/month",
    features: ["50 GB Storage", "Basic Encryption", "Email Support", "Manual Backups"]
  },
  {
    name: "Professional",
    storage: "500 GB",
    price: "TZS 45,000",
    period: "/month",
    features: ["500 GB Storage", "Advanced Encryption", "Priority Support", "Auto Backups", "File Versioning"],
    popular: true
  },
  {
    name: "Enterprise",
    storage: "2 TB",
    price: "TZS 120,000",
    period: "/month",
    features: ["2 TB Storage", "Military Encryption", "24/7 Support", "Auto Backups", "Unlimited Versioning", "API Access"]
  }
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image': return Image;
    case 'video': return Video;
    case 'audio': return Music;
    case 'archive': return Archive;
    default: return FileText;
  }
};

const BackupCenter = () => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    size: string;
    type: string;
    uploadDate: string;
  }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [storageUsed] = useState(0);
  const storageTotal = 50; // GB for demo

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newFiles = files.map(file => ({
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.type),
      uploadDate: new Date().toLocaleDateString()
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Files Added",
      description: `${files.length} file(s) ready for backup. Backend coming soon!`,
    });
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

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
                <HardDrive className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Secure Data Backup</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gradient">BLACK DELTA</span>
                <br />
                <span className="text-foreground">DATA BACKUP CENTER</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Store your valuable data securely with military-grade encryption. 
                Never lose important files again with our reliable cloud backup solutions.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose <span className="text-gradient">Our Backup Service</span>
            </h2>
          </ScrollReveal>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <Card className="h-full bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Area */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="left">
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-6 h-6 text-primary" />
                      Upload Files for Backup
                    </CardTitle>
                    <CardDescription>
                      Drag and drop files or click to browse. All file types supported.
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
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Cloud className="w-16 h-16 text-primary mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">
                          {isDragging ? 'Drop files here' : 'Drag & Drop files here'}
                        </p>
                        <p className="text-muted-foreground mb-4">or click to browse</p>
                        <Button variant="outline">
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Browse Files
                        </Button>
                      </label>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Files Ready for Backup ({uploadedFiles.length})
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {uploadedFiles.map((file, index) => {
                            const IconComponent = getFileIcon(file.type);
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
                              >
                                <div className="flex items-center gap-3">
                                  <IconComponent className="w-5 h-5 text-primary" />
                                  <div>
                                    <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{file.size}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFile(index)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                        <Button className="w-full mt-4" size="lg">
                          <Lock className="w-4 h-4 mr-2" />
                          Start Secure Backup
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          Backend storage coming soon. Files will be stored securely.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Storage Stats */}
            <div>
              <ScrollReveal direction="right">
                <Card className="bg-card/50 border-border/50 mb-6">
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
                          <span className="font-medium">{storageUsed} GB / {storageTotal} GB</span>
                        </div>
                        <Progress value={(storageUsed / storageTotal) * 100} className="h-3" />
                      </div>
                      <div className="pt-4 border-t border-border/50">
                        <p className="text-sm text-muted-foreground mb-2">Quick Stats</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-background/50 rounded-lg">
                            <p className="text-2xl font-bold text-primary">{uploadedFiles.length}</p>
                            <p className="text-xs text-muted-foreground">Files</p>
                          </div>
                          <div className="text-center p-3 bg-background/50 rounded-lg">
                            <p className="text-2xl font-bold text-primary">0</p>
                            <p className="text-xs text-muted-foreground">Folders</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
                  <CardContent className="pt-6">
                    <Lock className="w-10 h-10 text-primary mb-4" />
                    <h4 className="font-bold mb-2">Your Data is Safe</h4>
                    <p className="text-sm text-muted-foreground">
                      All uploads are encrypted with AES-256 encryption before storage. 
                      Only you can access your files.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Choose Your <span className="text-gradient">Storage Plan</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select the plan that fits your needs. All plans include secure encryption and reliable backups.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {storagePlans.map((plan, index) => (
              <StaggerItem key={index}>
                <Card className={`h-full relative ${
                  plan.popular 
                    ? 'border-primary bg-gradient-to-b from-primary/10 to-card/50 shadow-lg shadow-primary/20' 
                    : 'bg-card/50 border-border/50'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.storage} Storage</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="scale">
            <Card className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border-primary/30 overflow-hidden relative">
              <div className="absolute inset-0 cyber-grid opacity-10" />
              <CardContent className="py-12 text-center relative z-10">
                <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Secure Your Data?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Contact us today to set up your backup account or get a custom enterprise solution.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href="https://wa.me/255756377013?text=Hello%2C%20I%20want%20to%20set%20up%20a%20data%20backup%20account" target="_blank" rel="noopener noreferrer">
                      Contact for Setup
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/services">View All Services</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default BackupCenter;
