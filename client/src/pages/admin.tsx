import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTheme } from "@/contexts/theme-context";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  BookOpen, 
  Layers, 
  Globe,
  Users,
  BarChart3,
  Eye,
  EyeOff,
  FileText,
  Image,
  Video,
  Music,
  Download,
  Megaphone
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Realm, Module, Lesson, InsertRealm, InsertModule, InsertLesson } from "@shared/schema";

export default function AdminPage() {
  const { theme } = useTheme();
  const { toast } = useToast();
  
  // State for forms
  const [isCreateRealmOpen, setIsCreateRealmOpen] = useState(false);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);
  const [selectedRealm, setSelectedRealm] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [selectedContentType, setSelectedContentType] = useState<string>("resource");

  // Form states
  const [realmForm, setRealmForm] = useState<Partial<InsertRealm>>({
    title: "",
    description: "",
    element: "",
    backgroundImage: "",
    icon: "",
    order: 1,
    isActive: true,
    childTheme: {},
    adultTheme: {}
  });

  const [moduleForm, setModuleForm] = useState<Partial<InsertModule>>({
    title: "",
    description: "",
    realmId: "",
    order: 1,
    isActive: true,
    prerequisites: []
  });

  const [lessonForm, setLessonForm] = useState<Partial<InsertLesson>>({
    title: "",
    description: "",
    moduleId: "",
    content: {},
    order: 1,
    duration: 15,
    isActive: true,
    childContent: {},
    adultContent: {}
  });

  const [contentForm, setContentForm] = useState({
    title: "",
    description: "",
    type: "resource",
    url: "",
    fileType: "",
    category: "",
    tags: "",
    isActive: true,
    content: "",
    targetAudience: "both"
  });

  // Mock content data (would be from API in real implementation)
  const [contentItems, setContentItems] = useState([
    {
      id: "1",
      title: "Sacred Geometry Guide",
      description: "Complete guide to sacred geometry principles",
      type: "resource",
      url: "/resources/sacred-geometry.pdf",
      fileType: "pdf",
      category: "guides",
      tags: ["geometry", "sacred", "spiritual"],
      isActive: true,
      targetAudience: "adult"
    },
    {
      id: "2", 
      title: "Dragon Adventure Music",
      description: "Background music for dragon quests",
      type: "media",
      url: "/audio/dragon-music.mp3",
      fileType: "audio",
      category: "music",
      tags: ["dragon", "adventure", "background"],
      isActive: true,
      targetAudience: "child"
    }
  ]);

  // Queries
  const { data: realms, isLoading: realmsLoading } = useQuery<Realm[]>({
    queryKey: ['/api/realms'],
  });

  const { data: modules } = useQuery<Module[]>({
    queryKey: ['/api/realms', selectedRealm, 'modules'],
    enabled: !!selectedRealm,
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ['/api/modules', selectedModule, 'lessons'],
    enabled: !!selectedModule,
  });

  // Mutations
  const createRealmMutation = useMutation({
    mutationFn: (data: InsertRealm) => apiRequest('POST', '/api/realms', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/realms'] });
      setIsCreateRealmOpen(false);
      setRealmForm({
        title: "",
        description: "",
        element: "",
        backgroundImage: "",
        icon: "",
        order: 1,
        isActive: true,
        childTheme: {},
        adultTheme: {}
      });
      toast({
        title: "Realm Created",
        description: "New mystical realm has been added to the academy.",
      });
    },
  });

  const createModuleMutation = useMutation({
    mutationFn: (data: InsertModule) => apiRequest('POST', '/api/modules', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/realms', selectedRealm, 'modules'] });
      setIsCreateModuleOpen(false);
      setModuleForm({
        title: "",
        description: "",
        realmId: "",
        order: 1,
        isActive: true,
        prerequisites: []
      });
      toast({
        title: "Module Created",
        description: theme === 'child' ? "New quest chapter added!" : "New sacred module added!",
      });
    },
  });

  const createLessonMutation = useMutation({
    mutationFn: (data: InsertLesson) => apiRequest('POST', '/api/lessons', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/modules', selectedModule, 'lessons'] });
      setIsCreateLessonOpen(false);
      setLessonForm({
        title: "",
        description: "",
        moduleId: "",
        content: {},
        order: 1,
        duration: 15,
        isActive: true,
        childContent: {},
        adultContent: {}
      });
      toast({
        title: "Lesson Created",
        description: theme === 'child' ? "New adventure added!" : "New sacred lesson added!",
      });
    },
  });

  const toggleRealmMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      apiRequest('PUT', `/api/realms/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/realms'] });
      toast({
        title: "Realm Updated",
        description: "Realm visibility has been updated.",
      });
    },
  });

  const deleteRealmMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/realms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/realms'] });
      toast({
        title: "Realm Deleted",
        description: "The mystical realm has been removed.",
      });
    },
  });

  const deleteModuleMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/modules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/realms', selectedRealm, 'modules'] });
      toast({
        title: "Module Deleted",
        description: theme === 'child' ? "Quest chapter removed!" : "Sacred module removed!",
      });
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/lessons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/modules', selectedModule, 'lessons'] });
      toast({
        title: "Lesson Deleted",
        description: theme === 'child' ? "Adventure removed!" : "Sacred lesson removed!",
      });
    },
  });

  const handleCreateRealm = () => {
    if (!realmForm.title || !realmForm.description || !realmForm.element) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createRealmMutation.mutate(realmForm as InsertRealm);
  };

  const handleCreateModule = () => {
    if (!moduleForm.title || !moduleForm.description || !moduleForm.realmId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createModuleMutation.mutate(moduleForm as InsertModule);
  };

  const handleCreateLesson = () => {
    if (!lessonForm.title || !lessonForm.description || !lessonForm.moduleId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createLessonMutation.mutate(lessonForm as InsertLesson);
  };

  const handleCreateContent = () => {
    if (!contentForm.title || !contentForm.description || !contentForm.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newContent = {
      ...contentForm,
      id: Date.now().toString(),
      tags: contentForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    setContentItems(prev => [...prev, newContent]);
    setIsCreateContentOpen(false);
    setContentForm({
      title: "",
      description: "",
      type: "resource",
      url: "",
      fileType: "",
      category: "",
      tags: "",
      isActive: true,
      content: "",
      targetAudience: "both"
    });

    toast({
      title: "Content Created",
      description: "New content item has been added successfully.",
    });
  };

  if (realmsLoading) {
    return (
      <div className="min-h-screen mystical-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mystical-background text-white">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-cinzel text-4xl font-bold mb-4 text-amber-100">
              Academy Administration
            </h1>
            <p className="text-white/70 text-lg">
              Manage your mystical curriculum, content, and learning experiences
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="mystical-card border-purple-500/30">
              <CardContent className="p-6 text-center">
                <Globe className="mx-auto mb-2 text-purple-400" size={24} />
                <div className="text-2xl font-bold text-purple-300 mb-1">{realms?.length || 0}</div>
                <div className="text-white/70 text-sm">Active Realms</div>
              </CardContent>
            </Card>

            <Card className="mystical-card border-blue-500/30">
              <CardContent className="p-6 text-center">
                <Layers className="mx-auto mb-2 text-blue-400" size={24} />
                <div className="text-2xl font-bold text-blue-300 mb-1">
                  {modules?.length || 0}
                </div>
                <div className="text-white/70 text-sm">
                  {theme === 'child' ? 'Quest Chapters' : 'Modules'}
                </div>
              </CardContent>
            </Card>

            <Card className="mystical-card border-green-500/30">
              <CardContent className="p-6 text-center">
                <BookOpen className="mx-auto mb-2 text-green-400" size={24} />
                <div className="text-2xl font-bold text-green-300 mb-1">
                  {lessons?.length || 0}
                </div>
                <div className="text-white/70 text-sm">
                  {theme === 'child' ? 'Adventures' : 'Lessons'}
                </div>
              </CardContent>
            </Card>

            <Card className="mystical-card border-amber-500/30">
              <CardContent className="p-6 text-center">
                <Users className="mx-auto mb-2 text-amber-400" size={24} />
                <div className="text-2xl font-bold text-amber-300 mb-1">47</div>
                <div className="text-white/70 text-sm">
                  {theme === 'child' ? 'Young Heroes' : 'Active Seekers'}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="realms" className="space-y-6">
            <TabsList className="glass-morphism">
              <TabsTrigger value="realms" data-testid="tab-realms">
                <Globe className="mr-2" size={16} />
                Realms
              </TabsTrigger>
              <TabsTrigger value="modules" data-testid="tab-modules">
                <Layers className="mr-2" size={16} />
                {theme === 'child' ? 'Quest Chapters' : 'Modules'}
              </TabsTrigger>
              <TabsTrigger value="lessons" data-testid="tab-lessons">
                <BookOpen className="mr-2" size={16} />
                {theme === 'child' ? 'Adventures' : 'Lessons'}
              </TabsTrigger>
              <TabsTrigger value="content" data-testid="tab-content">
                <FileText className="mr-2" size={16} />
                Content
              </TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics">
                <BarChart3 className="mr-2" size={16} />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="realms" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-cinzel text-2xl font-bold text-white">Mystical Realms</h2>
                <Dialog open={isCreateRealmOpen} onOpenChange={setIsCreateRealmOpen}>
                  <DialogTrigger asChild>
                    <Button className="adult-button" data-testid="button-create-realm">
                      <Plus className="mr-2" size={16} />
                      Create Realm
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="mystical-card border-white/20 text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-cinzel text-xl">Create New Realm</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="realm-title">Title</Label>
                          <Input
                            id="realm-title"
                            value={realmForm.title}
                            onChange={(e) => setRealmForm({ ...realmForm, title: e.target.value })}
                            placeholder="Earth Realm"
                            className="bg-black/20 border-white/20 text-white"
                            data-testid="input-realm-title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="realm-element">Element</Label>
                          <Select
                            value={realmForm.element}
                            onValueChange={(value) => setRealmForm({ ...realmForm, element: value })}
                          >
                            <SelectTrigger className="bg-black/20 border-white/20 text-white" data-testid="select-realm-element">
                              <SelectValue placeholder="Select element" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/90 border-white/20">
                              <SelectItem value="earth">Earth</SelectItem>
                              <SelectItem value="water">Water</SelectItem>
                              <SelectItem value="fire">Fire</SelectItem>
                              <SelectItem value="air">Air</SelectItem>
                              <SelectItem value="spirit">Spirit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="realm-description">Description</Label>
                        <Textarea
                          id="realm-description"
                          value={realmForm.description}
                          onChange={(e) => setRealmForm({ ...realmForm, description: e.target.value })}
                          placeholder="Discover the grounding wisdom of the earth element..."
                          className="bg-black/20 border-white/20 text-white"
                          data-testid="textarea-realm-description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="realm-icon">Icon (Emoji)</Label>
                          <Input
                            id="realm-icon"
                            value={realmForm.icon || ""}
                            onChange={(e) => setRealmForm({ ...realmForm, icon: e.target.value })}
                            placeholder="🌱"
                            className="bg-black/20 border-white/20 text-white"
                            data-testid="input-realm-icon"
                          />
                        </div>
                        <div>
                          <Label htmlFor="realm-order">Order</Label>
                          <Input
                            id="realm-order"
                            type="number"
                            value={realmForm.order}
                            onChange={(e) => setRealmForm({ ...realmForm, order: parseInt(e.target.value) })}
                            className="bg-black/20 border-white/20 text-white"
                            data-testid="input-realm-order"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="realm-background">Background Image URL</Label>
                        <Input
                          id="realm-background"
                          value={realmForm.backgroundImage || ""}
                          onChange={(e) => setRealmForm({ ...realmForm, backgroundImage: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="bg-black/20 border-white/20 text-white"
                          data-testid="input-realm-background"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="realm-active"
                          checked={realmForm.isActive || false}
                          onCheckedChange={(checked) => setRealmForm({ ...realmForm, isActive: checked })}
                          data-testid="switch-realm-active"
                        />
                        <Label htmlFor="realm-active">Active</Label>
                      </div>
                      <Button
                        onClick={handleCreateRealm}
                        disabled={createRealmMutation.isPending}
                        className="adult-button w-full"
                        data-testid="button-submit-realm"
                      >
                        {createRealmMutation.isPending ? 'Creating...' : 'Create Realm'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realms?.map((realm) => (
                  <Card key={realm.id} className="mystical-card border-white/20 hover:border-white/40 group">
                    <div 
                      className="h-32 bg-cover bg-center rounded-t-3xl relative" 
                      style={{ backgroundImage: `url(${realm.backgroundImage})` }}
                    >
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleRealmMutation.mutate({ id: realm.id, isActive: !realm.isActive })}
                          className="bg-black/50 hover:bg-black/70"
                          data-testid={`button-toggle-realm-${realm.id}`}
                        >
                          {realm.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-cinzel text-xl font-bold text-white">{realm.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{realm.icon}</span>
                          <Badge variant={realm.isActive ? "default" : "secondary"} className="text-xs">
                            {realm.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm mb-4">{realm.description}</p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          data-testid={`button-edit-realm-${realm.id}`}
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this realm? This action cannot be undone.")) {
                              deleteRealmMutation.mutate(realm.id);
                            }
                          }}
                          data-testid={`button-delete-realm-${realm.id}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <div className="col-span-full text-center py-12">
                    <Globe className="mx-auto mb-4 text-white/40" size={48} />
                    <p className="text-white/60 text-lg mb-4">No realms created yet</p>
                    <p className="text-white/40">Create your first mystical realm to get started.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">
                    {theme === 'child' ? 'Quest Chapters' : 'Sacred Modules'}
                  </h2>
                  {selectedRealm && (
                    <p className="text-white/60">
                      Showing modules for: {realms?.find(r => r.id === selectedRealm)?.title}
                    </p>
                  )}
                </div>
                <div className="flex space-x-4">
                  <Select
                    value={selectedRealm}
                    onValueChange={setSelectedRealm}
                  >
                    <SelectTrigger className="w-48 bg-black/20 border-white/20 text-white" data-testid="select-realm-filter">
                      <SelectValue placeholder="Select realm" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      {realms?.map((realm) => (
                        <SelectItem key={realm.id} value={realm.id}>
                          {realm.icon} {realm.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isCreateModuleOpen} onOpenChange={setIsCreateModuleOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="adult-button"
                        disabled={!selectedRealm}
                        data-testid="button-create-module"
                      >
                        <Plus className="mr-2" size={16} />
                        Create {theme === 'child' ? 'Chapter' : 'Module'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="mystical-card border-white/20 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="font-cinzel text-xl">
                          Create New {theme === 'child' ? 'Quest Chapter' : 'Module'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="module-title">Title</Label>
                          <Input
                            id="module-title"
                            value={moduleForm.title}
                            onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                            placeholder={theme === 'child' ? "Dragon Encounters" : "Foundations of Earth"}
                            className="bg-black/20 border-white/20 text-white"
                            data-testid="input-module-title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="module-description">Description</Label>
                          <Textarea
                            id="module-description"
                            value={moduleForm.description}
                            onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                            placeholder={theme === 'child' 
                              ? "Meet magical dragons and learn their ancient wisdom..." 
                              : "Learn the fundamental principles of earth element wisdom..."}
                            className="bg-black/20 border-white/20 text-white"
                            data-testid="textarea-module-description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="module-realm">Realm</Label>
                            <Select
                              value={moduleForm.realmId || selectedRealm}
                              onValueChange={(value) => {
                                setModuleForm({ ...moduleForm, realmId: value });
                                setSelectedRealm(value);
                              }}
                            >
                              <SelectTrigger className="bg-black/20 border-white/20 text-white" data-testid="select-module-realm">
                                <SelectValue placeholder="Select realm" />
                              </SelectTrigger>
                              <SelectContent className="bg-black/90 border-white/20">
                                {realms?.map((realm) => (
                                  <SelectItem key={realm.id} value={realm.id}>
                                    {realm.icon} {realm.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="module-order">Order</Label>
                            <Input
                              id="module-order"
                              type="number"
                              value={moduleForm.order}
                              onChange={(e) => setModuleForm({ ...moduleForm, order: parseInt(e.target.value) })}
                              className="bg-black/20 border-white/20 text-white"
                              data-testid="input-module-order"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="module-active"
                            checked={moduleForm.isActive || false}
                            onCheckedChange={(checked) => setModuleForm({ ...moduleForm, isActive: checked })}
                            data-testid="switch-module-active"
                          />
                          <Label htmlFor="module-active">Active</Label>
                        </div>
                        <Button
                          onClick={handleCreateModule}
                          disabled={createModuleMutation.isPending}
                          className="adult-button w-full"
                          data-testid="button-submit-module"
                        >
                          {createModuleMutation.isPending ? 'Creating...' : `Create ${theme === 'child' ? 'Chapter' : 'Module'}`}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {selectedRealm ? (
                <div className="space-y-4">
                  {modules?.map((module) => (
                    <Card key={module.id} className="mystical-card border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="font-cinzel text-xl font-bold text-white mr-4">{module.title}</h3>
                              <Badge variant={module.isActive ? "default" : "secondary"} className="text-xs">
                                {module.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-white/70 mb-4">{module.description}</p>
                            <div className="text-sm text-white/50">
                              Order: {module.order} • Prerequisites: {module.prerequisites?.length || 0}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              data-testid={`button-edit-module-${module.id}`}
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${module.title}"? This action cannot be undone.`)) {
                                  deleteModuleMutation.mutate(module.id);
                                }
                              }}
                              data-testid={`button-delete-module-${module.id}`}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-12">
                      <Layers className="mx-auto mb-4 text-white/40" size={48} />
                      <p className="text-white/60 text-lg mb-4">
                        No {theme === 'child' ? 'quest chapters' : 'modules'} in this realm yet
                      </p>
                      <p className="text-white/40">
                        Create your first {theme === 'child' ? 'quest chapter' : 'module'} to get started.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Globe className="mx-auto mb-4 text-white/40" size={48} />
                  <p className="text-white/60 text-lg">Select a realm to view its {theme === 'child' ? 'quest chapters' : 'modules'}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="lessons" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">
                    {theme === 'child' ? 'Adventures' : 'Sacred Lessons'}
                  </h2>
                  {selectedModule && (
                    <p className="text-white/60">
                      Showing lessons for: {modules?.find(m => m.id === selectedModule)?.title}
                    </p>
                  )}
                </div>
                <div className="flex space-x-4">
                  <Select
                    value={selectedModule}
                    onValueChange={setSelectedModule}
                  >
                    <SelectTrigger className="w-48 bg-black/20 border-white/20 text-white" data-testid="select-module-filter">
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      {modules?.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isCreateLessonOpen} onOpenChange={setIsCreateLessonOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="adult-button"
                        disabled={!selectedModule}
                        data-testid="button-create-lesson"
                      >
                        <Plus className="mr-2" size={16} />
                        Create {theme === 'child' ? 'Adventure' : 'Lesson'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="mystical-card border-white/20 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="font-cinzel text-xl">
                          Create New {theme === 'child' ? 'Adventure' : 'Lesson'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="lesson-title">Title</Label>
                          <Input
                            id="lesson-title"
                            value={lessonForm.title}
                            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                            placeholder={theme === 'child' ? "Dragon's First Challenge" : "Grounding Practices"}
                            className="bg-black/20 border-white/20 text-white"
                            data-testid="input-lesson-title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lesson-description">Description</Label>
                          <Textarea
                            id="lesson-description"
                            value={lessonForm.description}
                            onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                            placeholder={theme === 'child' 
                              ? "Face your first dragon and learn the ancient art of courage..." 
                              : "Discover ancient techniques for connecting with earth's stabilizing energy..."}
                            className="bg-black/20 border-white/20 text-white"
                            data-testid="textarea-lesson-description"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="lesson-module">Module</Label>
                            <Select
                              value={lessonForm.moduleId || selectedModule}
                              onValueChange={(value) => {
                                setLessonForm({ ...lessonForm, moduleId: value });
                                setSelectedModule(value);
                              }}
                            >
                              <SelectTrigger className="bg-black/20 border-white/20 text-white" data-testid="select-lesson-module">
                                <SelectValue placeholder="Select module" />
                              </SelectTrigger>
                              <SelectContent className="bg-black/90 border-white/20">
                                {modules?.map((module) => (
                                  <SelectItem key={module.id} value={module.id}>
                                    {module.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="lesson-order">Order</Label>
                            <Input
                              id="lesson-order"
                              type="number"
                              value={lessonForm.order}
                              onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) })}
                              className="bg-black/20 border-white/20 text-white"
                              data-testid="input-lesson-order"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lesson-duration">Duration (min)</Label>
                            <Input
                              id="lesson-duration"
                              type="number"
                              value={lessonForm.duration || ""}
                              onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) })}
                              className="bg-black/20 border-white/20 text-white"
                              data-testid="input-lesson-duration"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="lesson-active"
                            checked={lessonForm.isActive || false}
                            onCheckedChange={(checked) => setLessonForm({ ...lessonForm, isActive: checked })}
                            data-testid="switch-lesson-active"
                          />
                          <Label htmlFor="lesson-active">Active</Label>
                        </div>
                        <Button
                          onClick={handleCreateLesson}
                          disabled={createLessonMutation.isPending}
                          className="adult-button w-full"
                          data-testid="button-submit-lesson"
                        >
                          {createLessonMutation.isPending ? 'Creating...' : `Create ${theme === 'child' ? 'Adventure' : 'Lesson'}`}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {selectedModule ? (
                <div className="space-y-4">
                  {lessons?.map((lesson) => (
                    <Card key={lesson.id} className="mystical-card border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="font-cinzel text-xl font-bold text-white mr-4">{lesson.title}</h3>
                              <Badge variant={lesson.isActive ? "default" : "secondary"} className="text-xs">
                                {lesson.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-white/70 mb-4">{lesson.description}</p>
                            <div className="text-sm text-white/50">
                              Order: {lesson.order} • Duration: {lesson.duration} min
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              data-testid={`button-edit-lesson-${lesson.id}`}
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${lesson.title}"? This action cannot be undone.`)) {
                                  deleteLessonMutation.mutate(lesson.id);
                                }
                              }}
                              data-testid={`button-delete-lesson-${lesson.id}`}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-12">
                      <BookOpen className="mx-auto mb-4 text-white/40" size={48} />
                      <p className="text-white/60 text-lg mb-4">
                        No {theme === 'child' ? 'adventures' : 'lessons'} in this {theme === 'child' ? 'chapter' : 'module'} yet
                      </p>
                      <p className="text-white/40">
                        Create your first {theme === 'child' ? 'adventure' : 'lesson'} to get started.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Layers className="mx-auto mb-4 text-white/40" size={48} />
                  <p className="text-white/60 text-lg">
                    Select a {theme === 'child' ? 'quest chapter' : 'module'} to view its {theme === 'child' ? 'adventures' : 'lessons'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white">Content Management</h2>
                  <p className="text-white/60">Manage resources, media, announcements, and other content</p>
                </div>
                <div className="flex space-x-4">
                  <Select
                    value={selectedContentType}
                    onValueChange={setSelectedContentType}
                  >
                    <SelectTrigger className="w-48 bg-black/20 border-white/20 text-white" data-testid="select-content-type">
                      <SelectValue placeholder="Content type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="resource">📄 Resources</SelectItem>
                      <SelectItem value="media">🎵 Media</SelectItem>
                      <SelectItem value="announcement">📢 Announcements</SelectItem>
                      <SelectItem value="page">📃 Pages</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isCreateContentOpen} onOpenChange={setIsCreateContentOpen}>
                    <DialogTrigger asChild>
                      <Button className="adult-button" data-testid="button-create-content">
                        <Plus className="mr-2" size={16} />
                        Add Content
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="mystical-card border-white/20 text-white max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="font-cinzel text-xl">Create New Content</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="content-title">Title</Label>
                            <Input
                              id="content-title"
                              value={contentForm.title}
                              onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                              placeholder="Content title"
                              className="bg-black/20 border-white/20 text-white"
                              data-testid="input-content-title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="content-type">Content Type</Label>
                            <Select
                              value={contentForm.type}
                              onValueChange={(value) => setContentForm({ ...contentForm, type: value })}
                            >
                              <SelectTrigger className="bg-black/20 border-white/20 text-white" data-testid="select-content-type-form">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="bg-black/90 border-white/20">
                                <SelectItem value="resource">📄 Resource</SelectItem>
                                <SelectItem value="media">🎵 Media</SelectItem>
                                <SelectItem value="announcement">📢 Announcement</SelectItem>
                                <SelectItem value="page">📃 Page</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="content-description">Description</Label>
                          <Textarea
                            id="content-description"
                            value={contentForm.description}
                            onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                            placeholder="Brief description of the content..."
                            className="bg-black/20 border-white/20 text-white"
                            data-testid="textarea-content-description"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="content-category">Category</Label>
                            <Input
                              id="content-category"
                              value={contentForm.category}
                              onChange={(e) => setContentForm({ ...contentForm, category: e.target.value })}
                              placeholder="guides, music, etc."
                              className="bg-black/20 border-white/20 text-white"
                              data-testid="input-content-category"
                            />
                          </div>
                          <div>
                            <Label htmlFor="content-file-type">File Type</Label>
                            <Input
                              id="content-file-type"
                              value={contentForm.fileType}
                              onChange={(e) => setContentForm({ ...contentForm, fileType: e.target.value })}
                              placeholder="pdf, mp3, video, etc."
                              className="bg-black/20 border-white/20 text-white"
                              data-testid="input-content-file-type"
                            />
                          </div>
                          <div>
                            <Label htmlFor="content-audience">Target Audience</Label>
                            <Select
                              value={contentForm.targetAudience}
                              onValueChange={(value) => setContentForm({ ...contentForm, targetAudience: value })}
                            >
                              <SelectTrigger className="bg-black/20 border-white/20 text-white" data-testid="select-content-audience">
                                <SelectValue placeholder="Select audience" />
                              </SelectTrigger>
                              <SelectContent className="bg-black/90 border-white/20">
                                <SelectItem value="both">Both</SelectItem>
                                <SelectItem value="child">Children</SelectItem>
                                <SelectItem value="adult">Adults</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="content-url">URL/File Path</Label>
                          <Input
                            id="content-url"
                            value={contentForm.url}
                            onChange={(e) => setContentForm({ ...contentForm, url: e.target.value })}
                            placeholder="/resources/file.pdf or https://..."
                            className="bg-black/20 border-white/20 text-white"
                            data-testid="input-content-url"
                          />
                        </div>
                        <div>
                          <Label htmlFor="content-tags">Tags (comma-separated)</Label>
                          <Input
                            id="content-tags"
                            value={contentForm.tags}
                            onChange={(e) => setContentForm({ ...contentForm, tags: e.target.value })}
                            placeholder="spiritual, meditation, guides"
                            className="bg-black/20 border-white/20 text-white"
                            data-testid="input-content-tags"
                          />
                        </div>
                        {(contentForm.type === "page" || contentForm.type === "announcement") && (
                          <div>
                            <Label htmlFor="content-body">Content Body</Label>
                            <Textarea
                              id="content-body"
                              value={contentForm.content}
                              onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                              placeholder="Full content text..."
                              className="bg-black/20 border-white/20 text-white min-h-[100px]"
                              data-testid="textarea-content-body"
                            />
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="content-active"
                            checked={contentForm.isActive}
                            onCheckedChange={(checked) => setContentForm({ ...contentForm, isActive: checked })}
                            data-testid="switch-content-active"
                          />
                          <Label htmlFor="content-active">Active</Label>
                        </div>
                        <Button
                          onClick={handleCreateContent}
                          className="adult-button w-full"
                          data-testid="button-submit-content"
                        >
                          Create Content
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid gap-4">
                {contentItems
                  .filter(item => selectedContentType === "all" || item.type === selectedContentType)
                  .map((item) => (
                    <Card key={item.id} className="mystical-card border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="mr-3">
                                {item.type === "resource" && <FileText className="text-blue-400" size={20} />}
                                {item.type === "media" && <Music className="text-purple-400" size={20} />}
                                {item.type === "announcement" && <Megaphone className="text-yellow-400" size={20} />}
                                {item.type === "page" && <FileText className="text-green-400" size={20} />}
                              </div>
                              <h3 className="font-cinzel text-xl font-bold text-white mr-4">{item.title}</h3>
                              <Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">
                                {item.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Badge variant="outline" className="text-xs ml-2">
                                {item.targetAudience}
                              </Badge>
                            </div>
                            <p className="text-white/70 mb-3">{item.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {item.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-sm text-white/50">
                              Type: {item.type} • Category: {item.category} • File: {item.fileType}
                            </div>
                            {item.url && (
                              <div className="text-sm text-white/50 mt-1">
                                URL: {item.url}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              data-testid={`button-edit-content-${item.id}`}
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
                                  setContentItems(prev => prev.filter(content => content.id !== item.id));
                                  toast({
                                    title: "Content Deleted",
                                    description: "Content item has been removed.",
                                  });
                                }
                              }}
                              data-testid={`button-delete-content-${item.id}`}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
                {contentItems.filter(item => selectedContentType === "all" || item.type === selectedContentType).length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="mx-auto mb-4 text-white/40" size={48} />
                    <p className="text-white/60 text-lg mb-4">No content items found</p>
                    <p className="text-white/40">Create your first content item to get started.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="text-center py-12">
                <BarChart3 className="mx-auto mb-4 text-white/40" size={48} />
                <p className="text-white/60 text-lg mb-4">Analytics Dashboard</p>
                <p className="text-white/40">
                  Comprehensive learning analytics and insights coming soon.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
