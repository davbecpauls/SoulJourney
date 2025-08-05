import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, LogIn } from "lucide-react";

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 glass-morphism border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-4">
            <div className="text-2xl font-cinzel font-bold text-amber-200">
              <LogIn className="inline mr-2 text-amber-500" size={24} />
              Jakintza Ruha
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard">
              <Button 
                variant={location === "/dashboard" ? "default" : "ghost"}
                className="text-white hover:text-amber-200"
                data-testid="nav-dashboard"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/admin">
              <Button 
                variant={location === "/admin" ? "default" : "ghost"}
                className="text-white hover:text-amber-200"
                data-testid="nav-admin"
              >
                Admin
              </Button>
            </Link>
          </div>
          
          {/* Theme Switcher */}
          <div className="flex items-center space-x-6">
            <div className="glass-morphism rounded-full p-1 flex items-center">
              <Button
                onClick={() => theme !== 'child' && toggleTheme()}
                variant={theme === 'child' ? 'default' : 'ghost'}
                size="sm"
                className={`rounded-full text-sm font-medium transition-all duration-300 ${
                  theme === 'child' 
                    ? 'bg-pink-500 text-white hover:bg-pink-600' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                data-testid="theme-child"
              >
                <Sparkles className="mr-2" size={16} />
                Children
              </Button>
              <Button
                onClick={() => theme !== 'adult' && toggleTheme()}
                variant={theme === 'adult' ? 'default' : 'ghost'}
                size="sm"
                className={`rounded-full text-sm font-medium transition-all duration-300 ${
                  theme === 'adult' 
                    ? 'bg-slate-700 text-white hover:bg-slate-800' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                data-testid="theme-adult"
              >
                <Users className="mr-2" size={16} />
                Adults
              </Button>
            </div>
            <Button 
              className={theme === 'child' ? 'child-button' : 'adult-button'}
              data-testid="button-enter-academy"
            >
              Enter Academy
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
