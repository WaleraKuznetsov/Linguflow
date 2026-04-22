import { Layout, BarChart3, User, Info, BookOpen, LogOut, MoreHorizontal, Moon, Sun } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MobileNav = ({ view, setView, onLogout, theme, onToggleTheme }) => {
  const navItems = [
    { id: 'dashboard', icon: Layout, label: 'Колоды' },
    { id: 'stats', icon: BarChart3, label: 'Статистика' },
    { id: 'profile', icon: User, label: 'Профиль' },
    { id: 'about', icon: Info, label: 'О проекте' }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div 
          className="inline-flex items-center justify-center rounded-lg border border-border bg-transparent hover:bg-accent dark:hover:bg-white/10 h-10 w-10 cursor-pointer"
        >
          <MoreHorizontal size={20} />
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-card">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-3 px-2 text-primary">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="text-primary-foreground w-6 h-6" />
            </div>
            <SheetTitle className="text-foreground font-black text-lg">LinguFlow</SheetTitle>
          </div>
        </SheetHeader>
        <nav className="space-y-2">
          {navItems.map(item => (
            <Button
              key={item.id}
              onClick={() => { setView(item.id); }}
              variant={view === item.id ? 'default' : 'ghost'}
              className={cn(
                "w-full justify-start gap-3 h-12 rounded-xl font-bold transition-all",
                view === item.id 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Button 
            onClick={onToggleTheme}
            variant="ghost" 
            className="w-full justify-start gap-3 h-12 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          </Button>
          <Button 
            onClick={onLogout}
            variant="ghost" 
            className="w-full justify-start gap-3 h-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 border-t border-border pt-4"
          >
            <LogOut size={20} />
            Выйти
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
