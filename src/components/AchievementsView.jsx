import { useState, useEffect } from 'react';
import { Flame, BookOpen, Star, Layers, ArrowLeft, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { fetchAchievements } from '@/lib/db';

const ICON_MAP = {
  flame: Flame,
  book: BookOpen,
  star: Star,
  layers: Layers
};

const CATEGORY_LABELS = {
  streak: 'Серия дней',
  volume: 'Объём',
  mastery: 'Мастерство',
  collection: 'Коллекции'
};

const AchievementsView = ({ userId }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchAchievements(userId).then(data => {
      setAchievements(data);
      setLoading(false);
    });
  }, [userId]);

  const unlocked = achievements.filter(a => a.unlocked).length;
  const grouped = {};
  for (const a of achievements) {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Достижения</h2>
          <p className="text-muted-foreground font-medium mt-1">
            {unlocked} из {achievements.length} получено
          </p>
        </div>
        <Card className="shadow-sm">
          <CardContent className="px-5 py-3 flex items-center gap-2">
            <Trophy size={20} className="text-primary" />
            <span className="text-lg font-black text-foreground">{unlocked}</span>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card className="py-16 text-center">
          <CardContent>
            <p className="text-muted-foreground font-medium">Загрузка достижений...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-4">
                {CATEGORY_LABELS[category]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(achievement => {
                  const Icon = ICON_MAP[achievement.icon] || Star;
                  return (
                    <TooltipProvider key={achievement.id} delay={300}>
                      <Tooltip>
                        <TooltipTrigger render={<div />}>
                          <Card
                            className={cn(
                              "transition-all",
                              achievement.unlocked
                                ? "border-primary/30 shadow-sm"
                                : "border-border opacity-60"
                            )}
                          >
                            <CardContent className="p-5 flex items-center gap-4">
                              <div
                                className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all",
                                  achievement.unlocked
                                    ? "bg-primary/15 text-primary"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                <Icon size={24} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={cn(
                                  "font-black text-sm leading-tight",
                                  achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                                )}>
                                  {achievement.title}
                                </h4>
                                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                  {achievement.desc}
                                </p>
                                {!achievement.unlocked && (
                                  <div className="mt-2 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="h-full bg-primary rounded-full transition-all"
                                      style={{ width: `${achievement.progress}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                              {achievement.unlocked && (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                                  <span className="text-primary-foreground text-xs font-black">✓</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          {achievement.unlocked
                            ? `Получено! (${achievement.current}/${achievement.threshold})`
                            : `${achievement.current}/${achievement.threshold}`
                          }
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementsView;
