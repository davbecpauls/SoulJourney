import { useQuery, useMutation } from "@tanstack/react-query";
import { useTheme } from "@/contexts/theme-context";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, CheckCircle, PlayCircle, Headphones, Download, BookOpen, Feather } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Lesson, UserProgress, JournalEntry } from "@shared/schema";

interface LessonContent {
  text?: string;
  story?: string;
  quest?: string;
  meditation?: string;
  journalPrompts?: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  rewards?: string[];
}

export default function LessonPage() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const lessonId = "lesson-1"; // This would come from route params
  const userId = "user-1"; // Mock user ID
  const [journalContent, setJournalContent] = useState("");
  const [notes, setNotes] = useState("");

  const { data: lesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: ['/api/lessons', lessonId],
  });

  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: ['/api/users', userId, 'progress', lessonId],
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data: { progress: number; completed: boolean; notes?: string }) => {
      if (userProgress) {
        return apiRequest('PUT', `/api/progress/${userProgress.id}`, data);
      } else {
        return apiRequest('POST', '/api/progress', {
          userId,
          lessonId,
          ...data
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'progress'] });
      toast({
        title: theme === 'child' ? "Quest Progress Saved!" : "Progress Saved!",
        description: theme === 'child' 
          ? "Your magical journey continues..." 
          : "Your sacred progress has been recorded.",
      });
    },
  });

  const createJournalMutation = useMutation({
    mutationFn: async (data: { content: string; title?: string; prompt?: string }) => {
      return apiRequest('POST', '/api/journal', {
        userId,
        lessonId,
        ...data
      });
    },
    onSuccess: () => {
      setJournalContent("");
      toast({
        title: theme === 'child' ? "Adventure Log Updated!" : "Journal Entry Saved!",
        description: theme === 'child' 
          ? "Your magical discoveries have been recorded in your spell book." 
          : "Your reflections have been saved to your sacred journal.",
      });
    },
  });

  const handleCompleteLesson = () => {
    updateProgressMutation.mutate({
      progress: 100,
      completed: true,
      notes: notes
    });
  };

  const handleSaveProgress = () => {
    updateProgressMutation.mutate({
      progress: Math.min((userProgress?.progress || 0) + 25, 100),
      completed: false,
      notes: notes
    });
  };

  const handleSaveJournal = () => {
    if (!journalContent.trim()) return;
    
    createJournalMutation.mutate({
      content: journalContent,
      title: theme === 'child' ? "Adventure Reflection" : "Sacred Reflection",
      prompt: theme === 'child' 
        ? "What magical discoveries did you make today?" 
        : "What insights emerged from this lesson?"
    });
  };

  if (lessonLoading) {
    return (
      <div className="min-h-screen mystical-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen mystical-background flex items-center justify-center">
        <Card className="mystical-card border-red-500/30 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="font-cinzel text-2xl font-bold text-red-300 mb-4">
              {theme === 'child' ? 'Adventure Not Found' : 'Lesson Not Found'}
            </h1>
            <p className="text-white/70 mb-6">
              {theme === 'child' 
                ? 'This magical adventure seems to have vanished into the mist.'
                : 'This sacred lesson could not be found.'}
            </p>
            <Link href="/dashboard">
              <Button className={theme === 'child' ? 'child-button' : 'adult-button'}>
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentContent = (theme === 'child' ? lesson.childContent : lesson.adultContent) as LessonContent || {};
  const progress = userProgress?.progress || 0;
  const isCompleted = userProgress?.completed || false;

  return (
    <div className="min-h-screen mystical-background text-white relative">
      <div className="cosmic-particles"></div>
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-amber-200" data-testid="button-back-dashboard">
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Dashboard
                </Button>
              </Link>
              <Badge variant={isCompleted ? "default" : "secondary"} className="px-4 py-2">
                {isCompleted ? 'Completed' : 'In Progress'}
              </Badge>
            </div>
            
            <h1 className="font-cinzel text-4xl font-bold mb-2 text-golden">{lesson.title}</h1>
            <p className="text-white/70 text-lg mb-4">{lesson.description}</p>
            
            {/* Progress Bar */}
            <div className="glass-morphism rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">
                  {theme === 'child' ? 'Adventure Progress' : 'Lesson Progress'}
                </span>
                <span className="text-sm text-white/70">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              {lesson.duration && (
                <div className="text-xs text-white/50 mt-1">
                  Estimated time: {lesson.duration} minutes
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Lesson Content */}
              <Card className="mystical-card border-white/20">
                <CardContent className="p-8">
                  <Tabs defaultValue="content" className="space-y-6">
                    <TabsList className="glass-morphism">
                      <TabsTrigger value="content" data-testid="tab-content">
                        <BookOpen className="mr-2" size={16} />
                        {theme === 'child' ? 'Adventure Story' : 'Lesson Content'}
                      </TabsTrigger>
                      {currentContent?.meditation && (
                        <TabsTrigger value="audio" data-testid="tab-audio">
                          <Headphones className="mr-2" size={16} />
                          {theme === 'child' ? 'Magical Sounds' : 'Audio Guide'}
                        </TabsTrigger>
                      )}
                      <TabsTrigger value="resources" data-testid="tab-resources">
                        <Download className="mr-2" size={16} />
                        Resources
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-6">
                      {theme === 'child' && currentContent?.story && (
                        <div className="glass-morphism rounded-xl p-6">
                          <h3 className="font-cinzel text-xl font-bold text-pink-300 mb-4">
                            ✨ Magical Story
                          </h3>
                          <p className="text-white/80 leading-relaxed">{currentContent.story}</p>
                        </div>
                      )}

                      {lesson.content ? (
                        <div className="prose prose-invert max-w-none">
                          <div className="text-white/80 leading-relaxed">
                            {typeof lesson.content === 'object' && (lesson.content as any)?.text ? (
                              <p>{(lesson.content as any).text}</p>
                            ) : (
                              <p>{String(lesson.content)}</p>
                            )}
                          </div>
                        </div>
                      ) : null}

                      {theme === 'child' && currentContent?.quest && (
                        <div className="glass-morphism rounded-xl p-6 border border-yellow-500/30">
                          <h3 className="font-cinzel text-xl font-bold text-yellow-300 mb-4">
                            🗡️ Your Quest
                          </h3>
                          <p className="text-white/80 mb-4">{currentContent.quest}</p>
                          {currentContent.rewards && (
                            <div>
                              <h4 className="font-semibold text-white mb-2">Quest Rewards:</h4>
                              <div className="flex flex-wrap gap-2">
                                {currentContent.rewards?.map((reward: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                                    {reward}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {theme === 'adult' && currentContent?.journalPrompts && (
                        <div className="glass-morphism rounded-xl p-6 border border-amber-500/30">
                          <h3 className="font-cinzel text-xl font-bold text-amber-300 mb-4">
                            🕉️ Reflection Prompts
                          </h3>
                          <ul className="space-y-2">
                            {currentContent.journalPrompts?.map((prompt: string, index: number) => (
                              <li key={index} className="text-white/80 flex items-start">
                                <span className="text-amber-400 mr-2">•</span>
                                {prompt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </TabsContent>

                    {currentContent?.meditation && (
                      <TabsContent value="audio" className="space-y-6">
                        <div className="glass-morphism rounded-xl p-6 text-center">
                          <div className="text-6xl mb-4">🎧</div>
                          <h3 className="font-cinzel text-xl font-bold text-white mb-4">
                            {theme === 'child' ? 'Magical Audio Experience' : 'Guided Meditation'}
                          </h3>
                          <p className="text-white/70 mb-6">{currentContent.meditation}</p>
                          <Button 
                            className={theme === 'child' ? 'child-button' : 'adult-button'}
                            data-testid="button-play-audio"
                          >
                            <PlayCircle className="mr-2" size={20} />
                            {theme === 'child' ? 'Start Magical Journey' : 'Begin Meditation'}
                          </Button>
                        </div>
                      </TabsContent>
                    )}

                    <TabsContent value="resources" className="space-y-6">
                      <div className="space-y-4">
                        {currentContent?.resources ? (
                          currentContent.resources?.map((resource: any, index: number) => (
                            <div key={index} className="glass-morphism rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <Download className="mr-3 text-green-400" size={20} />
                                <span className="text-white">{resource}</span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`button-download-resource-${index}`}
                              >
                                Download
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Download className="mx-auto mb-4 text-white/40" size={48} />
                            <p className="text-white/60">
                              {theme === 'child' 
                                ? 'No magical treasures available for this adventure.'
                                : 'No downloadable resources available for this lesson.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleSaveProgress}
                  disabled={updateProgressMutation.isPending}
                  className={`${theme === 'child' ? 'child-button' : 'adult-button'} flex-1`}
                  data-testid="button-save-progress"
                >
                  {updateProgressMutation.isPending ? 'Saving...' : (theme === 'child' ? 'Save Quest Progress' : 'Save Progress')}
                </Button>
                
                {!isCompleted && (
                  <Button 
                    onClick={handleCompleteLesson}
                    disabled={updateProgressMutation.isPending}
                    className={`${theme === 'child' ? 'child-button' : 'adult-button'} flex-1`}
                    data-testid="button-complete-lesson"
                  >
                    <CheckCircle className="mr-2" size={20} />
                    {theme === 'child' ? 'Complete Adventure' : 'Complete Lesson'}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 flex-1"
                  data-testid="button-next-lesson"
                >
                  <ArrowRight className="mr-2" size={20} />
                  {theme === 'child' ? 'Next Adventure' : 'Next Lesson'}
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notes */}
              <Card className="mystical-card border-white/20">
                <CardHeader>
                  <CardTitle className="font-cinzel text-white flex items-center">
                    <Feather className="mr-2" size={20} />
                    {theme === 'child' ? 'Adventure Notes' : 'Lesson Notes'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={theme === 'child' 
                      ? "Write about your magical discoveries..." 
                      : "Record your insights and reflections..."}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px] bg-black/20 border-white/20 text-white placeholder:text-white/40"
                    data-testid="textarea-notes"
                  />
                </CardContent>
              </Card>

              {/* Journal Entry */}
              <Card className="mystical-card border-white/20">
                <CardHeader>
                  <CardTitle className="font-cinzel text-white">
                    {theme === 'child' ? 'Adventure Log Entry' : 'Journal Reflection'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder={theme === 'child' 
                      ? "What magical things did you learn today? How do you feel about your quest?" 
                      : "What insights emerged from this lesson? How does this knowledge serve your journey?"}
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    className="min-h-[120px] bg-black/20 border-white/20 text-white placeholder:text-white/40"
                    data-testid="textarea-journal"
                  />
                  <Button 
                    onClick={handleSaveJournal}
                    disabled={!journalContent.trim() || createJournalMutation.isPending}
                    className={theme === 'child' ? 'child-button w-full' : 'adult-button w-full'}
                    data-testid="button-save-journal"
                  >
                    {createJournalMutation.isPending ? 'Saving...' : (theme === 'child' ? 'Save to Spell Book' : 'Save to Journal')}
                  </Button>
                </CardContent>
              </Card>

              {/* Lesson Info */}
              <Card className="mystical-card border-white/20">
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Status:</span>
                      <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                        {isCompleted ? 'Complete' : 'In Progress'}
                      </Badge>
                    </div>
                    {lesson.duration && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Duration:</span>
                        <span className="text-white">{lesson.duration} min</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-white/60">Progress:</span>
                      <span className="text-white">{progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
