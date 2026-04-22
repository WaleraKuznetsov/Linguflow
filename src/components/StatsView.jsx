import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Brain, Layers, RefreshCw, BookOpen } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fetchStatistics, fetchProgressStats } from '@/lib/db';

const COLORS = ['var(--color-primary)', 'var(--color-destructive)', 'var(--color-chart-3)', 'var(--color-chart-4)'];

const PIE_DATA = [
  { name: 'Хорошо', value: 0 },
  { name: 'Легко', value: 0 },
  { name: 'Снова', value: 0 },
  { name: 'Трудно', value: 0 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-sm font-bold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-medium" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const StatsView = ({ userId, decksCount, totalCards }) => {
  const [stats, setStats] = useState([]);
  const [progressStats, setProgressStats] = useState({ total: 0, learned: 0, dueToday: 0, avgEase: 0 });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [statsData, progressData] = await Promise.all([
          fetchStatistics(userId, period),
          fetchProgressStats(userId)
        ]);
        setStats(statsData);
        setProgressStats(progressData);
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) loadData();
  }, [userId, period]);

  const totalLearned = stats.reduce((sum, s) => sum + s.cards_learned, 0);
  const totalReviewed = stats.reduce((sum, s) => sum + s.cards_reviewed, 0);
  const streak = calculateStreak(stats);

  const summaryCards = [
    { label: 'Колоды', value: decksCount, icon: Layers, color: 'text-primary' },
    { label: 'Всего слов', value: totalCards, icon: BookOpen, color: 'text-primary' },
    { label: 'Изучено', value: progressStats.learned, icon: TrendingUp, color: 'text-emerald-500 dark:text-emerald-400' },
    { label: 'На повторении', value: progressStats.dueToday, icon: RefreshCw, color: 'text-amber-500 dark:text-amber-400' },
    { label: 'Серия дней', value: streak, icon: Brain, color: 'text-primary' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-foreground tracking-tight">Статистика</h2>
        <p className="text-muted-foreground font-medium mt-1">Ваш прогресс и активность</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {summaryCards.map(card => (
          <Card key={card.label} className="shadow-sm">
            <CardContent className="py-5 text-center">
              <card.icon size={24} className={cn("mx-auto mb-2", card.color)} />
              <div className="text-2xl font-black text-foreground">{card.value}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">{card.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {[7, 14, 30].map(days => (
          <Button
            key={days}
            onClick={() => setPeriod(days)}
            variant={period === days ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl font-bold"
          >
            {days} дней
          </Button>
        ))}
      </div>

      {loading ? (
        <Card className="py-16 text-center">
          <CardContent>
            <p className="text-muted-foreground font-medium">Загрузка статистики...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* AreaChart — Изученные и повторённые карточки */}
          <Card className="mb-6 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black">Активность обучения</CardTitle>
              <CardDescription>Изучено и повторено карточек за {period} дней</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats}>
                    <defs>
                      <linearGradient id="learnedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="reviewedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="cards_learned" name="Изучено" stroke="var(--color-primary)" fill="url(#learnedGradient)" strokeWidth={2} />
                    <Area type="monotone" dataKey="cards_reviewed" name="Повторено" stroke="var(--color-chart-3)" fill="url(#reviewedGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* BarChart — По дням */}
          <Card className="mb-6 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black">Карточки по дням</CardTitle>
              <CardDescription>Общее количество карточек за каждый день</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="cards_learned" name="Изучено" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="cards_reviewed" name="Повторено" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Row: PieChart + Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-black">Средний интервал</CardTitle>
                <CardDescription>Насколько хорошо вы запоминаете</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="text-5xl font-black text-primary mb-2">
                      {progressStats.avgEase > 0 ? progressStats.avgEase.toFixed(1) : '—'}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {progressStats.avgEase >= 2.5 ? 'Отличное запоминание!' :
                       progressStats.avgEase >= 2.0 ? 'Хорошее запоминание' :
                       progressStats.avgEase > 0 ? 'Нужно больше повторений' : 'Начните учиться, чтобы увидеть прогресс'}
                    </p>
                    <div className="mt-4 w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-primary-gradient rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (progressStats.avgEase / 3) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-black">Общий прогресс</CardTitle>
                <CardDescription>Изучено и повторено всего</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 py-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-foreground">Изучено</span>
                      <Badge variant="secondary" className="font-bold">{totalLearned}</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${totalCards > 0 ? Math.min(100, (totalLearned / totalCards) * 100) : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-foreground">Повторено</span>
                      <Badge variant="secondary" className="font-bold">{totalReviewed}</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-chart-3 rounded-full transition-all" style={{ width: `${totalCards > 0 ? Math.min(100, (totalReviewed / totalCards) * 100) : 0}%` }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BarChart3 size={16} />
                      <span className="text-sm font-medium">
                        {totalCards > 0
                          ? `${Math.round(((totalLearned + totalReviewed) / totalCards) * 100)}% от всех слов пройдено`
                          : 'Начните обучение, чтобы увидеть прогресс'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

function calculateStreak(stats) {
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];

  const sorted = [...stats].reverse();
  for (const s of sorted) {
    if (s.cards_learned > 0 || s.cards_reviewed > 0) {
      streak++;
    } else if (s.date < today) {
      break;
    }
  }
  return streak;
}

export default StatsView;
