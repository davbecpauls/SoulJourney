import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/theme-context";
import { 
  Sparkles, 
  Plus, 
  RotateCcw, 
  Save, 
  Share2, 
  Download,
  Palette,
  Move,
  Trash2,
  Zap
} from "lucide-react";

interface AltarElement {
  id: string;
  type: 'candle' | 'crystal' | 'flower' | 'incense' | 'statue' | 'water' | 'earth' | 'feather' | 'pentacle' | 'book';
  position: { x: number; y: number };
  color: string;
  size: 'small' | 'medium' | 'large';
  rotation: number;
  unlocked: boolean;
  description?: string;
}

interface VirtualAltarProps {
  userId: string;
  userElements?: AltarElement[];
  onSave: (elements: AltarElement[]) => void;
}

const ELEMENT_TEMPLATES = {
  candle: { 
    emoji: '🕯️', 
    colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    description: 'Sacred flame for illumination and intention'
  },
  crystal: { 
    emoji: '💎', 
    colors: ['#9B59B6', '#3498DB', '#E74C3C', '#F39C12', '#27AE60', '#ECF0F1'],
    description: 'Earth energy and healing vibrations'
  },
  flower: { 
    emoji: '🌸', 
    colors: ['#FF69B4', '#FFB6C1', '#DDA0DD', '#98FB98', '#F0E68C', '#FFA07A'],
    description: 'Beauty, growth, and natural connection'
  },
  incense: { 
    emoji: '🔥', 
    colors: ['#8B4513', '#DAA520', '#CD853F', '#D2691E', '#B22222', '#708090'],
    description: 'Sacred smoke for purification and prayer'
  },
  statue: { 
    emoji: '🗿', 
    colors: ['#8B7765', '#A0522D', '#696969', '#2F4F4F', '#800080', '#DAA520'],
    description: 'Divine presence and spiritual protection'
  },
  water: { 
    emoji: '🌊', 
    colors: ['#4169E1', '#1E90FF', '#87CEEB', '#20B2AA', '#4682B4', '#5F9EA0'],
    description: 'Emotional flow and spiritual cleansing'
  },
  earth: { 
    emoji: '🌍', 
    colors: ['#8B4513', '#228B22', '#6B8E23', '#556B2F', '#8FBC8F', '#9ACD32'],
    description: 'Grounding energy and material abundance'
  },
  feather: { 
    emoji: '🪶', 
    colors: ['#F5F5DC', '#D2B48C', '#8B4513', '#A0522D', '#2F4F4F', '#696969'],
    description: 'Air element and spiritual messages'
  },
  pentacle: { 
    emoji: '⭐', 
    colors: ['#FFD700', '#C0C0C0', '#CD7F32', '#FF6347', '#9370DB', '#20B2AA'],
    description: 'Sacred geometry and elemental balance'
  },
  book: { 
    emoji: '📖', 
    colors: ['#8B4513', '#2F4F4F', '#800080', '#B22222', '#228B22', '#DAA520'],
    description: 'Wisdom, knowledge, and sacred texts'
  }
};

export function VirtualAltar({ userId, userElements = [], onSave }: VirtualAltarProps) {
  const { theme } = useTheme();
  const [altarElements, setAltarElements] = useState<AltarElement[]>(userElements);
  const [selectedElement, setSelectedElement] = useState<AltarElement | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newElementType, setNewElementType] = useState<keyof typeof ELEMENT_TEMPLATES>('candle');
  const [newElementColor, setNewElementColor] = useState('#FFD700');
  const [newElementSize, setNewElementSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isEditing, setIsEditing] = useState(false);
  const [altarBackground, setAltarBackground] = useState('earth');

  // Available elements based on user progress/unlocks
  const availableElements = Object.keys(ELEMENT_TEMPLATES).filter(type => 
    // For demo, all elements are available. In real app, check user unlocks
    true
  );

  const handleAddElement = () => {
    const newElement: AltarElement = {
      id: Date.now().toString(),
      type: newElementType,
      position: { x: 50, y: 50 }, // Center position (percentage)
      color: newElementColor,
      size: newElementSize,
      rotation: 0,
      unlocked: true,
      description: ELEMENT_TEMPLATES[newElementType].description
    };

    setAltarElements(prev => [...prev, newElement]);
    setShowAddDialog(false);
  };

  const handleElementClick = (element: AltarElement) => {
    if (isEditing) {
      setSelectedElement(element);
    }
  };

  const handleElementMove = (elementId: string, newPosition: { x: number; y: number }) => {
    setAltarElements(prev => 
      prev.map(el => 
        el.id === elementId ? { ...el, position: newPosition } : el
      )
    );
  };

  const handleElementUpdate = (elementId: string, updates: Partial<AltarElement>) => {
    setAltarElements(prev => 
      prev.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    );
    setSelectedElement(null);
  };

  const handleElementDelete = (elementId: string) => {
    setAltarElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedElement(null);
  };

  const handleSave = () => {
    onSave(altarElements);
    setIsEditing(false);
  };

  const getElementSize = (size: string) => {
    switch (size) {
      case 'small': return 'text-2xl';
      case 'large': return 'text-6xl';
      default: return 'text-4xl';
    }
  };

  const getBackgroundClass = (background: string) => {
    switch (background) {
      case 'earth': return 'bg-gradient-to-br from-amber-900/30 to-green-900/30';
      case 'water': return 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30';
      case 'fire': return 'bg-gradient-to-br from-red-900/30 to-orange-900/30';
      case 'air': return 'bg-gradient-to-br from-gray-900/30 to-blue-900/30';
      case 'spirit': return 'bg-gradient-to-br from-purple-900/30 to-pink-900/30';
      default: return 'bg-gradient-to-br from-amber-900/30 to-green-900/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Altar Header */}
      <Card className="mystical-card border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-cinzel text-purple-300 flex items-center gap-2">
              <Sparkles size={20} />
              {theme === 'child' ? 'Magical Sacred Space' : 'Virtual Altar'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Move size={16} className="mr-2" />
                {isEditing ? 'Done Editing' : 'Edit Altar'}
              </Button>
              {isEditing && (
                <Button size="sm" onClick={handleSave} className="mystical-button">
                  <Save size={16} className="mr-2" />
                  Save
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <Label>Altar Theme</Label>
              <Select value={altarBackground} onValueChange={setAltarBackground}>
                <SelectTrigger className="w-32 mystical-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="earth">🌍 Earth</SelectItem>
                  <SelectItem value="water">🌊 Water</SelectItem>
                  <SelectItem value="fire">🔥 Fire</SelectItem>
                  <SelectItem value="air">💨 Air</SelectItem>
                  <SelectItem value="spirit">✨ Spirit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {altarElements.length} elements placed
              </Badge>
              <Badge variant="outline">
                {availableElements.length} available
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Altar Space */}
      <Card className="mystical-card border-white/20">
        <CardContent className="p-0">
          <div 
            className={`relative w-full h-96 rounded-lg ${getBackgroundClass(altarBackground)} border-2 border-white/10 overflow-hidden`}
            style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          >
            {/* Altar Elements */}
            {altarElements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 ${
                  selectedElement?.id === element.id ? 'ring-2 ring-purple-400 ring-opacity-50' : ''
                }`}
                style={{
                  left: `${element.position.x}%`,
                  top: `${element.position.y}%`,
                  transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
                  color: element.color,
                  filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))'
                }}
                onClick={() => handleElementClick(element)}
                draggable={isEditing}
                onDragEnd={(e) => {
                  if (!isEditing) return;
                  const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  handleElementMove(element.id, { 
                    x: Math.max(0, Math.min(100, x)), 
                    y: Math.max(0, Math.min(100, y)) 
                  });
                }}
              >
                <div className={`${getElementSize(element.size)} select-none`}>
                  {ELEMENT_TEMPLATES[element.type].emoji}
                </div>
              </div>
            ))}

            {/* Add Element Button */}
            {isEditing && (
              <div className="absolute bottom-4 right-4">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="mystical-button">
                      <Plus size={16} className="mr-2" />
                      Add Element
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="mystical-card border-purple-500/30">
                    <DialogHeader>
                      <DialogTitle className="font-cinzel text-purple-300">
                        Add Sacred Element
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Element Type</Label>
                        <Select value={newElementType} onValueChange={(value: keyof typeof ELEMENT_TEMPLATES) => setNewElementType(value)}>
                          <SelectTrigger className="mystical-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableElements.map(type => (
                              <SelectItem key={type} value={type}>
                                {ELEMENT_TEMPLATES[type as keyof typeof ELEMENT_TEMPLATES].emoji} {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Color</Label>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {ELEMENT_TEMPLATES[newElementType].colors.map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border-2 ${
                                newElementColor === color ? 'border-white' : 'border-white/30'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setNewElementColor(color)}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Size</Label>
                        <Select value={newElementSize} onValueChange={(value: 'small' | 'medium' | 'large') => setNewElementSize(value)}>
                          <SelectTrigger className="mystical-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="p-3 glass-morphism rounded-lg">
                        <p className="text-sm text-white/70">
                          {ELEMENT_TEMPLATES[newElementType].description}
                        </p>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddElement} className="mystical-button">
                          <Plus size={16} className="mr-2" />
                          Add Element
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Empty State */}
            {altarElements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    {theme === 'child' 
                      ? 'Your magical space awaits...' 
                      : 'Your sacred altar awaits...'
                    }
                  </p>
                  <p className="text-sm mt-2">
                    {isEditing 
                      ? 'Click "Add Element" to begin creating your sacred space'
                      : 'Click "Edit Altar" to start building your sacred space'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Element Properties Panel */}
      {selectedElement && isEditing && (
        <Card className="mystical-card border-amber-500/30">
          <CardHeader>
            <CardTitle className="font-cinzel text-amber-300 flex items-center gap-2">
              <Palette size={20} />
              Edit Element: {ELEMENT_TEMPLATES[selectedElement.type].emoji} {selectedElement.type}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Color</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {ELEMENT_TEMPLATES[selectedElement.type].colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedElement.color === color ? 'border-white' : 'border-white/30'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleElementUpdate(selectedElement.id, { color })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Size</Label>
                <Select 
                  value={selectedElement.size} 
                  onValueChange={(value: 'small' | 'medium' | 'large') => 
                    handleElementUpdate(selectedElement.id, { size: value })
                  }
                >
                  <SelectTrigger className="mystical-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Rotation</Label>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={selectedElement.rotation}
                onChange={(e) => 
                  handleElementUpdate(selectedElement.id, { rotation: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="text-xs text-white/60 mt-1">{selectedElement.rotation}°</div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedElement(null)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleElementDelete(selectedElement.id)}
              >
                <Trash2 size={16} className="mr-2" />
                Remove Element
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Altar Actions */}
      <Card className="mystical-card border-indigo-500/30">
        <CardContent className="p-4">
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm">
              <Share2 size={16} className="mr-2" />
              Share Altar
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export Image
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw size={16} className="mr-2" />
              Reset Altar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Altar Blessings */}
      {altarElements.length >= 3 && (
        <Card className="mystical-card border-golden/30">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Zap size={32} className="mx-auto text-golden" />
            </div>
            <h3 className="font-cinzel text-xl text-golden mb-4">
              {theme === 'child' ? 'Your space is magically charged!' : 'Your altar is blessed!'}
            </h3>
            <p className="text-white/70">
              {theme === 'child' 
                ? 'With 3 or more magical elements, your space radiates powerful energy for learning and growth.'
                : 'Your sacred space is complete and ready for spiritual practice and meditation.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}