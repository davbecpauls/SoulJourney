import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WandSparkles, Clover, Gem, ScrollText, Medal, Users, BookOpen, Feather, Download, HandHeart } from "lucide-react";

export function LearningPaths() {
  const { theme } = useTheme();

  const childFeatures = [
    { icon: Gem, text: "Elemental Challenges & Magical Rewards" },
    { icon: ScrollText, text: "Interactive Storytelling Adventures" },
    { icon: Medal, text: "Achievement System & Unlockable Spells" },
    { icon: Users, text: "Character Companions & Guides" }
  ];

  const adultFeatures = [
    { icon: BookOpen, text: "Interactive Sacred Texts & Wisdom" },
    { icon: Feather, text: "Soul Journaling & Reflection Tools" },
    { icon: Download, text: "Guided Meditations & Resources" },
    { icon: HandHeart, text: "Virtual Altar Building & Rituals" }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold mb-6 text-amber-100">
            Choose Your Path of Remembrance
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {theme === 'child' 
              ? "Two magical journeys await - one filled with quests for brave young souls, another offering ancient wisdom for growing minds"
              : "Two sacred journeys await - one filled with magical quests for young souls, another offering deep spiritual wisdom for mature seekers"
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Children's Path */}
          <Card className="group relative mystical-card border-pink-500/30 hover:border-pink-400/50">
            <div 
              className="absolute inset-0 bg-cover bg-center rounded-3xl opacity-20" 
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
              }}
            />
            
            <CardContent className="relative p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6 animate-glow">
                  <WandSparkles className="text-white" size={32} />
                </div>
                <h3 className="font-cinzel text-3xl font-bold text-pink-200 mb-4">
                  Mystical Quests for Young Souls
                </h3>
                <p className="text-white/70 text-lg">
                  Embark on magical adventures through enchanted realms, collecting spells and unlocking ancient wisdom
                </p>
              </div>

              {/* Quest Features */}
              <div className="space-y-4 mb-8">
                {childFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon className="text-pink-400" size={20} />
                    <span className="text-white/80">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Progress Example */}
              <div className="glass-morphism rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Quest Progress</span>
                  <span className="text-sm text-pink-300">Level 3 Wizard</span>
                </div>
                <Progress value={65} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-white/60">
                  <span>65% Complete</span>
                  <span>🌟 Next: Fire Element Mastery</span>
                </div>
              </div>

              <Button 
                className="w-full child-button"
                data-testid="button-start-mystical-journey"
              >
                Start Mystical Journey
              </Button>
            </CardContent>
          </Card>

          {/* Adult Path */}
          <Card className="group relative mystical-card border-amber-500/30 hover:border-amber-400/50">
            <div 
              className="absolute inset-0 bg-cover bg-center rounded-3xl opacity-20" 
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
              }}
            />
            
            <CardContent className="relative p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-700 to-amber-600 rounded-full mb-6 animate-glow">
                  <Clover className="text-white" size={32} />
                </div>
                <h3 className="font-cinzel text-3xl font-bold text-amber-200 mb-4">
                  Sacred Journey of Remembrance
                </h3>
                <p className="text-white/70 text-lg">
                  Rediscover your soul's truth through guided meditation, sacred wisdom, and transformative practices
                </p>
              </div>

              {/* Journey Features */}
              <div className="space-y-4 mb-8">
                {adultFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon className="text-amber-400" size={20} />
                    <span className="text-white/80">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Progress Example */}
              <div className="glass-morphism rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Sacred Progress</span>
                  <span className="text-sm text-amber-300">Seeker of Truth</span>
                </div>
                <Progress value={40} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-white/60">
                  <span>40% Complete</span>
                  <span>🕉️ Next: Inner Wisdom Module</span>
                </div>
              </div>

              <Button 
                className="w-full adult-button"
                data-testid="button-begin-sacred-path"
              >
                Begin Sacred Path
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
