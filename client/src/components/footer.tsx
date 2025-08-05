import { useTheme } from "@/contexts/theme-context";
import { LogIn, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  const { theme } = useTheme();

  const learningPaths = theme === 'child' 
    ? [
        { name: "Magical Quests", href: "#" },
        { name: "Adventure Guilds", href: "#" },
        { name: "Enchanted Realms", href: "#" },
        { name: "Hero Circles", href: "#" }
      ]
    : [
        { name: "Children's Quests", href: "#" },
        { name: "Adult Journey", href: "#" },
        { name: "Sacred Realms", href: "#" },
        { name: "Community Circles", href: "#" }
      ];

  const resources = theme === 'child'
    ? [
        { name: "How to Start", href: "#" },
        { name: "Help Center", href: "#" },
        { name: "Magic Library", href: "#" },
        { name: "Guide Resources", href: "#" }
      ]
    : [
        { name: "Getting Started", href: "#" },
        { name: "Support Center", href: "#" },
        { name: "Content Library", href: "#" },
        { name: "Teacher Resources", href: "#" }
      ];

  return (
    <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <LogIn className="text-2xl text-amber-400" size={24} />
              <span className="font-cinzel text-xl font-bold text-amber-100">Jakintza Ruha</span>
            </div>
            <p className="text-white/60 text-sm">
              {theme === 'child'
                ? 'Academy of Remembrance - where young heroes discover their magical powers through enchanted learning adventures.'
                : 'Academy of Remembrance - where souls rediscover their ancient wisdom through sacred learning.'
              }
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-amber-400 transition-colors" data-testid="social-facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-amber-400 transition-colors" data-testid="social-instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-amber-400 transition-colors" data-testid="social-youtube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Learning Paths */}
          <div>
            <h3 className="font-cinzel text-lg font-bold text-white mb-4">Learning Paths</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {learningPaths.map((path, index) => (
                <li key={index}>
                  <a href={path.href} className="hover:text-amber-400 transition-colors">
                    {path.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-cinzel text-lg font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a href={resource.href} className="hover:text-amber-400 transition-colors">
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-cinzel text-lg font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-center space-x-2">
                <span className="text-amber-400">✉️</span>
                <span>hello@jakintzaruha.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-amber-400">📞</span>
                <span>+1 (555) 123-SOUL</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-amber-400">📍</span>
                <span>Sacred Space, Earth</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/40">
          <p>&copy; 2024 Jakintza Ruha: Academy of Remembrance. All sacred rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
