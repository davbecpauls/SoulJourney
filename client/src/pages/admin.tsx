import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTheme } from "@/contexts/theme-context";
import { Navigation } from "@/components/navigation";
import { ContentCreator } from "@/components/admin/content-creator";
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
  Wand2,
  Upload,
  Download,
  Play
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
  const [showContentCreator, setShowContentCreator] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>(undefined);
  const [selectedRealm, setSelectedRealm] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");

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

  const handleSaveLesson = (lessonData: any) => {
    const enhancedLessonData = {
      ...lessonData,
      content: { blocks: lessonData.contentBlocks },
      childContent: { blocks: lessonData.contentBlocks.map((block: any) => ({ ...block, childThemed: true })) },
      adultContent: { blocks: lessonData.contentBlocks.map((block: any) => ({ ...block, adultThemed: true })) },
      mediaAssets: lessonData.contentBlocks.filter((block: any) => ['image', 'video', 'audio'].includes(block.type)),
      downloadableResources: lessonData.downloadableResources,
      gamificationData: lessonData.gamificationData,
      lessonType: lessonData.lessonType,
      choices: lessonData.choices,
      nextLessons: lessonData.choices?.map((choice: any) => choice.nextLesson).filter(Boolean) || []
    };

    if (editingLesson) {
      // Update existing lesson
      apiRequest('PUT', `/api/lessons/${editingLesson.id}`, enhancedLessonData)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['/api/modules', selectedModule, 'lessons'] });
          setShowContentCreator(false);
          setEditingLesson(undefined);
          toast({
            title: "Lesson Updated",
            description: "Lesson has been successfully updated.",
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to update lesson.",
            variant: "destructive",
          });
        });
    } else {
      // Create new lesson
      createLessonMutation.mutate(enhancedLessonData as InsertLesson);
      setShowContentCreator(false);
    }
  };

  const openContentCreator = (lesson?: Lesson) => {
    setEditingLesson(lesson);
    setShowContentCreator(true);
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
              <TabsTrigger value="content-creator" data-testid="tab-content-creator">
                <Wand2 className="mr-2" size={16} />
                Content Creator
              </TabsTrigger>
              <TabsTrigger value="media" data-testid="tab-media">
                <Upload className="mr-2" size={16} />
                Media Library
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
                  <Button 
                    className="adult-button"
                    disabled={!selectedModule}
                    onClick={() => openContentCreator()}
                    data-testid="button-create-interactive-lesson"
                  >
                    <Wand2 className="mr-2" size={16} />
                    Create Interactive {theme === 'child' ? 'Adventure' : 'Lesson'}
                  </Button>
                  <Dialog open={isCreateLessonOpen} onOpenChange={setIsCreateLessonOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        disabled={!selectedModule}
                        data-testid="button-create-lesson"
                      >
                        <Plus className="mr-2" size={16} />
                        Quick {theme === 'child' ? 'Adventure' : 'Lesson'}
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
                              onClick={() => openContentCreator(lesson)}
                              data-testid={`button-edit-lesson-${lesson.id}`}
                            >
                              <Wand2 size={14} className="mr-1" />
                              Enhanced Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              data-testid={`button-quick-edit-lesson-${lesson.id}`}
                            >
                              <Edit size={14} className="mr-1" />
                              Quick Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
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

            <TabsContent value="content-creator" className="space-y-6">
              {showContentCreator ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-cinzel text-2xl font-bold text-white">
                      Interactive Content Creator
                    </h2>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowContentCreator(false);
                        setEditingLesson(undefined);
                      }}
                    >
                      Back to Lessons
                    </Button>
                  </div>
                  <ContentCreator
                    realms={realms || []}
                    modules={modules || []}
                    onSave={handleSaveLesson}
                    editingLesson={editingLesson}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <Wand2 className="mx-auto mb-4 text-white/40" size={48} />
                  <h3 className="text-xl font-semibold text-white mb-4">Interactive Content Creator</h3>
                  <p className="text-white/60 text-lg mb-6">
                    Create rich, interactive lessons with branching narratives, multimedia content, and gamification.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => openContentCreator()}
                      disabled={!selectedModule}
                      className="adult-button"
                    >
                      <Wand2 className="mr-2" size={16} />
                      Start Creating
                    </Button>
                    {!selectedModule && (
                      <p className="text-white/40 text-sm self-center">
                        Select a module first to create lessons
                      </p>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-cinzel text-2xl font-bold text-white">Media Library</h2>
                <div className="flex gap-2">
                  <Button className="adult-button">
                    <Upload className="mr-2" size={16} />
                    Upload Media
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2" size={16} />
                    Bulk Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Sample media items - in real app, this would be dynamic */}
                <Card className="mystical-card border-blue-500/30">
                  <div className="aspect-video bg-blue-500/20 rounded-t-lg flex items-center justify-center">
                    <span className="text-4xl">🎥</span>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-white mb-2">Earth Meditation.mp4</h4>
                    <p className="text-xs text-white/60 mb-3">Video • 2.4 MB • Uploaded 2h ago</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye size={12} className="mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Download size={12} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mystical-card border-green-500/30">
                  <div className="aspect-video bg-green-500/20 rounded-t-lg flex items-center justify-center">
                    <span className="text-4xl">🎵</span>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-white mb-2">Crystal_Bowl.mp3</h4>
                    <p className="text-xs text-white/60 mb-3">Audio • 1.8 MB • Uploaded 1d ago</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Play className="mr-1" size={12} />
                        Play
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Download size={12} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mystical-card border-purple-500/30">
                  <div className="aspect-video bg-purple-500/20 rounded-t-lg flex items-center justify-center">
                    <span className="text-4xl">🖼️</span>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-white mb-2">Sacred_Circle.jpg</h4>
                    <p className="text-xs text-white/60 mb-3">Image • 854 KB • Uploaded 3d ago</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye size={12} className="mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Download size={12} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mystical-card border-amber-500/30">
                  <div className="aspect-video bg-amber-500/20 rounded-t-lg flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-white mb-2">Ritual_Guide.pdf</h4>
                    <p className="text-xs text-white/60 mb-3">Document • 1.2 MB • Uploaded 1w ago</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye size={12} className="mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Download size={12} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center py-8">
                <p className="text-white/60">
                  Media library management features will be fully implemented with upload, organization, and CDN integration.
                </p>
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
