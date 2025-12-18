import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, Users, HardDrive, CheckCircle, XCircle, Clock, 
  Search, LogOut, FileText, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface UserSubscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  storage_used_bytes: number;
  created_at: string;
  approved_at: string | null;
  profiles: {
    full_name: string;
    email: string;
    phone: string | null;
  } | null;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getPlanStorage = (plan: string) => {
  const storages: Record<string, number> = {
    basic: 50 * 1024 * 1024 * 1024, // 50 GB
    professional: 500 * 1024 * 1024 * 1024, // 500 GB
    enterprise: 2 * 1024 * 1024 * 1024 * 1024 // 2 TB
  };
  return storages[plan] || storages.basic;
};

const getStoragePercentage = (used: number, plan: string) => {
  const total = getPlanStorage(plan);
  return Math.min((used / total) * 100, 100);
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return "bg-red-500";
  if (percentage >= 70) return "bg-yellow-500";
  return "bg-green-500";
};

const SkyBackupAdmin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/skybackup/auth?mode=login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchSubscriptions();
    }
  }, [user, isAdmin]);

  const fetchSubscriptions = async () => {
    // Fetch subscriptions
    const { data: subsData, error: subsError } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (subsError) {
      console.error("Error fetching subscriptions:", subsError);
      return;
    }

    // Fetch profiles for all users
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, full_name, email, phone");

    // Combine data
    const combined = (subsData || []).map(sub => {
      const profile = profilesData?.find(p => p.user_id === sub.user_id);
      return {
        ...sub,
        profiles: profile ? {
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone
        } : null
      };
    });

    setSubscriptions(combined);
  };

  const updateStatus = async (subscriptionId: string, newStatus: string) => {
    const updateData: Record<string, unknown> = { 
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    
    if (newStatus === "approved") {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = user!.id;
    }

    const { error } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("id", subscriptionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription status.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Status Updated",
      description: `Subscription ${newStatus} successfully.`
    });
    
    fetchSubscriptions();
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

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = 
      sub.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || sub.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: subscriptions.length,
    pending: subscriptions.filter(s => s.status === "pending").length,
    approved: subscriptions.filter(s => s.status === "approved").length,
    rejected: subscriptions.filter(s => s.status === "rejected").length,
    totalStorage: subscriptions.reduce((acc, s) => acc + s.storage_used_bytes, 0)
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">SkyBackup Admin</h1>
                <p className="text-muted-foreground">Manage users and subscriptions</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StaggerItem>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <Users className="w-8 h-8 text-primary mb-2" />
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="pt-6">
                <Clock className="w-8 h-8 text-yellow-500 mb-2" />
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="pt-6">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="pt-6">
                <XCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <HardDrive className="w-8 h-8 text-primary mb-2" />
                <p className="text-2xl font-bold">{formatFileSize(stats.totalStorage)}</p>
                <p className="text-sm text-muted-foreground">Total Storage</p>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        {/* User Management */}
        <ScrollReveal direction="up">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>View and manage user subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  {filteredSubscriptions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No subscriptions found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredSubscriptions.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-4 bg-background/50 rounded-lg border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold">{sub.profiles?.full_name || "Unknown"}</p>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                sub.status === "approved" ? "bg-green-500/20 text-green-500" :
                                sub.status === "rejected" ? "bg-red-500/20 text-red-500" :
                                "bg-yellow-500/20 text-yellow-500"
                              }`}>
                                {sub.status}
                              </span>
                            </div>
                          <p className="text-sm text-muted-foreground">{sub.profiles?.email}</p>
                            <p className="text-sm text-muted-foreground">Phone: {sub.profiles?.phone || "N/A"}</p>
                            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="capitalize">Plan: <strong>{sub.plan}</strong></span>
                              <span>Joined: {new Date(sub.created_at).toLocaleDateString()}</span>
                            </div>
                            {/* Storage Usage Progress Bar */}
                            <div className="mt-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Storage Used</span>
                                <span className="font-medium">
                                  {formatFileSize(sub.storage_used_bytes)} / {formatFileSize(getPlanStorage(sub.plan))}
                                </span>
                              </div>
                              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                                <div 
                                  className={`h-full transition-all ${getProgressColor(getStoragePercentage(sub.storage_used_bytes, sub.plan))}`}
                                  style={{ width: `${getStoragePercentage(sub.storage_used_bytes, sub.plan)}%` }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {getStoragePercentage(sub.storage_used_bytes, sub.plan).toFixed(1)}% used
                              </p>
                            </div>
                          </div>
                          
                          {sub.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateStatus(sub.id, "approved")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateStatus(sub.id, "rejected")}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                          
                          {sub.status === "rejected" && (
                            <Button
                              size="sm"
                              onClick={() => updateStatus(sub.id, "approved")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          
                          {sub.status === "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(sub.id, "rejected")}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Revoke
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default SkyBackupAdmin;
