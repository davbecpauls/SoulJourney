import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Rocket, Compass, Shield, Users, Infinity, Heart } from "lucide-react";

export function CTASection() {
  const { theme } = useTheme();

  const trustIndicators = [
    { icon: Shield, text: theme === 'child' ? 'Safe & Magical' : 'Sacred & Secure' },
    { icon: Users, text: 'Growing Community' },
    { icon: Infinity, text: 'Lifetime Access' },
    { icon: Heart, text: 'Built with Love' }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Cosmic background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40" 
        style={{
          backgroundImage: theme === 'child'
            ? "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
            : "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="animate-glow mb-8">
          <h2 className={`font-cinzel text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r ${
            theme === 'child' 
              ? 'from-pink-200 via-purple-200 to-blue-200' 
              : 'from-amber-200 via-orange-200 to-yellow-200'
          } bg-clip-text text-transparent`}>
            {theme === 'child' ? 'Begin Your Magical Adventure' : 'Begin Your Sacred Journey'}
          </h2>
        </div>
        
        <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
          {theme === 'child'
            ? 'The Academy of Remembrance awaits, young hero. Choose your magical path and discover the ancient powers that live within your brave heart.'
            : 'The Academy of Remembrance awaits. Choose your path and rediscover the ancient wisdom that lives within your soul.'
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-12">
          <Button 
            className={`${theme === 'child' ? 'child-button' : 'adult-button'} animate-glow px-10 py-5 text-xl`}
            data-testid="button-start-free-trial"
          >
            <Rocket className="mr-3" size={24} />
            {theme === 'child' ? 'Start Magic Trial' : 'Start Free Trial'}
          </Button>
          <Button 
            variant="outline"
            className="border-2 border-amber-400 hover:bg-amber-400 hover:text-black px-10 py-5 text-xl transition-all duration-300 transform hover:scale-105 text-white"
            data-testid="button-explore-academy"
          >
            <Compass className="mr-3" size={24} />
            {theme === 'child' ? 'Explore Magic Realms' : 'Explore Academy'}
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm">
          {trustIndicators.map((indicator, index) => (
            <div key={index} className="flex items-center space-x-2">
              <indicator.icon className={
                theme === 'child' 
                  ? index === 0 ? 'text-pink-400' : index === 1 ? 'text-blue-400' : index === 2 ? 'text-purple-400' : 'text-yellow-400'
                  : index === 0 ? 'text-green-400' : index === 1 ? 'text-blue-400' : index === 2 ? 'text-purple-400' : 'text-pink-400'
              } size={16} />
              <span>{indicator.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
