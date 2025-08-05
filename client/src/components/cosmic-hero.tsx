import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTheme } from "@/contexts/theme-context";

export function CosmicHero() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Sacred Geometry Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Outer Circle */}
          <div className="w-96 h-96 border-2 border-amber-400/30 rounded-full animate-spin" style={{ animationDuration: '40s' }}>
            {/* Inner Circles */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-amber-400/20 rounded-full animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
              {/* Sacred Triangle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400/40">
                  <path
                    d="M50 10 L85 80 L15 80 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="8"
                    fill="currentColor"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Mystical Symbols */}
          <div className="absolute top-20 left-20 text-2xl text-amber-400/60 animate-float">✦</div>
          <div className="absolute top-32 right-24 text-xl text-amber-400/50 animate-float" style={{ animationDelay: '1s' }}>◊</div>
          <div className="absolute bottom-24 left-32 text-lg text-amber-400/40 animate-float" style={{ animationDelay: '2s' }}>☾</div>
          <div className="absolute bottom-20 right-20 text-xl text-amber-400/55 animate-float" style={{ animationDelay: '3s' }}>☽</div>
          <div className="absolute top-1/2 right-8 text-sm text-amber-400/45 animate-float" style={{ animationDelay: '1.5s' }}>◉</div>
          <div className="absolute top-1/2 left-8 text-sm text-amber-400/45 animate-float" style={{ animationDelay: '2.5s' }}>⊙</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Academy Title */}
        <h1 className="font-cinzel text-6xl md:text-8xl font-bold mb-4 text-golden leading-tight">
          JAKINTZA RUHA
        </h1>
        <h2 className="font-cinzel text-2xl md:text-3xl font-medium mb-8 text-amber-200/90 tracking-widest">
          ACADEMY OF REMEMBRANCE
        </h2>
        
        {/* Mystical Description */}
        <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
          Awaken ancient wisdom through sacred learning paths. 
          Choose your journey of remembrance and spiritual discovery.
        </p>

        {/* Path Selection */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
          <Link href="/dashboard">
            <Button 
              className="child-button text-lg px-8 py-4 min-w-48 golden-glow"
              onClick={() => theme !== 'child' && toggleTheme()}
              data-testid="button-child-path"
            >
              🌟 Magical Quest Path
            </Button>
          </Link>
          
          <div className="text-amber-400/60 font-cinzel text-lg">or</div>
          
          <Link href="/dashboard">
            <Button 
              className="adult-button text-lg px-8 py-4 min-w-48 golden-glow"
              onClick={() => theme !== 'adult' && toggleTheme()}
              data-testid="button-adult-path"
            >
              ⚡ Sacred Wisdom Path
            </Button>
          </Link>
        </div>

        {/* Theme Toggle Hint */}
        <p className="text-sm text-white/50 mb-16">
          Switch between magical and sacred themes anytime in your journey
        </p>

        {/* Academy Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="mystical-card text-center">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-cinzel text-lg font-semibold text-amber-200 mb-2">Five Sacred Realms</h3>
            <p className="text-sm text-white/70">Earth, Water, Fire, Air, and Spirit teachings</p>
          </div>
          
          <div className="mystical-card text-center">
            <div className="text-3xl mb-3">📖</div>
            <h3 className="font-cinzel text-lg font-semibold text-amber-200 mb-2">Interactive Lessons</h3>
            <p className="text-sm text-white/70">Multimedia learning with journaling and reflection</p>
          </div>
          
          <div className="mystical-card text-center">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-cinzel text-lg font-semibold text-amber-200 mb-2">Sacred Achievements</h3>
            <p className="text-sm text-white/70">Unlock wisdom badges and spiritual milestones</p>
          </div>
        </div>
      </div>
    </div>
  );
}