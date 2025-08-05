import { useTheme } from "@/contexts/theme-context";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Layers, ScrollText, Sprout, Mountain, Network, Gem } from "lucide-react";

export function AcademyStructure() {
  const { theme } = useTheme();

  const structureItems = [
    {
      icon: Globe,
      title: theme === 'child' ? 'Magical Realms' : 'Mystical Realms',
      description: theme === 'child' 
        ? 'Enchanted worlds filled with magical creatures - Earth, Water, Fire, Air, and Spirit realms each offering unique adventures'
        : 'Overarching domains of knowledge - Earth, Water, Fire, Air, and Spirit realms each offering unique wisdom paths',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: Layers,
      title: theme === 'child' ? 'Quest Chapters' : 'Sacred Modules',
      description: theme === 'child'
        ? 'Story-driven quest sequences within each realm - combining adventure, learning, and magical rewards'
        : 'Focused learning sequences within each realm - combining theory, practice, and experiential wisdom',
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      icon: ScrollText,
      title: theme === 'child' ? 'Adventure Lessons' : 'Living Lessons',
      description: theme === 'child'
        ? 'Individual adventures with interactive stories, mini-games, and magical discoveries'
        : 'Individual learning experiences with multimedia content, interactive elements, and personal reflection',
      gradient: 'from-amber-600 to-yellow-600'
    }
  ];

  return (
    <section className="py-20 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold mb-6 text-amber-100">
            Academy Structure
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {theme === 'child'
              ? 'Our magical curriculum is organized into enchanted realms, each containing exciting quest chapters and adventure-filled lessons'
              : 'Our curriculum is organized into mystical realms, each containing focused modules and immersive lessons'
            }
          </p>
        </div>

        {/* Structure Visualization */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {structureItems.map((item, index) => (
            <div key={index} className="text-center group">
              <div className="relative inline-block mb-6">
                <div className={`w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center mb-4 mx-auto animate-glow group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="text-white" size={32} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-purple-200 mb-4">{item.title}</h3>
              <p className="text-white/70">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Example Realm Structure */}
        <Card className="mystical-card border-emerald-500/30">
          <CardContent className="p-8">
            <h3 className="font-cinzel text-2xl font-bold text-center mb-8 text-amber-200">
              <Sprout className="inline mr-3 text-green-400" size={24} />
              Example: Earth Realm Structure
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Module 1 */}
              <div className="glass-morphism rounded-xl p-6 border border-green-500/20">
                <h4 className="font-semibold text-green-300 mb-4 flex items-center">
                  <Mountain className="mr-2" size={20} />
                  {theme === 'child' ? 'Earth Dragon Adventures' : 'Foundations of Earth'}
                </h4>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{theme === 'child' ? 'Meet Terra the Earth Dragon' : 'Lesson 1: Grounding Practices'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{theme === 'child' ? 'Crystal Cave Quest' : 'Lesson 2: Crystal Wisdom'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>{theme === 'child' ? 'Magic Garden Adventure' : 'Lesson 3: Plant Spirit Communication'}</span>
                  </div>
                </div>
              </div>

              {/* Module 2 */}
              <div className="glass-morphism rounded-xl p-6 border border-amber-500/20">
                <h4 className="font-semibold text-amber-300 mb-4 flex items-center">
                  <Network className="mr-2" size={20} />
                  {theme === 'child' ? 'Forest Spirit Quests' : 'Sacred Herbalism'}
                </h4>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span>{theme === 'child' ? 'Wise Network Council' : 'Lesson 1: Medicine Garden'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{theme === 'child' ? 'Healing Potion Making' : 'Lesson 2: Herbal Preparations'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{theme === 'child' ? 'Forest Ceremony Dance' : 'Lesson 3: Healing Ceremonies'}</span>
                  </div>
                </div>
              </div>

              {/* Module 3 */}
              <div className="glass-morphism rounded-xl p-6 border border-stone-500/20">
                <h4 className="font-semibold text-stone-300 mb-4 flex items-center">
                  <Gem className="mr-2" size={20} />
                  {theme === 'child' ? 'Earth Master Trials' : 'Earth Mastery'}
                </h4>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{theme === 'child' ? 'Seasonal Magic Rituals' : 'Lesson 1: Seasonal Rituals'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{theme === 'child' ? 'Build Your Sacred Grove' : 'Lesson 2: Earth Altar Creation'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{theme === 'child' ? 'Guardian Dragon Bond' : 'Lesson 3: Guardian Spirit Work'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="text-sm text-white/60">
                <span className="text-lg mr-2">ℹ️</span>
                Progress tracked through both {theme === 'child' ? 'adventure paths and exploration' : 'linear and exploratory paths'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
