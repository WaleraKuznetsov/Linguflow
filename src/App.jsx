import React, { useState, useEffect } from 'react';
import {
  Layout, BarChart3, User, Info, Settings,
  LogOut, BookOpen, Layers, ChevronRight,
  Edit3, Trash2, X, Plus,
  Brain, CheckCircle2, ArrowLeft, Loader2, RotateCcw,
  Moon, Sun, RefreshCw, BookMarked, Trophy
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useDecks } from '@/context/DecksContext';
import { useTheme } from '@/context/ThemeContext';
import AuthScreen from '@/components/AuthScreen';
import Flashcard from '@/components/Flashcard';
import DeckCard from '@/components/DeckCard';
import MobileNav from '@/components/MobileNav';
import StatsView from '@/components/StatsView';
import AchievementsView from '@/components/AchievementsView';
import EditProfileDialog, { getAvatarUrl } from '@/components/EditProfileDialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { fetchProfile, upsertProfile } from '@/lib/db';

export default function App() {
  const { user, loading, signOut } = useAuth();
  const { decks, loading: decksLoading, createDeck, deleteDeck, addCard, deleteCard, rateCard, fetchDueCardsForDeck } = useDecks();
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState('dashboard');
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [studyMode, setStudyMode] = useState('all');
  const [studyCards, setStudyCards] = useState([]);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [profile, setProfile] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const activeDeck = decks?.find(d => d.id === activeDeckId);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id).then(p => setProfile(p));
    }
  }, [user?.id]);

  const handleSaveProfile = async (updates) => {
    const { data, error } = await upsertProfile(user.id, updates);
    if (!error && data) {
      setProfile(data);
    }
  };

  const avatarUrl = getAvatarUrl(user?.email, profile?.avatar_style || 'initials');

  const handleCreateDeck = async () => {
    if (newDeckTitle.trim()) {
      await createDeck(newDeckTitle, newDeckDescription || 'Пользовательская колода');
      setNewDeckTitle('');
      setNewDeckDescription('');
      setIsModalOpen(false);
    }
  };

  const startStudy = async (deckId, mode) => {
    setActiveDeckId(deckId);
    setStudyMode(mode);
    setCurrentCardIndex(0);

    if (mode === 'review') {
      const dueCards = await fetchDueCardsForDeck(deckId);
      setStudyCards(dueCards);
    } else {
      const deck = decks?.find(d => d.id === deckId);
      setStudyCards(deck?.cards || []);
    }

    setView('study');
  };

  const handleRate = async (rating) => {
    const card = studyCards[currentCardIndex];
    if (!card) return;

    await rateCard(card.id, rating);

    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setView('dashboard');
    }
  };

  if (loading || decksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-card border-r border-border flex-col p-6 lg:h-screen lg:sticky lg:top-0 shrink-0 shadow-lg overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="text-primary-foreground w-7 h-7" strokeWidth={2.5} />
          </div>
          <span className="font-black text-xl tracking-tight text-foreground">LinguFlow</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', icon: Layout, label: 'Колоды' },
            { id: 'stats', icon: BarChart3, label: 'Статистика' },
            { id: 'profile', icon: User, label: 'Профиль' },
            { id: 'about', icon: Info, label: 'О проекте' }
          ].map(item => (
            <Button
              key={item.id}
              onClick={() => setView(item.id)}
              variant={view === item.id ? 'default' : 'ghost'}
              className={cn(
                "w-full justify-start gap-3 h-12 rounded-xl font-bold transition-all duration-300",
                view === item.id 
                  ? 'bg-primary-gradient text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <Button 
            onClick={toggleTheme}
            variant="ghost" 
            className="w-full justify-start gap-3 h-12 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          </Button>
          <Button 
            onClick={() => signOut()}
            variant="ghost" 
            className="w-full justify-start gap-3 h-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={20} />
            Выйти
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden custom-scrollbar">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="text-primary-foreground w-6 h-6" strokeWidth={2.5} />
            </div>
            <span className="font-black text-lg text-foreground">LinguFlow</span>
          </div>
          <MobileNav view={view} setView={setView} onLogout={() => signOut()} theme={theme} onToggleTheme={toggleTheme} />
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8 lg:py-12 pb-20">
          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tight">Мои колоды</h1>
                  <p className="text-muted-foreground font-medium mt-1">Выберите колоду для начала обучения</p>
                </div>
                <Button 
                  onClick={() => setIsModalOpen(true)} 
                  className="h-12 px-6 rounded-xl font-bold bg-primary-gradient text-primary-foreground shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus size={20} className="mr-2" />
                  Создать колоду
                </Button>
              </div>
              
              {decks?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {decks.map(deck => (
                    <DeckCard
                      key={deck.id}
                      deck={deck}
                      onStudy={() => startStudy(deck.id, 'all')}
                      onReview={() => startStudy(deck.id, 'review')}
                      onManage={() => { setActiveDeckId(deck.id); setView('manage'); }}
                      onDelete={() => deleteDeck(deck.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-16">
                  <CardContent>
                    <Layers size={64} className="mx-auto text-muted-foreground/30 mb-6" />
                    <h3 className="text-xl font-black text-foreground mb-2">Нет колод</h3>
                    <p className="text-muted-foreground font-medium mb-6">Создайте первую колоду, чтобы начать обучение</p>
                    <Button onClick={() => setIsModalOpen(true)} className="bg-primary-gradient text-primary-foreground">
                      <Plus size={18} className="mr-2" />
                      Создать колоду
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* STUDY VIEW */}
          {view === 'study' && activeDeck && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-10">
                <Button 
                  onClick={() => setView('dashboard')} 
                  variant="ghost"
                  className="text-muted-foreground font-bold hover:text-foreground hover:bg-accent"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Назад
                </Button>
                <div className="flex items-center gap-3">
                  <Badge variant={studyMode === 'review' ? 'default' : 'secondary'} className="font-bold px-4 py-1.5">
                    {studyMode === 'review' ? (
                      <><RefreshCw size={14} className="mr-1.5" /> Повторение</>
                    ) : (
                      <><BookMarked size={14} className="mr-1.5" /> Все карточки</>
                    )}
                  </Badge>
                  <Card className="shadow-sm">
                    <CardContent className="px-6 py-3">
                      <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                        {currentCardIndex + 1} / {studyCards.length}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {studyCards.length > 0 && studyCards[currentCardIndex] ? (
                <Flashcard
                  key={studyCards[currentCardIndex].id}
                  card={studyCards[currentCardIndex]}
                  onRate={handleRate}
                />
              ) : (
                <Card className="w-full max-w-md">
                  <CardContent className="py-12 text-center">
                    {studyMode === 'review' ? (
                      <>
                        <CheckCircle2 size={48} className="mx-auto text-primary mb-4" />
                        <p className="text-foreground font-bold text-lg mb-1">Всё повторено на сегодня!</p>
                        <p className="text-muted-foreground font-medium mb-4">Нет карточек, срок повторения которых подошёл</p>
                        <p className="text-sm text-muted-foreground bg-accent rounded-xl p-4 text-left">
                          Возвращайтесь завтра — система рассчитает, какие слова нужно будет повторить. 
                          Чем чаще вы повторяете, тем лучше запоминаете!
                        </p>
                        <Button 
                          onClick={() => setView('dashboard')}
                          variant="outline"
                          className="mt-6"
                        >
                          К колодам
                        </Button>
                      </>
                    ) : (
                      <>
                        <Layers size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground font-bold text-lg">В этой колоде нет слов</p>
                        <Button 
                          onClick={() => setView('manage')}
                          variant="outline"
                          className="mt-4"
                        >
                          Добавить слова
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* MANAGE VIEW */}
          {view === 'manage' && activeDeck && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
              <Button 
                onClick={() => setView('dashboard')} 
                variant="ghost"
                 className="mb-8 text-muted-foreground font-bold hover:text-primary hover:bg-accent"
              >
                <RotateCcw size={18} className="mr-2" />
                К колодам
              </Button>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent text-primary rounded-xl flex items-center justify-center">
                      <Layers size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black leading-tight text-foreground">
                        {activeDeck.title}
                      </CardTitle>
                      <CardDescription>
                        Управление словами в колоде
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-3">
                    <Input 
                      value={newFront}
                      onChange={(e) => setNewFront(e.target.value)}
                      placeholder="Слово (English)" 
                      className="flex-1 h-12 rounded-xl"
                    />
                    <Input 
                      value={newBack}
                      onChange={(e) => setNewBack(e.target.value)}
                      placeholder="Перевод" 
                      className="flex-1 h-12 rounded-xl"
                    />
                    <Button 
                      onClick={async () => {
                        if (newFront.trim() && newBack.trim()) {
                          await addCard(activeDeckId, newFront.trim(), newBack.trim());
                          setNewFront('');
                          setNewBack('');
                        }
                      }} 
                      className="h-12 px-6 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Plus size={20} />
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {activeDeck.cards && activeDeck.cards.length > 0 ? (
                      activeDeck.cards.map(card => (
                        <div 
                          key={card.id} 
                          className="group flex justify-between items-center p-4 bg-card rounded-xl border border-border hover:border-primary transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-primary" />
                            <span className="font-bold text-foreground">
                              {card.front}
                              <span className="text-muted-foreground mx-2">—</span>
                              {card.back}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteCard(activeDeckId, card.id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground font-medium">
                        <Layers size={40} className="mx-auto mb-3 opacity-50" />
                        В колоде пока нет слов
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STATS VIEW */}
          {view === 'stats' && (
            <StatsView userId={user.id} decksCount={decks.length} totalCards={decks.reduce((sum, d) => sum + d.cards.length, 0)} />
          )}

          {/* PROFILE VIEW */}
          {view === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
              <Card className="text-center">
                <CardContent className="py-10">
                  <Avatar className="w-24 h-24 mx-auto mb-6">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-black">
                      {user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-black text-foreground mb-2">
                    {profile?.username || user?.user_metadata?.name || user?.email?.split('@')[0]}
                  </h2>
                  <Badge variant="secondary" className="font-bold px-4 py-1.5">
                    {user?.email}
                  </Badge>
                  
                  <div className="mt-8 space-y-3">
                    <Button
                      onClick={() => setIsEditProfileOpen(true)}
                      variant="outline"
                      className="w-full h-12 rounded-xl font-semibold hover:bg-accent"
                    >
                      <Settings size={18} className="mr-2" />
                      Редактировать профиль
                    </Button>
                    <Button
                      onClick={() => setView('achievements')}
                      variant="outline"
                      className="w-full h-12 rounded-xl font-semibold hover:bg-accent"
                    >
                      <Trophy size={18} className="mr-2" />
                      Мои достижения
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ACHIEVEMENTS VIEW */}
          {view === 'achievements' && (
            <AchievementsView userId={user.id} />
          )}

          {/* ABOUT VIEW */}
          {view === 'about' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto py-10">
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <BookOpen className="text-primary-foreground w-12 h-12" strokeWidth={2} />
                </div>
                <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight">
                  LinguFlow
                </h2>
                <p className="text-muted-foreground leading-relaxed font-medium text-lg">
                  Современная образовательная платформа для эффективного изучения иностранных языков 
                  с использованием метода интервальных повторений.
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                        <Brain size={22} />
                      </div>
                      <CardTitle className="text-xl font-black">Как работает метод SRS?</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      <span className="text-foreground font-bold">SRS (Spaced Repetition System)</span> — это метод 
                      интервальных повторений. Вместо того чтобы зубрить все слова каждый день, система показывает 
                      карточку именно тогда, когда вы начинаете её забывать.
                    </p>
                    <p>
                      Чем лучше вы знаете слово — тем реже оно появляется. Чем хуже — тем чаще. 
                      Это доказанный наукой подход, который помогает запоминать надолго с минимальными усилиями.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                        <BookMarked size={22} />
                      </div>
                      <CardTitle className="text-xl font-black">Как обучаться?</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-7 h-7 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shrink-0 text-sm font-black">1</div>
                        <p><span className="text-foreground font-bold">Нажмите «Учить»</span> на любой колоде, чтобы пройти все карточки подряд</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-7 h-7 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shrink-0 text-sm font-black">2</div>
                        <p><span className="text-foreground font-bold">Переверните карточку</span>, нажав на неё, чтобы увидеть перевод</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-7 h-7 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shrink-0 text-sm font-black">3</div>
                        <p><span className="text-foreground font-bold">Оцените, насколько легко</span> вам было вспомнить слово</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                        <RefreshCw size={22} />
                      </div>
                      <CardTitle className="text-xl font-black">Что значат кнопки оценки?</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start p-3 rounded-xl bg-destructive/10">
                        <span className="text-sm font-black text-destructive uppercase tracking-wider shrink-0">Снова</span>
                        <p className="text-sm text-muted-foreground">Не смогли вспомнить. Карточка появится <span className="text-foreground font-bold">завтра</span></p>
                      </div>
                      <div className="flex gap-3 items-start p-3 rounded-xl bg-muted">
                        <span className="text-sm font-black text-foreground uppercase tracking-wider shrink-0">Трудно</span>
                        <p className="text-sm text-muted-foreground">Вспомнили с трудом. Интервал немного <span className="text-foreground font-bold">увеличится</span></p>
                      </div>
                      <div className="flex gap-3 items-start p-3 rounded-xl bg-primary/10">
                        <span className="text-sm font-black text-primary uppercase tracking-wider shrink-0">Хорошо</span>
                        <p className="text-sm text-muted-foreground">Вспомнили легко. Следующее повторение <span className="text-foreground font-bold">через несколько дней</span></p>
                      </div>
                      <div className="flex gap-3 items-start p-3 rounded-xl bg-primary/5">
                        <span className="text-sm font-black text-primary/70 uppercase tracking-wider shrink-0">Легко</span>
                        <p className="text-sm text-muted-foreground">Знали сразу. Карточка появится <span className="text-foreground font-bold">через долгий интервал</span></p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                        <RefreshCw size={22} />
                      </div>
                      <CardTitle className="text-xl font-black">Зачем кнопка «Повторить»?</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Кнопка <span className="text-foreground font-bold">«Повторить»</span> (иконка с круговой стрелкой) 
                      показывает только те карточки, которые <span className="text-foreground font-bold">нужно повторить прямо сейчас</span>. 
                      Это слова, у которых подошёл срок повторения по расписанию SRS.
                    </p>
                    <p>
                      Если карточек для повторения нет — значит вы всё повторили на сегодня! 
                      Возвращайтесь завтра — система рассчитает, какие слова нужно будет повторить.
                    </p>
                    <p className="text-sm bg-accent p-4 rounded-xl">
                      Совет: заходите в LinguFlow каждый день и нажимайте «Повторить» — 
                      так вы не забудете слова и будете прогрессировать быстрее.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CREATE DECK DIALOG */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-12 h-12 bg-accent text-primary rounded-xl flex items-center justify-center mb-4">
              <Layers size={24} />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">Новая колода</DialogTitle>
            <DialogDescription>
              Создайте новую колоду для изучения слов
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Название</label>
              <Input 
                autoFocus
                value={newDeckTitle} 
                onChange={(e) => setNewDeckTitle(e.target.value)} 
                className="h-12 rounded-xl"
                placeholder="Например: TOEFL Words"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Описание (опционально)</label>
              <Input 
                value={newDeckDescription} 
                onChange={(e) => setNewDeckDescription(e.target.value)} 
                className="h-12 rounded-xl"
                placeholder="Краткое описание колоды"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              onClick={() => setIsModalOpen(false)} 
              variant="outline"
              className="h-12 rounded-xl font-bold"
            >
              Отмена
            </Button>
            <Button 
              onClick={handleCreateDeck}
              className="h-12 px-8 rounded-xl font-bold bg-primary-gradient text-primary-foreground"
            >
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT PROFILE DIALOG */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        profile={profile}
        email={user?.email}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
