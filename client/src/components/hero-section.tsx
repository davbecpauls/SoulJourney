import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Crown, Clover, Sparkles, Users } from "lucide-react";

export function HeroSection() {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Mystical background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
        style={{
          backgroundImage: theme === 'child' 
            ? "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
            : "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      
      {/* Floating mystical elements */}
      <div className="absolute inset-0">
        <div className="animate-float absolute top-20 left-10 text-amber-300 text-4xl opacity-50">✦</div>
        <div className="animate-float absolute top-40 right-20 text-pink-300 text-3xl opacity-40" style={{animationDelay: '1s'}}>❋</div>
        <div className="animate-float absolute bottom-40 left-20 text-blue-300 text-5xl opacity-30" style={{animationDelay: '2s'}}>◈</div>
        <div className="animate-float absolute bottom-20 right-10 text-amber-400 text-3xl opacity-50" style={{animationDelay: '0.5s'}}>✧</div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="animate-glow mb-8">
          <h1 className={`font-cinzel text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r ${
            theme === 'child' 
              ? 'from-pink-200 via-purple-200 to-blue-200' 
              : 'from-amber-200 via-orange-200 to-yellow-200'
          } bg-clip-text text-transparent`}>
            Academy of Remembrance
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
          {theme === 'child' 
            ? "Where young heroes discover magical powers through enchanted quests and mystical adventures"
            : "Where souls remember their truth through sacred learning and mystical discovery"
          }
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            className={`${theme === 'child' ? 'child-button' : 'adult-button'} animate-glow`}
            data-testid="button-begin-quest"
          >
            {theme === 'child' ? (
              <>
                <Crown className="mr-3" size={20} />
                Begin Magical Quest
              </>
            ) : (
              <>
                <Clover className="mr-3" size={20} />
                Start Sacred Journey
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-white/30 text-white hover:bg-white/10"
            data-testid="button-explore-academy"
          >
            {theme === 'child' ? (
              <>
                <Sparkles className="mr-3" size={20} />
                Explore Magic Realms
              </>
            ) : (
              <>
                <Users className="mr-3" size={20} />
                Explore Sacred Wisdom
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
