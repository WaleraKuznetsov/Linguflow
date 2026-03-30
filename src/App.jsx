import React, { useState, useEffect } from 'react';
import { 
  Layout, BarChart3, User, Info, Settings, 
  LogOut, BookOpen, Layers, Plus, ChevronRight,
  Edit3, Trash2, X, RotateCcw, Lock, Mail, UserPlus
} from 'lucide-react';

// --- ДАННЫЕ ПО УМОЛЧАНИЮ (50 СЛОВ) ---
const INITIAL_DECKS = [
  {
    id: 'a1-a2',
    title: 'Beginner (A1-A2)',
    cards: [
      { id: 1, front: 'House', back: 'Дом' }, { id: 2, front: 'Water', back: 'Вода' }, { id: 3, front: 'Friend', back: 'Друг' },
      { id: 4, front: 'School', back: 'Школа' }, { id: 5, front: 'Apple', back: 'Яблоко' }, { id: 6, front: 'Work', back: 'Работа' },
      { id: 7, front: 'Family', back: 'Семья' }, { id: 8, front: 'Time', back: 'Время' }, { id: 9, front: 'Street', back: 'Улица' },
      { id: 10, front: 'City', back: 'Город' }, { id: 11, front: 'Book', back: 'Книга' }, { id: 12, front: 'Money', back: 'Деньги' },
      { id: 13, front: 'Food', back: 'Еда' }, { id: 14, front: 'Hand', back: 'Рука' }, { id: 15, front: 'Day', back: 'День' }
    ]
  },
  {
    id: 'b1-b2',
    title: 'Intermediate (B1-B2)',
    cards: [
      { id: 16, front: 'Adventure', back: 'Приключение' }, { id: 17, front: 'Behavior', back: 'Поведение' }, { id: 18, front: 'Challenge', back: 'Вызов' },
      { id: 19, front: 'Decision', back: 'Решение' }, { id: 20, front: 'Environment', back: 'Окружающая среда' }, { id: 21, front: 'Frequency', back: 'Частота' },
      { id: 22, front: 'Growth', back: 'Рост' }, { id: 23, front: 'Habit', back: 'Привычка' }, { id: 24, front: 'Influence', back: 'Влияние' },
      { id: 25, front: 'Justice', back: 'Справедливость' }, { id: 26, front: 'Knowledge', back: 'Знание' }, { id: 27, front: 'Landscape', back: 'Пейзаж' },
      { id: 28, front: 'Measure', back: 'Мера' }, { id: 29, front: 'Negotiate', back: 'Вести переговоры' }, { id: 30, front: 'Opportunity', back: 'Возможность' },
      { id: 31, front: 'Purpose', back: 'Цель' }, { id: 32, front: 'Quality', back: 'Качество' }, { id: 33, front: 'Reliable', back: 'Надежный' }
    ]
  },
  {
    id: 'c1-c2',
    title: 'Advanced (C1-C2)',
    cards: [
      { id: 34, front: 'Ambiguity', back: 'Двусмысленность' }, { id: 35, front: 'Benevolent', back: 'Доброжелательный' }, { id: 36, front: 'Conundrum', back: 'Головоломка' },
      { id: 37, front: 'Dichotomy', back: 'Дихотомия' }, { id: 38, front: 'Ephemeral', back: 'Эфемерный' }, { id: 39, front: 'Frivolous', back: 'Легкомысленный' },
      { id: 40, front: 'Gregarious', back: 'Общительный' }, { id: 41, front: 'Hegemony', back: 'Гегемония' }, { id: 42, front: 'Inevitable', back: 'Неизбежный' },
      { id: 43, front: 'Juxtaposition', back: 'Сопоставление' }, { id: 44, front: 'Loquacious', back: 'Многоречивый' }, { id: 45, front: 'Meticulous', back: 'Дотошный' },
      { id: 46, front: 'Nefarious', back: 'Гнусный' }, { id: 47, front: 'Obsequious', back: 'Подобострастный' }, { id: 48, front: 'Paradigm', back: 'Парадигма' },
      { id: 49, front: 'Resilience', back: 'Устойчивость' }, { id: 50, front: 'Ubiquitous', back: 'Вездесущий' }
    ]
  }
];

// --- КОМПОНЕНТ: Обучающая 3D карточка ---
const Flashcard = ({ card, onRate }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Сбрасываем переворот при смене карточки
  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto h-[420px] perspective-1000">
      <div 
        onClick={() => setIsFlipped(!isFlipped)} 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Лицевая сторона */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-white border-2 border-indigo-50 rounded-[3rem] shadow-xl backface-hidden text-center">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">English Word</span>
          <h2 className="text-4xl font-black text-slate-800 break-words w-full tracking-tight">{card.front}</h2>
          <div className="mt-12 p-3 bg-slate-50 rounded-full">
            <RotateCcw size={20} className="text-slate-300" />
          </div>
        </div>
        
        {/* Обратная сторона (Перевод) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-indigo-600 border-2 border-indigo-500 rounded-[3rem] shadow-xl backface-hidden rotate-y-180 text-center text-white">
          <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-6">Перевод</span>
          <h2 className="text-4xl font-black break-words w-full tracking-tight">{card.back}</h2>
        </div>
      </div>

      {/* Кнопки оценки */}
      <div className={`flex gap-2 mt-8 w-full transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {['Снова', 'Трудно', 'Хорошо', 'Легко'].map((label) => (
          <button 
            key={label} 
            onClick={(e) => { e.stopPropagation(); onRate(); }}
            className="flex-1 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black hover:border-indigo-500 hover:text-indigo-600 transition-all active:scale-90 uppercase shadow-sm"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- КОМПОНЕНТ: Окно Auth ---
const AuthScreen = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
            <BookOpen className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">LinguFlow</h1>
          <p className="text-slate-400 mt-2 font-medium">{isRegistering ? 'Создайте новый аккаунт' : 'С возвращением!'}</p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="space-y-4 mb-8">
            {isRegistering && (
              <div className="relative">
                <UserPlus className="absolute left-4 top-4 text-slate-300" size={20} />
                <input type="text" placeholder="Ваше имя" className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-300" size={20} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-300" size={20} />
              <input type="password" placeholder="Пароль" className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
            </div>
          </div>
          <button onClick={() => onLogin(email || 'User')} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            {isRegistering ? 'Зарегистрироваться' : 'Войти'}
          </button>
          <div className="mt-8 text-center">
            <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm text-slate-400 font-bold hover:text-indigo-600 transition-colors">
              {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Создать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ОСНОВНОЙ APP ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [view, setView] = useState('dashboard');
  const [decks, setDecks] = useState(() => {
    const saved = localStorage.getItem('linguflow_v5');
    return saved ? JSON.parse(saved) : INITIAL_DECKS;
  });
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');

  useEffect(() => { localStorage.setItem('linguflow_v5', JSON.stringify(decks)); }, [decks]);

  const activeDeck = decks.find(d => d.id === activeDeckId);

  if (!isAuthenticated) return <AuthScreen onLogin={(e) => { setUserEmail(e); setIsAuthenticated(true); }} />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 h-screen sticky top-0 shrink-0">
        <div className="flex items-center gap-3 mb-12 px-2 text-indigo-600">
          <BookOpen size={28} strokeWidth={3} />
          <span className="font-black text-xl tracking-tight text-slate-800">LinguFlow</span>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', icon: Layout, label: 'Колоды' },
            { id: 'stats', icon: BarChart3, label: 'Статистика' },
            { id: 'profile', icon: User, label: 'Профиль' },
            { id: 'about', icon: Info, label: 'О проекте' }
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-2xl font-bold text-sm transition-all ${view === item.id || (['manage', 'study'].includes(view) && item.id === 'dashboard') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 p-4 text-slate-300 hover:text-rose-500 font-bold transition-all border-t border-slate-50 mt-auto">
          <LogOut size={20} /> <span className="text-sm">Выйти</span>
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 flex justify-center overflow-y-auto">
        <div className="w-full max-w-3xl px-8 py-12">
          
          {view === 'dashboard' && (
            <div className="animate-fade-in">
              <header className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black text-slate-900">Мои колоды</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg"><Plus size={18} /> Создать</button>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {decks.map(deck => (
                  <div key={deck.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative flex flex-col">
                    <button onClick={() => setDecks(decks.filter(d => d.id !== deck.id))} className="absolute top-6 right-6 text-slate-200 hover:text-rose-500"><Trash2 size={16}/></button>
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center mb-6 transition-colors"><Layers size={24} /></div>
                    <h3 className="text-xl font-black text-slate-800 mb-1 leading-tight">{deck.title}</h3>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-8">{deck.cards.length} слов</p>
                    <div className="mt-auto flex gap-2">
                      {/* Ровная кнопка "Учить" */}
                      <button onClick={() => { setActiveDeckId(deck.id); setView('study'); setCurrentCardIndex(0); }} className="flex-[4] py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md">Учить</button>
                      <button onClick={() => { setActiveDeckId(deck.id); setView('manage'); }} className="flex-1 py-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition-all"><Edit3 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'study' && activeDeck && (
            <div className="animate-fade-in flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-12">
                <button onClick={() => setView('dashboard')} className="text-slate-400 font-bold text-sm hover:text-slate-900 flex items-center gap-2"><X size={20} /> Выйти</button>
                <div className="bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentCardIndex + 1} / {activeDeck.cards.length}</span>
                </div>
              </div>
              {activeDeck.cards.length > 0 ? (
                <Flashcard 
                  card={activeDeck.cards[currentCardIndex]} 
                  onRate={() => {
                    if (currentCardIndex < activeDeck.cards.length - 1) setCurrentCardIndex(currentCardIndex + 1);
                    else { setView('dashboard'); alert('Колода пройдена!'); }
                  }} 
                />
              ) : <p className="text-slate-400 font-bold py-20">Слов нет...</p>}
            </div>
          )}

          {view === 'manage' && activeDeck && (
            <div className="animate-fade-in max-w-xl mx-auto">
              <button onClick={() => setView('dashboard')} className="mb-8 flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-indigo-600 transition-all"><RotateCcw size={16} /> К колодам</button>
              <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-black mb-8 leading-tight">Колода: {activeDeck.title}</h2>
                <div className="flex gap-2 mb-8">
                  <input id="f" placeholder="Word" className="flex-1 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                  <input id="b" placeholder="Перевод" className="flex-1 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                  <button onClick={() => {
                    const f = document.getElementById('f'), b = document.getElementById('b');
                    if(f.value && b.value) { setDecks(decks.map(d => d.id === activeDeckId ? { ...d, cards: [...d.cards, { id: Date.now(), front: f.value, back: b.value }] } : d)); f.value = ''; b.value = ''; }
                  }} className="px-6 bg-indigo-600 text-white font-black rounded-2xl shadow-lg">OK</button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {activeDeck.cards.map(card => (
                    <div key={card.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl group">
                      <span className="font-bold text-slate-700 text-sm">{card.front} — {card.back}</span>
                      <button onClick={() => setDecks(decks.map(d => d.id === activeDeckId ? {...d, cards: d.cards.filter(c => c.id !== card.id)} : d))} className="text-slate-200 hover:text-rose-500"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Другие разделы */}
          {view === 'stats' && <div className="text-center py-20 animate-fade-in"><BarChart3 size={64} className="mx-auto text-slate-100 mb-6"/><h2 className="text-2xl font-black text-slate-800 tracking-tight">Ваш прогресс</h2></div>}
          {view === 'profile' && <div className="max-w-sm mx-auto bg-white p-10 rounded-[3rem] border border-slate-100 text-center shadow-sm animate-fade-in"><div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center font-black text-2xl">{userEmail[0]?.toUpperCase()}</div><h2 className="text-2xl font-black text-slate-800">{userEmail.split('@')[0]}</h2><p className="text-slate-400 text-xs font-bold uppercase mt-1">{userEmail}</p></div>}
          {view === 'about' && <div className="text-center max-w-lg mx-auto animate-fade-in py-10"><h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">LinguFlow</h2><p className="text-slate-500 leading-relaxed font-medium text-sm"> MVP-версия образовательной платформы для изучения языков.</p></div>}

        </div>
      </main>

      {/* MODAL: CREATE DECK */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-fade-in text-center border border-slate-100">
            <h2 className="text-2xl font-black mb-6 text-slate-800 tracking-tight">Новая колода</h2>
            <input autoFocus value={newDeckTitle} onChange={(e) => setNewDeckTitle(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none mb-6 font-medium text-center" placeholder="Название..." />
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Отмена</button>
              <button onClick={() => { if(newDeckTitle.trim()){ setDecks([...decks, { id: Date.now(), title: newDeckTitle, cards: [] }]); setNewDeckTitle(''); setIsModalOpen(false); }}} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg uppercase text-[10px] tracking-widest">Создать</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}