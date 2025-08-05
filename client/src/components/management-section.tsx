import { useTheme } from "@/contexts/theme-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Table, BarChart3, Cloud, Plus } from "lucide-react";

export function ManagementSection() {
  const { theme } = useTheme();

  const managementFeatures = [
    {
      icon: Edit,
      title: 'Intuitive Content Creation',
      description: theme === 'child'
        ? 'Drag-and-drop interface for building magical adventures with interactive stories, mini-games, and reward systems'
        : 'Drag-and-drop interface for building lessons with multimedia support, interactive elements, and assessment tools',
      gradient: 'from-purple-600 to-indigo-600'
    },
    {
      icon: Table,
      title: 'Flexible Curriculum Structure',
      description: theme === 'child'
        ? 'Organize magical content into realms, quest chapters, and adventures with both story progression and free exploration'
        : 'Organize content into realms, modules, and lessons with both linear progression and exploratory pathways',
      gradient: 'from-amber-600 to-orange-600'
    },
    {
      icon: BarChart3,
      title: 'Learning Analytics',
      description: theme === 'child'
        ? 'Track young adventurer progress, engagement metrics, and magical achievements to continually improve the experience'
        : 'Track student progress, engagement metrics, and learning outcomes to continually improve the experience',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      icon: Cloud,
      title: 'Scalable Infrastructure',
      description: theme === 'child'
        ? 'Built to grow with your magical academy - from small adventure parties to vast guilds of young heroes'
        : 'Built to grow with your academy - from intimate circles to global communities of seekers',
      gradient: 'from-green-600 to-emerald-600'
    }
  ];

  return (
    <section className="py-20 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold mb-6 text-amber-100">
            Academy Management
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {theme === 'child'
              ? 'Powerful yet magical tools to create, organize, and evolve your enchanted curriculum'
              : 'Powerful yet intuitive tools to create, organize, and evolve your sacred curriculum'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Management Features */}
          <div className="space-y-8">
            {managementFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center`}>
                  <feature.icon className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Management Dashboard Preview */}
          <div className="relative">
            <div 
              className="absolute inset-0 bg-cover bg-center rounded-2xl opacity-20" 
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
              }}
            />
            
            <Card className="relative mystical-card border-white/20">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-cinzel text-xl font-bold text-white">
                      {theme === 'child' ? 'Magic Academy Dashboard' : 'Academy Dashboard'}
                    </h3>
                    <Button 
                      className={theme === 'child' ? 'child-button' : 'adult-button'}
                      size="sm"
                      data-testid="button-new-content"
                    >
                      <Plus className="mr-2" size={16} />
                      New Content
                    </Button>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="glass-morphism rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-pink-300">47</div>
                      <div className="text-xs text-white/60">
                        {theme === 'child' ? 'Young Heroes' : 'Active Seekers'}
                      </div>
                    </div>
                    <div className="glass-morphism rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-amber-300">12</div>
                      <div className="text-xs text-white/60">
                        {theme === 'child' ? 'Adventures' : 'Live Lessons'}
                      </div>
                    </div>
                    <div className="glass-morphism rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-300">5</div>
                      <div className="text-xs text-white/60">
                        {theme === 'child' ? 'Magic Realms' : 'Sacred Realms'}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between glass-morphism rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-white/80">
                          {theme === 'child' ? 'Earth Realm - Dragon Quest Published' : 'Earth Realm - Module 1 Published'}
                        </span>
                      </div>
                      <span className="text-xs text-white/60">2h ago</span>
                    </div>
                    <div className="flex items-center justify-between glass-morphism rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-white/80">
                          {theme === 'child' ? 'New hero joined Water Guild' : 'New seeker joined Water Circle'}
                        </span>
                      </div>
                      <span className="text-xs text-white/60">5h ago</span>
                    </div>
                    <div className="flex items-center justify-between glass-morphism rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span className="text-sm text-white/80">
                          {theme === 'child' ? 'Spirit Realm challenge completed' : 'Spirit Realm quiz completed'}
                        </span>
                      </div>
                      <span className="text-xs text-white/60">1d ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
