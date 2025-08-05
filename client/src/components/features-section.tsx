import { useTheme } from "@/contexts/theme-context";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Feather, 
  VideoIcon, 
  TrendingUp, 
  HandHeart, 
  Users, 
  Brain,
  Sparkles,
  BookOpen,
  Headphones,
  Download
} from "lucide-react";

export function FeaturesSection() {
  const { theme } = useTheme();

  const features = [
    {
      icon: theme === 'child' ? Sparkles : Feather,
      title: theme === 'child' ? 'Magical Journals' : 'Sacred Journaling',
      description: theme === 'child' 
        ? 'Digital spell books with guided prompts, adventure logs, and magical discovery tracking'
        : 'Digital journals with guided prompts, reflection exercises, and personal insight tracking',
      gradient: 'from-purple-600 to-indigo-600',
      demo: theme === 'child' ? '✨ "Today I learned a new spell..."' : '✍️ "Today I discovered..."'
    },
    {
      icon: VideoIcon,
      title: theme === 'child' ? 'Interactive Adventures' : 'Rich Media Learning',
      description: theme === 'child'
        ? 'Animated stories, interactive games, magical videos, and downloadable spell guides'
        : 'Video teachings, audio meditations, interactive visuals, and downloadable resources',
      gradient: 'from-blue-600 to-cyan-600',
      demo: (
        <div className="flex justify-center space-x-2">
          <VideoIcon className="text-blue-400" size={16} />
          <Headphones className="text-purple-400" size={16} />
          <Download className="text-green-400" size={16} />
        </div>
      )
    },
    {
      icon: TrendingUp,
      title: theme === 'child' ? 'Adventure Progress' : 'Sacred Progress',
      description: theme === 'child'
        ? 'Track your magical journey with quest completion, spell mastery, and adventure milestones'
        : 'Meaningful progress visualization with spiritual milestones and achievement recognition',
      gradient: 'from-amber-600 to-orange-600',
      demo: <Progress value={75} className="h-2" />
    },
    {
      icon: HandHeart,
      title: theme === 'child' ? 'Magical Sanctuary' : 'Virtual Altar',
      description: theme === 'child'
        ? 'Create and customize your personal magical space with virtual creatures and treasures'
        : 'Create and customize your personal sacred space with virtual elements and offerings',
      gradient: 'from-green-600 to-emerald-600',
      demo: '🕯️ Your Sacred Space'
    },
    {
      icon: Users,
      title: theme === 'child' ? 'Adventure Guilds' : 'Sacred Circles',
      description: theme === 'child'
        ? 'Connect with fellow young adventurers in guided quest parties and magical ceremonies'
        : 'Connect with like-minded souls in guided discussion circles and community rituals',
      gradient: 'from-pink-600 to-rose-600',
      demo: (
        <div className="flex justify-center space-x-1">
          <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-xs">👤</div>
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs">👤</div>
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">👤</div>
        </div>
      )
    },
    {
      icon: Brain,
      title: theme === 'child' ? 'Knowledge Challenges' : 'Wisdom Assessments',
      description: theme === 'child'
        ? 'Fun quizzes, magical puzzles, and adventure challenges with instant feedback'
        : 'Interactive quizzes, practical exercises, and reflection-based evaluations',
      gradient: 'from-indigo-600 to-violet-600',
      demo: theme === 'child' ? '🧠 Magic Quiz • 8/10 ⭐' : '🧠 Knowledge Check • 8/10'
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold mb-6 text-amber-100">
            {theme === 'child' ? 'Magical Learning Features' : 'Sacred Learning Features'}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {theme === 'child'
              ? 'Enchanting tools and experiences designed to make learning magical and unforgettable'
              : 'Immersive tools and experiences designed to support deep learning and spiritual growth'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="mystical-card border-white/10 hover:border-white/30 group"
              data-testid={`feature-card-${index}`}
            >
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-white mb-2">{feature.title}</h3>
                </div>
                <p className="text-white/70 text-sm text-center mb-4">
                  {feature.description}
                </p>
                <div className="glass-morphism rounded-lg p-3 text-xs text-white/60 text-center">
                  {typeof feature.demo === 'string' ? (
                    <div>{feature.demo}</div>
                  ) : (
                    feature.demo
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
