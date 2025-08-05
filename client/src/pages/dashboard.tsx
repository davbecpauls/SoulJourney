import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/contexts/theme-context";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Calendar,
  Star,
  Zap,
  Compass,
  ScrollText
} from "lucide-react";
import type { Realm, UserProgress, Achievement } from "@shared/schema";

export default function Dashboard() {
  const { theme } = useTheme();

  const { data: realms, isLoading: realmsLoading } = useQuery<Realm[]>({
    queryKey: ['/api/realms'],
  });

  const { data: progress, isLoading: progressLoading } = useQuery<UserProgress[]>({
    queryKey: ['/api/users/user-1/progress'], // Mock user ID
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/users/user-1/achievements'], // Mock user ID
  });

  if (realmsLoading || progressLoading || achievementsLoading) {
    return (
      <div className="min-h-screen mystical-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const totalLessons = progress?.length || 0;
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen mystical-background text-white">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-cinzel text-4xl font-bold mb-4 text-amber-100">
              {theme === 'child' ? 'Your Magical Journey' : 'Your Sacred Journey'}
            </h1>
            <p className="text-white/70 text-lg">
              {theme === 'child' 
                ? 'Welcome back, brave adventurer! Continue your magical quest through the mystical realms.'
                : 'Welcome back, seeker. Continue your journey of remembrance and spiritual growth.'
              }
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="mystical-card border-amber-500/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-amber-300 mb-2">{Math.round(overallProgress)}%</div>
                <div className="text-white/70 text-sm">
                  {theme === 'child' ? 'Quest Progress' : 'Journey Progress'}
                </div>
                <Progress value={overallProgress} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="mystical-card border-purple-500/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">{completedLessons}</div>
                <div className="text-white/70 text-sm">
                  {theme === 'child' ? 'Adventures Completed' : 'Lessons Completed'}
                </div>
              </CardContent>
            </Card>

            <Card className="mystical-card border-pink-500/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-pink-300 mb-2">{achievements?.length || 0}</div>
                <div className="text-white/70 text-sm">
                  {theme === 'child' ? 'Spells Learned' : 'Achievements Earned'}
                </div>
              </CardContent>
            </Card>

            <Card className="mystical-card border-green-500/30">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-300 mb-2">{realms?.length || 0}</div>
                <div className="text-white/70 text-sm">
                  {theme === 'child' ? 'Realms Discovered' : 'Realms Available'}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="realms" className="space-y-6">
            <TabsList className="glass-morphism">
              <TabsTrigger value="realms" data-testid="tab-realms">
                <Compass className="mr-2" size={16} />
                {theme === 'child' ? 'Magic Realms' : 'Sacred Realms'}
              </TabsTrigger>
              <TabsTrigger value="progress" data-testid="tab-progress">
                <TrendingUp className="mr-2" size={16} />
                Progress
              </TabsTrigger>
              <TabsTrigger value="achievements" data-testid="tab-achievements">
                <Award className="mr-2" size={16} />
                {theme === 'child' ? 'Spells & Badges' : 'Achievements'}
              </TabsTrigger>
              <TabsTrigger value="journal" data-testid="tab-journal">
                <ScrollText className="mr-2" size={16} />
                {theme === 'child' ? 'Adventure Log' : 'Sacred Journal'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="realms" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realms?.map((realm) => (
                  <Card key={realm.id} className="mystical-card border-white/20 hover:border-white/40 group cursor-pointer">
                    <div 
                      className="h-32 bg-cover bg-center rounded-t-3xl" 
                      style={{ backgroundImage: `url(${realm.backgroundImage})` }}
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-cinzel text-xl font-bold text-white">{realm.title}</h3>
                        <span className="text-2xl">{realm.icon}</span>
                      </div>
                      <p className="text-white/70 text-sm mb-4">{realm.description}</p>
                      <Button 
                        className={theme === 'child' ? 'child-button w-full' : 'adult-button w-full'}
                        data-testid={`button-enter-realm-${realm.id}`}
                      >
                        {theme === 'child' ? 'Enter Realm' : 'Explore Realm'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card className="mystical-card border-white/20">
                <CardHeader>
                  <CardTitle className="font-cinzel text-white">
                    {theme === 'child' ? 'Adventure Progress' : 'Learning Progress'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progress && progress.length > 0 ? (
                      progress.map((prog) => (
                        <div key={prog.id} className="glass-morphism rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">Lesson {prog.lessonId}</span>
                            <Badge variant={prog.completed ? "default" : "secondary"}>
                              {prog.completed ? 'Complete' : 'In Progress'}
                            </Badge>
                          </div>
                          <Progress value={prog.progress} className="h-2" />
                          <div className="text-xs text-white/60 mt-1">
                            {prog.progress}% complete
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="mx-auto mb-4 text-white/40" size={48} />
                        <p className="text-white/60">
                          {theme === 'child' 
                            ? 'No adventures started yet. Begin your first quest!'
                            : 'No lessons started yet. Begin your sacred journey!'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements && achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <Card key={achievement.id} className="mystical-card border-yellow-500/30">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4">{achievement.icon}</div>
                        <h3 className="font-cinzel text-lg font-bold text-yellow-300 mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-white/70 text-sm">{achievement.description}</p>
                        <Badge className="mt-3" variant="secondary">
                          {achievement.type}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Star className="mx-auto mb-4 text-white/40" size={48} />
                    <p className="text-white/60">
                      {theme === 'child' 
                        ? 'No spells learned yet. Complete adventures to earn magical rewards!'
                        : 'No achievements earned yet. Complete lessons to unlock sacred milestones!'
                      }
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="journal" className="space-y-6">
              <Card className="mystical-card border-white/20">
                <CardHeader>
                  <CardTitle className="font-cinzel text-white">
                    {theme === 'child' ? 'Adventure Log' : 'Sacred Journal'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ScrollText className="mx-auto mb-4 text-white/40" size={48} />
                    <p className="text-white/60 mb-4">
                      {theme === 'child' 
                        ? 'Your adventure log is empty. Start writing about your magical discoveries!'
                        : 'Your journal is empty. Start reflecting on your sacred journey!'
                      }
                    </p>
                    <Button 
                      className={theme === 'child' ? 'child-button' : 'adult-button'}
                      data-testid="button-create-journal-entry"
                    >
                      {theme === 'child' ? 'Start Adventure Log' : 'Create Journal Entry'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
