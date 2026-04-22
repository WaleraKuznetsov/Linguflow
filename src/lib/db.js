import { supabase } from './supabase';

const INITIAL_DECKS = [
  {
    title: 'Beginner (A1-A2)',
    description: 'Базовые слова для начинающих',
    cards: [
      { front: 'House', back: 'Дом' },
      { front: 'Water', back: 'Вода' },
      { front: 'Friend', back: 'Друг' },
      { front: 'School', back: 'Школа' },
      { front: 'Apple', back: 'Яблоко' },
      { front: 'Work', back: 'Работа' },
      { front: 'Family', back: 'Семья' },
      { front: 'Time', back: 'Время' },
      { front: 'Street', back: 'Улица' },
      { front: 'City', back: 'Город' },
      { front: 'Book', back: 'Книга' },
      { front: 'Money', back: 'Деньги' },
      { front: 'Food', back: 'Еда' },
      { front: 'Hand', back: 'Рука' },
      { front: 'Day', back: 'День' }
    ]
  },
  {
    title: 'Intermediate (B1-B2)',
    description: 'Средний уровень для продолжающих',
    cards: [
      { front: 'Adventure', back: 'Приключение' },
      { front: 'Behavior', back: 'Поведение' },
      { front: 'Challenge', back: 'Вызов' },
      { front: 'Decision', back: 'Решение' },
      { front: 'Environment', back: 'Окружающая среда' },
      { front: 'Frequency', back: 'Частота' },
      { front: 'Growth', back: 'Рост' },
      { front: 'Habit', back: 'Привычка' },
      { front: 'Influence', back: 'Влияние' },
      { front: 'Justice', back: 'Справедливость' },
      { front: 'Knowledge', back: 'Знание' },
      { front: 'Landscape', back: 'Пейзаж' },
      { front: 'Measure', back: 'Мера' },
      { front: 'Negotiate', back: 'Вести переговоры' },
      { front: 'Opportunity', back: 'Возможность' },
      { front: 'Purpose', back: 'Цель' },
      { front: 'Quality', back: 'Качество' },
      { front: 'Reliable', back: 'Надежный' }
    ]
  },
  {
    title: 'Advanced (C1-C2)',
    description: 'Продвинутый уровень для экспертов',
    cards: [
      { front: 'Ambiguity', back: 'Двусмысленность' },
      { front: 'Benevolent', back: 'Доброжелательный' },
      { front: 'Conundrum', back: 'Головоломка' },
      { front: 'Dichotomy', back: 'Дихотомия' },
      { front: 'Ephemeral', back: 'Эфемерный' },
      { front: 'Frivolous', back: 'Легкомысленный' },
      { front: 'Gregarious', back: 'Общительный' },
      { front: 'Hegemony', back: 'Гегемония' },
      { front: 'Inevitable', back: 'Неизбежный' },
      { front: 'Juxtaposition', back: 'Сопоставление' },
      { front: 'Loquacious', back: 'Многоречивый' },
      { front: 'Meticulous', back: 'Дотошный' },
      { front: 'Nefarious', back: 'Гнусный' },
      { front: 'Obsequious', back: 'Подобострастный' },
      { front: 'Paradigm', back: 'Парадигма' },
      { front: 'Resilience', back: 'Устойчивость' },
      { front: 'Ubiquitous', back: 'Вездесущий' }
    ]
  }
];

export async function createInitialDecks(userId) {
  const createdDecks = [];

  for (const deckData of INITIAL_DECKS) {
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .insert({
        user_id: userId,
        title: deckData.title,
        description: deckData.description
      })
      .select()
      .single();

    if (deckError || !deck) {
      console.error('Error creating deck:', deckError);
      continue;
    }

    const cardsToInsert = deckData.cards.map(card => ({
      deck_id: deck.id,
      front: card.front,
      back: card.back
    }));

    const { data: insertedCards, error: cardsError } = await supabase
      .from('cards')
      .insert(cardsToInsert)
      .select();

    if (cardsError) {
      console.error('Error creating cards:', cardsError);
    }

    createdDecks.push({
      ...deck,
      cards: insertedCards || []
    });
  }

  return createdDecks;
}

export async function fetchDecks(userId) {
  const { data: decks, error: decksError } = await supabase
    .from('decks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (decksError) {
    console.error('Error fetching decks:', decksError);
    return [];
  }

  if (!decks || decks.length === 0) {
    return [];
  }

  const decksWithCards = await Promise.all(
    decks.map(async (deck) => {
      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deck.id)
        .order('id', { ascending: true });

      if (cardsError) {
        console.error('Error fetching cards:', cardsError);
        return { ...deck, cards: [] };
      }

      return { ...deck, cards: cards || [] };
    })
  );

  return decksWithCards;
}

export async function createDeck(userId, title, description = '') {
  const { data, error } = await supabase
    .from('decks')
    .insert({
      user_id: userId,
      title,
      description
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating deck:', error);
    return { error: error.message };
  }

  return { data: { ...data, cards: [] } };
}

export async function deleteDeck(deckId) {
  const { error } = await supabase
    .from('decks')
    .delete()
    .eq('id', deckId);

  if (error) {
    console.error('Error deleting deck:', error);
    return { error: error.message };
  }

  return { success: true };
}

export async function addCard(deckId, front, back) {
  const { data, error } = await supabase
    .from('cards')
    .insert({
      deck_id: deckId,
      front,
      back
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding card:', error);
    return { error: error.message };
  }

  return { data };
}

export async function deleteCard(cardId) {
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId);

  if (error) {
    console.error('Error deleting card:', error);
    return { error: error.message };
  }

  return { success: true };
}

export async function updateDeck(deckId, title, description) {
  const { data, error } = await supabase
    .from('decks')
    .update({ title, description })
    .eq('id', deckId)
    .select()
    .single();

  if (error) {
    console.error('Error updating deck:', error);
    return { error: error.message };
  }

  return { data };
}

function calculateSM2(easeFactor, intervalDays, repetitions, rating) {
  if (rating === 0) {
    return {
      ease_factor: Math.max(1.3, easeFactor - 0.2),
      interval_days: 1,
      repetitions: 0
    };
  }

  if (rating === 1) {
    const newInterval = Math.max(1, Math.ceil(intervalDays * easeFactor * 0.7));
    return {
      ease_factor: Math.max(1.3, easeFactor - 0.15),
      interval_days: newInterval,
      repetitions: repetitions + 1
    };
  }

  if (rating === 2) {
    let newInterval;
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.ceil(intervalDays * easeFactor);

    return {
      ease_factor: easeFactor,
      interval_days: newInterval,
      repetitions: repetitions + 1
    };
  }

  const newInterval = Math.ceil(intervalDays * easeFactor * 1.3);
  return {
    ease_factor: easeFactor + 0.15,
    interval_days: Math.max(newInterval, 1),
    repetitions: repetitions + 1
  };
}

export async function upsertCardProgress(userId, cardId, rating) {
  const { data: existing } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('card_id', cardId)
    .maybeSingle();

  const current = existing || {
    ease_factor: 2.5,
    interval_days: 0,
    repetitions: 0
  };

  const { ease_factor, interval_days, repetitions } = calculateSM2(
    current.ease_factor,
    current.interval_days,
    current.repetitions,
    rating
  );

  const now = new Date();
  const nextReview = new Date(now.getTime() + interval_days * 24 * 60 * 60 * 1000);

  const progressData = {
    user_id: userId,
    card_id: cardId,
    ease_factor,
    interval_days,
    repetitions,
    last_reviewed: now.toISOString(),
    next_review: nextReview.toISOString()
  };

  if (existing) {
    const { data, error } = await supabase
      .from('progress')
      .update(progressData)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating progress:', error);
      return { error: error.message };
    }
    return { data };
  }

  const { data, error } = await supabase
    .from('progress')
    .insert(progressData)
    .select()
    .single();

  if (error) {
    console.error('Error inserting progress:', error);
    return { error: error.message };
  }
  return { data };
}

export async function fetchDueCards(deckId) {
  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('*, progress:progress(*)')
    .eq('deck_id', deckId)
    .order('id', { ascending: true });

  if (cardsError) {
    console.error('Error fetching due cards:', cardsError);
    return [];
  }

  const now = new Date().toISOString();
  return (cards || []).filter(card => {
    const p = card.progress?.[0];
    if (!p) return true;
    return p.next_review <= now;
  });
}

export async function incrementStatistics(userId, field) {
  const today = new Date().toISOString().split('T')[0];

  const { data: existing } = await supabase
    .from('statistics')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  if (existing) {
    const update = {};
    update[field] = existing[field] + 1;

    const { error } = await supabase
      .from('statistics')
      .update(update)
      .eq('id', existing.id);

    if (error) console.error('Error updating statistics:', error);
    return;
  }

  const insert = {
    user_id: userId,
    date: today,
    cards_learned: 0,
    cards_reviewed: 0,
    time_spent_minutes: 0
  };
  insert[field] = 1;

  const { error } = await supabase
    .from('statistics')
    .insert(insert);

  if (error) console.error('Error inserting statistics:', error);
}

export async function fetchStatistics(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('statistics')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDateStr)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching statistics:', error);
    return [];
  }

  const result = [];
  for (let i = 0; i <= days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const existing = data?.find(s => s.date === dateStr);

    result.push({
      date: dateStr,
      day: d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' }),
      cards_learned: existing?.cards_learned || 0,
      cards_reviewed: existing?.cards_reviewed || 0,
      time_spent_minutes: existing?.time_spent_minutes || 0
    });
  }

  return result;
}

export async function fetchProgressStats(userId) {
  const { data: progressData, error } = await supabase
    .from('progress')
    .select('ease_factor, repetitions, next_review')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching progress stats:', error);
    return { total: 0, learned: 0, dueToday: 0, avgEase: 0 };
  }

  const now = new Date().toISOString();
  const total = progressData?.length || 0;
  const learned = progressData?.filter(p => p.repetitions >= 2).length || 0;
  const dueToday = progressData?.filter(p => p.next_review <= now).length || 0;
  const avgEase = total > 0
    ? progressData.reduce((sum, p) => sum + p.ease_factor, 0) / total
    : 0;

  return { total, learned, dueToday, avgEase };
}

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function upsertProfile(userId, updates) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return { error: error.message };
    }
    return { data };
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, ...updates })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return { error: error.message };
  }
  return { data };
}

const ACHIEVEMENTS = [
  { id: 'streak_3', title: 'Ученик', desc: '3 дня подряд', icon: 'flame', category: 'streak', threshold: 3 },
  { id: 'streak_7', title: 'Привычка', desc: '7 дней подряд', icon: 'flame', category: 'streak', threshold: 7 },
  { id: 'streak_14', title: 'Настойчивость', desc: '14 дней подряд', icon: 'flame', category: 'streak', threshold: 14 },
  { id: 'streak_30', title: 'Мастер дисциплины', desc: '30 дней подряд', icon: 'flame', category: 'streak', threshold: 30 },
  { id: 'cards_10', title: 'Первые шаги', desc: '10 карточек изучено', icon: 'book', category: 'volume', threshold: 10 },
  { id: 'cards_50', title: 'Полусотня', desc: '50 карточек изучено', icon: 'book', category: 'volume', threshold: 50 },
  { id: 'cards_100', title: 'Сотня', desc: '100 карточек изучено', icon: 'book', category: 'volume', threshold: 100 },
  { id: 'cards_500', title: 'Энциклопедия', desc: '500 карточек изучено', icon: 'book', category: 'volume', threshold: 500 },
  { id: 'mastery_10', title: 'Знаток', desc: '10 слов освоено', icon: 'star', category: 'mastery', threshold: 10 },
  { id: 'mastery_50', title: 'Эксперт', desc: '50 слов освоено', icon: 'star', category: 'mastery', threshold: 50 },
  { id: 'mastery_100', title: 'Мастер', desc: '100 слов освоено', icon: 'star', category: 'mastery', threshold: 100 },
  { id: 'decks_3', title: 'Коллекционер', desc: '3 колоды созданы', icon: 'layers', category: 'collection', threshold: 3 },
  { id: 'decks_5', title: 'Библиотекарь', desc: '5 колод созданы', icon: 'layers', category: 'collection', threshold: 5 }
];

export async function fetchAchievements(userId) {
  const [progressData, statsData, deckData] = await Promise.all([
    supabase.from('progress').select('repetitions').eq('user_id', userId),
    supabase.from('statistics').select('date, cards_learned, cards_reviewed').eq('user_id', userId).order('date', { ascending: false }),
    supabase.from('decks').select('id', { count: 'exact', head: true }).eq('user_id', userId)
  ]);

  const learned = progressData.data?.filter(p => p.repetitions >= 2).length || 0;
  const totalCardsStudied = progressData.data?.length || 0;
  const deckCount = deckData.count || 0;

  const streak = calculateStreakFromStats(statsData.data || []);

  const values = {
    streak,
    volume: totalCardsStudied,
    mastery: learned,
    collection: deckCount
  };

  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: values[a.category] >= a.threshold,
    current: values[a.category],
    progress: Math.min(100, Math.round((values[a.category] / a.threshold) * 100))
  }));
}

function calculateStreakFromStats(stats) {
  if (!stats || stats.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeDays = new Set(
    stats.filter(s => s.cards_learned > 0 || s.cards_reviewed > 0).map(s => s.date)
  );

  const checkDate = new Date(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (!activeDays.has(today.toISOString().split('T')[0]) && !activeDays.has(yesterday.toISOString().split('T')[0])) {
    return 0;
  }

  if (!activeDays.has(today.toISOString().split('T')[0])) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (activeDays.has(checkDate.toISOString().split('T')[0])) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}
