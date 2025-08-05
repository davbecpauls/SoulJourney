import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/contexts/theme-context";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Lock } from "lucide-react";
import { Link } from "wouter";
import type { Realm, Module, Lesson } from "@shared/schema";

export default function RealmPage() {
  const { theme } = useTheme();
  const realmId = "realm-1"; // This would come from route params

  const { data: realm, isLoading: realmLoading } = useQuery<Realm>({
    queryKey: ['/api/realms', realmId],
  });

  const { data: modules, isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: ['/api/realms', realmId, 'modules'],
  });

  if (realmLoading || modulesLoading) {
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
        {/* Hero Section */}
        <div 
          className="relative h-96 bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${realm?.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <div className="mb-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-amber-200" data-testid="button-back-dashboard">
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div className="text-6xl mb-4">{realm?.icon}</div>
            <h1 className="font-cinzel text-5xl font-bold mb-4 text-amber-100">{realm?.title}</h1>
            <p className="text-xl text-white/80">{realm?.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Realm Progress */}
          <Card className="mystical-card border-amber-500/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-cinzel text-2xl font-bold text-white">
                  {theme === 'child' ? 'Realm Progress' : 'Sacred Progress'}
                </h2>
                <Badge variant="secondary" className="text-amber-300">
                  {theme === 'child' ? 'Level 2 Explorer' : 'Seeker'}
                </Badge>
              </div>
              <Progress value={45} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-white/60">
                <span>45% Complete</span>
                <span>{theme === 'child' ? '3 of 7 quests completed' : '3 of 7 modules completed'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Modules/Quest Chapters */}
          <div className="space-y-6">
            <h2 className="font-cinzel text-3xl font-bold text-amber-100 mb-6">
              {theme === 'child' ? 'Quest Chapters' : 'Sacred Modules'}
            </h2>
            
            <div className="grid gap-6">
              {modules?.map((module, index) => (
                <Card key={module.id} className="mystical-card border-white/20 hover:border-white/40 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-4 text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-cinzel text-xl font-bold text-white mb-1">{module.title}</h3>
                            <p className="text-white/70">{module.description}</p>
                          </div>
                        </div>
                        
                        {/* Module Progress */}
                        <div className="ml-14">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/60">
                              {theme === 'child' ? 'Quest Progress' : 'Module Progress'}
                            </span>
                            <span className="text-sm text-white/60">2 of 4 complete</span>
                          </div>
                          <Progress value={50} className="h-2 mb-4" />
                          
                          {/* Lesson/Adventure List */}
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                              <span className="text-white/80">
                                {theme === 'child' ? 'Adventure 1: Meet the Earth Dragon' : 'Lesson 1: Grounding Practices'}
                              </span>
                              <Badge variant="secondary" className="ml-auto text-xs">Complete</Badge>
                            </div>
                            <div className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                              <span className="text-white/80">
                                {theme === 'child' ? 'Adventure 2: Crystal Cave Quest' : 'Lesson 2: Crystal Wisdom'}
                              </span>
                              <Badge variant="secondary" className="ml-auto text-xs">Complete</Badge>
                            </div>
                            <div className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                              <span className="text-white/80">
                                {theme === 'child' ? 'Adventure 3: Magic Garden Challenge' : 'Lesson 3: Plant Spirit Communication'}
                              </span>
                              <Badge variant="outline" className="ml-auto text-xs">In Progress</Badge>
                            </div>
                            <div className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                              <span className="text-white/60">
                                {theme === 'child' ? 'Adventure 4: Earth Master Trial' : 'Lesson 4: Integration & Practice'}
                              </span>
                              <Lock className="ml-auto text-gray-400" size={14} />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <Button 
                          className={theme === 'child' ? 'child-button' : 'adult-button'}
                          data-testid={`button-continue-module-${module.id}`}
                        >
                          <Play className="mr-2" size={16} />
                          {theme === 'child' ? 'Continue Quest' : 'Continue Module'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">📚</div>
                  <p className="text-white/60 text-lg">
                    {theme === 'child' 
                      ? 'No quest chapters available yet. Check back soon for new adventures!'
                      : 'No modules available yet. Check back soon for new sacred teachings!'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
