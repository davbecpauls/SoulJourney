import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Upload, 
  Save, 
  Eye, 
  Edit3, 
  Image, 
  Video, 
  Music, 
  FileText,
  Trash2,
  GripVertical,
  Wand2,
  ScrollText,
  Diamond
} from "lucide-react";
import type { Lesson, Realm, Module } from "@shared/schema";

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'quiz' | 'journal' | 'choice' | 'ritual';
  content: any;
  order: number;
}

interface LessonFormData {
  title: string;
  description: string;
  moduleId: string;
  lessonType: 'linear' | 'choice' | 'quest' | 'ritual';
  duration: number;
  contentBlocks: ContentBlock[];
  choices: any[];
  downloadableResources: any[];
  gamificationData: any;
}

interface ContentCreatorProps {
  realms: Realm[];
  modules: Module[];
  onSave: (lessonData: LessonFormData) => void;
  editingLesson?: Lesson;
}

export function ContentCreator({ realms, modules, onSave, editingLesson }: ContentCreatorProps) {
  const [formData, setFormData] = useState<LessonFormData>({
    title: editingLesson?.title || "",
    description: editingLesson?.description || "",
    moduleId: editingLesson?.moduleId || "",
    lessonType: (editingLesson?.lessonType as any) || "linear",
    duration: editingLesson?.duration || 30,
    contentBlocks: [],
    choices: [],
    downloadableResources: [],
    gamificationData: {
      xpReward: 100,
      badges: [],
      unlockables: []
    }
  });

  const [selectedRealm, setSelectedRealm] = useState<string>("");
  const [previewMode, setPreviewMode] = useState(false);

  const addContentBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContentForType(type),
      order: formData.contentBlocks.length
    };
    
    setFormData(prev => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, newBlock]
    }));
  };

  const getDefaultContentForType = (type: ContentBlock['type']) => {
    switch (type) {
      case 'text':
        return { text: '', formatting: 'paragraph' };
      case 'image':
        return { url: '', altText: '', caption: '' };
      case 'video':
        return { url: '', poster: '', captions: '' };
      case 'audio':
        return { url: '', transcript: '', isNarration: false };
      case 'quiz':
        return { questions: [], passingScore: 70 };
      case 'journal':
        return { prompt: '', isRequired: false, wordLimit: 0 };
      case 'choice':
        return { question: '', options: [] };
      case 'ritual':
        return { title: '', instructions: [], materials: [], duration: 10 };
      default:
        return {};
    }
  };

  const updateContentBlock = (blockId: string, newContent: any) => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map(block =>
        block.id === blockId ? { ...block, content: newContent } : block
      )
    }));
  };

  const removeContentBlock = (blockId: string) => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter(block => block.id !== blockId)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const renderContentBlockEditor = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your lesson content..."
              value={block.content.text || ''}
              onChange={(e) => updateContentBlock(block.id, { ...block.content, text: e.target.value })}
              className="min-h-32"
            />
            <Select
              value={block.content.formatting || 'paragraph'}
              onValueChange={(value) => updateContentBlock(block.id, { ...block.content, formatting: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">Paragraph</SelectItem>
                <SelectItem value="heading">Heading</SelectItem>
                <SelectItem value="quote">Sacred Quote</SelectItem>
                <SelectItem value="ritual">Ritual Instructions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'choice':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Choice question or scenario..."
              value={block.content.question || ''}
              onChange={(e) => updateContentBlock(block.id, { ...block.content, question: e.target.value })}
            />
            <div className="space-y-2">
              <Label>Choice Options</Label>
              {(block.content.options || []).map((option: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text || ''}
                    onChange={(e) => {
                      const newOptions = [...(block.content.options || [])];
                      newOptions[index] = { ...newOptions[index], text: e.target.value };
                      updateContentBlock(block.id, { ...block.content, options: newOptions });
                    }}
                  />
                  <Input
                    placeholder="Next lesson ID"
                    value={option.nextLesson || ''}
                    onChange={(e) => {
                      const newOptions = [...(block.content.options || [])];
                      newOptions[index] = { ...newOptions[index], nextLesson: e.target.value };
                      updateContentBlock(block.id, { ...block.content, options: newOptions });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newOptions = (block.content.options || []).filter((_, i) => i !== index);
                      updateContentBlock(block.id, { ...block.content, options: newOptions });
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [...(block.content.options || []), { text: '', nextLesson: '' }];
                  updateContentBlock(block.id, { ...block.content, options: newOptions });
                }}
              >
                <Plus size={16} className="mr-2" />
                Add Choice
              </Button>
            </div>
          </div>
        );

      case 'journal':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Journaling prompt or reflection question..."
              value={block.content.prompt || ''}
              onChange={(e) => updateContentBlock(block.id, { ...block.content, prompt: e.target.value })}
            />
            <div className="flex items-center space-x-2">
              <Switch
                checked={block.content.isRequired || false}
                onCheckedChange={(checked) => updateContentBlock(block.id, { ...block.content, isRequired: checked })}
              />
              <Label>Required reflection</Label>
            </div>
          </div>
        );

      case 'ritual':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Ritual title"
              value={block.content.title || ''}
              onChange={(e) => updateContentBlock(block.id, { ...block.content, title: e.target.value })}
            />
            <Textarea
              placeholder="Ritual instructions (one per line)"
              value={(block.content.instructions || []).join('\n')}
              onChange={(e) => updateContentBlock(block.id, { 
                ...block.content, 
                instructions: e.target.value.split('\n').filter(line => line.trim()) 
              })}
            />
            <Input
              placeholder="Materials needed (comma separated)"
              value={(block.content.materials || []).join(', ')}
              onChange={(e) => updateContentBlock(block.id, { 
                ...block.content, 
                materials: e.target.value.split(',').map(item => item.trim()).filter(item => item) 
              })}
            />
          </div>
        );

      default:
        return (
          <div className="text-center text-muted-foreground py-8">
            {block.type} editor coming soon...
          </div>
        );
    }
  };

  const getContentBlockIcon = (type: ContentBlock['type']) => {
    switch (type) {
      case 'text': return <FileText size={16} />;
      case 'image': return <Image size={16} />;
      case 'video': return <Video size={16} />;
      case 'audio': return <Music size={16} />;
      case 'quiz': return <Diamond size={16} />;
      case 'journal': return <ScrollText size={16} />;
      case 'choice': return <Wand2 size={16} />;
      case 'ritual': return <div className="text-xs">🕯️</div>;
      default: return <Plus size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card className="mystical-card border-amber-500/30">
        <CardHeader>
          <CardTitle className="font-cinzel text-amber-300 flex items-center gap-2">
            <Edit3 size={20} />
            {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Lesson Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter lesson title..."
                className="mystical-input"
              />
            </div>
            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                className="mystical-input"
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what students will learn..."
              className="mystical-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Realm</Label>
              <Select value={selectedRealm} onValueChange={setSelectedRealm}>
                <SelectTrigger className="mystical-input">
                  <SelectValue placeholder="Select realm" />
                </SelectTrigger>
                <SelectContent>
                  {realms.map(realm => (
                    <SelectItem key={realm.id} value={realm.id}>
                      {realm.icon} {realm.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Module</Label>
              <Select value={formData.moduleId} onValueChange={(value) => setFormData(prev => ({ ...prev, moduleId: value }))}>
                <SelectTrigger className="mystical-input">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {modules
                    .filter(module => !selectedRealm || module.realmId === selectedRealm)
                    .map(module => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lesson Type</Label>
              <Select value={formData.lessonType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, lessonType: value }))}>
                <SelectTrigger className="mystical-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear Lesson</SelectItem>
                  <SelectItem value="choice">Choice-Based</SelectItem>
                  <SelectItem value="quest">Interactive Quest</SelectItem>
                  <SelectItem value="ritual">Sacred Ritual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Builder */}
      <Card className="mystical-card border-purple-500/30">
        <CardHeader>
          <CardTitle className="font-cinzel text-purple-300 flex items-center justify-between">
            Content Builder
            <div className="flex items-center gap-2">
              <Button
                variant={previewMode ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye size={16} className="mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {previewMode ? (
            <div className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                Lesson preview will be rendered here...
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Content Block Tools */}
              <div className="flex flex-wrap gap-2 p-4 glass-morphism rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addContentBlock('text')}
                  className="border-amber-500/30"
                >
                  <FileText size={16} className="mr-2" />
                  Text
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addContentBlock('image')}
                  className="border-blue-500/30"
                >
                  <Image size={16} className="mr-2" />
                  Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addContentBlock('video')}
                  className="border-red-500/30"
                >
                  <Video size={16} className="mr-2" />
                  Video
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addContentBlock('audio')}
                  className="border-green-500/30"
                >
                  <Music size={16} className="mr-2" />
                  Audio
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addContentBlock('journal')}
                  className="border-indigo-500/30"
                >
                  <ScrollText size={16} className="mr-2" />
                  Journal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addContentBlock('choice')}
                  className="border-purple-500/30"
                >
                  <Wand2 size={16} className="mr-2" />
                  Choice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addContentBlock('ritual')}
                  className="border-pink-500/30"
                >
                  🕯️ Ritual
                </Button>
              </div>

              {/* Content Blocks */}
              <div className="space-y-4">
                {formData.contentBlocks.map((block, index) => (
                  <Card key={block.id} className="glass-morphism border-white/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical size={16} className="text-muted-foreground cursor-move" />
                          {getContentBlockIcon(block.type)}
                          <Badge variant="secondary">{block.type}</Badge>
                          <span className="text-sm text-muted-foreground">Block {index + 1}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContentBlock(block.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderContentBlockEditor(block)}
                    </CardContent>
                  </Card>
                ))}

                {formData.contentBlocks.length === 0 && (
                  <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-muted rounded-lg">
                    <Edit3 size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Start building your lesson by adding content blocks above</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          Cancel
        </Button>
        <Button onClick={handleSave} className="mystical-button">
          <Save size={16} className="mr-2" />
          {editingLesson ? 'Update Lesson' : 'Create Lesson'}
        </Button>
      </div>
    </div>
  );
}