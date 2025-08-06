import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTheme } from "@/contexts/theme-context";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  BookOpen, 
  ScrollText, 
  Award, 
  Clock,
  Download,
  FileText,
  Wand2,
  Sparkles,
  Heart
} from "lucide-react";
import type { Lesson, UserProgress } from "@shared/schema";

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'quiz' | 'journal' | 'choice' | 'ritual';
  content: any;
  order: number;
}

interface InteractiveLessonViewerProps {
  lesson: Lesson;
  userProgress?: UserProgress;
  onProgress: (progress: number, data?: any) => void;
  onComplete: () => void;
  onChoiceMade: (choiceId: string, nextLessonId?: string) => void;
}

export function InteractiveLessonViewer({ 
  lesson, 
  userProgress, 
  onProgress, 
  onComplete, 
  onChoiceMade 
}: InteractiveLessonViewerProps) {
  const { theme } = useTheme();
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [completedBlocks, setCompletedBlocks] = useState<Set<number>>(new Set());
  const [journalEntries, setJournalEntries] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [currentJournalPrompt, setCurrentJournalPrompt] = useState("");
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  // Get content blocks from lesson (handle both old and new format)
  const contentBlocks: ContentBlock[] = lesson.content?.blocks || [];
  const lessonContent = theme === 'child' ? lesson.childContent : lesson.adultContent;
  const themedBlocks = lessonContent?.blocks || contentBlocks;

  const currentBlock = themedBlocks[currentBlockIndex];
  const progress = themedBlocks.length > 0 ? ((currentBlockIndex + 1) / themedBlocks.length) * 100 : 0;

  useEffect(() => {
    onProgress(progress, {
      currentBlock: currentBlockIndex,
      completedBlocks: Array.from(completedBlocks),
      journalEntries,
      timeSpent: Date.now() - (userProgress?.startedAt?.getTime() || Date.now())
    });
  }, [currentBlockIndex, completedBlocks, journalEntries]);

  const nextBlock = () => {
    if (currentBlockIndex < themedBlocks.length - 1) {
      setCompletedBlocks(prev => new Set([...prev, currentBlockIndex]));
      setCurrentBlockIndex(prev => prev + 1);
    } else {
      handleLessonComplete();
    }
  };

  const handleLessonComplete = () => {
    setCompletedBlocks(prev => new Set([...prev, currentBlockIndex]));
    
    // Award completion badges/XP based on lesson type and performance
    const newBadges = [];
    if (lesson.lessonType === 'quest') {
      newBadges.push(theme === 'child' ? '🏆 Quest Master' : '⭐ Journey Complete');
    }
    if (lesson.lessonType === 'ritual') {
      newBadges.push(theme === 'child' ? '🕯️ Ritual Keeper' : '🕯️ Sacred Practice');
    }
    
    setEarnedBadges(newBadges);
    onComplete();
  };

  const handleChoiceSelection = (choice: any) => {
    setCompletedBlocks(prev => new Set([...prev, currentBlockIndex]));
    
    if (choice.nextLesson) {
      onChoiceMade(choice.id, choice.nextLesson);
    } else {
      nextBlock();
    }
  };

  const handleJournalSubmit = (blockId: string, entry: string) => {
    setJournalEntries(prev => ({ ...prev, [blockId]: entry }));
    setShowJournalModal(false);
    nextBlock();
  };

  const openJournalModal = (prompt: string) => {
    setCurrentJournalPrompt(prompt);
    setShowJournalModal(true);
  };

  const renderContentBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <Card className="mystical-card border-white/20">
            <CardContent className="p-6">
              <div className="prose prose-lg max-w-none">
                {block.content.formatting === 'heading' ? (
                  <h2 className="font-cinzel text-2xl text-golden mb-4">{block.content.text}</h2>
                ) : block.content.formatting === 'quote' ? (
                  <blockquote className="border-l-4 border-golden pl-6 italic text-white/90 text-lg">
                    {block.content.text}
                  </blockquote>
                ) : (
                  <p className="text-white/90 leading-relaxed text-lg">{block.content.text}</p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={nextBlock}
                  className={theme === 'child' ? 'child-button' : 'adult-button'}
                >
                  {theme === 'child' ? 'Continue Adventure' : 'Continue Journey'}
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'choice':
        return (
          <Card className="mystical-card border-purple-500/30">
            <CardHeader>
              <CardTitle className="font-cinzel text-purple-300 flex items-center gap-2">
                <Wand2 size={20} />
                {theme === 'child' ? 'Choose Your Path' : 'Sacred Choice'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/90 text-lg mb-6">{block.content.question}</p>
              <div className="space-y-3">
                {block.content.options?.map((option: any, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full p-4 h-auto text-left justify-start glass-morphism border-white/20 hover:border-purple-400/50"
                    onClick={() => handleChoiceSelection(option)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-white">{option.text}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'journal':
        return (
          <Card className="mystical-card border-blue-500/30">
            <CardHeader>
              <CardTitle className="font-cinzel text-blue-300 flex items-center gap-2">
                <ScrollText size={20} />
                {theme === 'child' ? 'Adventure Log' : 'Sacred Reflection'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 text-lg mb-6">{block.content.prompt}</p>
              <div className="flex justify-center">
                <Button
                  onClick={() => openJournalModal(block.content.prompt)}
                  className={theme === 'child' ? 'child-button' : 'adult-button'}
                >
                  <ScrollText size={16} className="mr-2" />
                  {theme === 'child' ? 'Write in Adventure Log' : 'Open Sacred Journal'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'ritual':
        return (
          <Card className="mystical-card border-pink-500/30">
            <CardHeader>
              <CardTitle className="font-cinzel text-pink-300 flex items-center gap-2">
                🕯️ {block.content.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {block.content.materials?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-3">
                    {theme === 'child' ? 'Magic Materials Needed:' : 'Sacred Materials:'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {block.content.materials.map((material: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-pink-500/20 text-pink-200">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-white mb-3">
                  {theme === 'child' ? 'Magical Steps:' : 'Sacred Instructions:'}
                </h4>
                <div className="space-y-3">
                  {block.content.instructions?.map((instruction: string, index: number) => (
                    <div key={index} className="flex gap-3 p-3 glass-morphism rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-pink-500/30 flex items-center justify-center text-sm font-semibold text-pink-200">
                        {index + 1}
                      </div>
                      <span className="text-white/90">{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={nextBlock}
                  className={theme === 'child' ? 'child-button' : 'adult-button'}
                >
                  {theme === 'child' ? 'Complete Ritual ✨' : 'Practice Complete 🕯️'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'video':
        return (
          <Card className="mystical-card border-red-500/30">
            <CardContent className="p-6">
              <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Video size={48} className="mx-auto mb-4 text-white/50" />
                  <p className="text-white/60">Video player will be implemented</p>
                  <p className="text-sm text-white/40">{block.content.url}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={nextBlock}
                  className={theme === 'child' ? 'child-button' : 'adult-button'}
                >
                  Continue
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'audio':
        return (
          <Card className="mystical-card border-green-500/30">
            <CardContent className="p-6">
              <div className="bg-green-500/10 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-green-300">
                    {theme === 'child' ? '🎵 Magical Audio' : '🎶 Sacred Audio'}
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-green-300 hover:text-green-200"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-green-300 hover:text-green-200"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </Button>
                  </div>
                </div>
                <div className="w-full bg-green-500/20 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-0"></div>
                </div>
                <p className="text-xs text-green-200 mt-2">Audio implementation in progress</p>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={nextBlock}
                  className={theme === 'child' ? 'child-button' : 'adult-button'}
                >
                  Continue
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="mystical-card border-white/20">
            <CardContent className="p-6 text-center">
              <p className="text-white/60">Content type "{block.type}" coming soon...</p>
              <Button 
                onClick={nextBlock}
                className={`mt-4 ${theme === 'child' ? 'child-button' : 'adult-button'}`}
              >
                Skip for now
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  if (!currentBlock) {
    return (
      <div className="text-center py-12">
        <BookOpen size={48} className="mx-auto mb-4 text-white/40" />
        <p className="text-white/60">No content available for this lesson.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Lesson Header */}
      <Card className="mystical-card border-golden/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-cinzel text-2xl text-golden">{lesson.title}</CardTitle>
              <p className="text-white/70 mt-2">{lesson.description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Clock size={16} />
              {lesson.duration} min
              {lesson.lessonType && (
                <Badge variant="secondary" className="ml-2">
                  {lesson.lessonType}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">
                Block {currentBlockIndex + 1} of {themedBlocks.length}
              </span>
              <span className="text-white/70">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Content Block */}
      {renderContentBlock(currentBlock)}

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <Card className="mystical-card border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Sparkles size={32} className="mx-auto text-yellow-400" />
            </div>
            <h3 className="font-cinzel text-xl text-yellow-300 mb-4">
              {theme === 'child' ? 'New Spells Learned!' : 'Achievement Unlocked!'}
            </h3>
            <div className="flex justify-center gap-3">
              {earnedBadges.map((badge, index) => (
                <Badge key={index} className="bg-yellow-500/20 text-yellow-200 text-sm py-1 px-3">
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journal Modal */}
      <Dialog open={showJournalModal} onOpenChange={setShowJournalModal}>
        <DialogContent className="mystical-card border-blue-500/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-blue-300 flex items-center gap-2">
              <ScrollText size={20} />
              {theme === 'child' ? 'Adventure Log Entry' : 'Sacred Journal Entry'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-white/80">{currentJournalPrompt}</p>
            <Textarea
              placeholder={theme === 'child' 
                ? "Write about your magical discovery..." 
                : "Reflect on your sacred journey..."
              }
              className="min-h-32 mystical-input"
              value={journalEntries[currentBlock?.id] || ''}
              onChange={(e) => setJournalEntries(prev => ({ 
                ...prev, 
                [currentBlock?.id]: e.target.value 
              }))}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowJournalModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleJournalSubmit(currentBlock.id, journalEntries[currentBlock?.id] || '')}
                className={theme === 'child' ? 'child-button' : 'adult-button'}
              >
                <Heart size={16} className="mr-2" />
                {theme === 'child' ? 'Save Entry' : 'Sacred Commitment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Download Resources */}
      {lesson.downloadableResources && Object.keys(lesson.downloadableResources).length > 0 && (
        <Card className="mystical-card border-indigo-500/30">
          <CardHeader>
            <CardTitle className="font-cinzel text-indigo-300 flex items-center gap-2">
              <Download size={20} />
              {theme === 'child' ? 'Magical Resources' : 'Sacred Resources'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText size={16} className="mr-2" />
                Lesson PDF - Available after completion
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}