import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchDecks,
  createDeck as dbCreateDeck,
  deleteDeck as dbDeleteDeck,
  addCard as dbAddCard,
  deleteCard as dbDeleteCard,
  createInitialDecks,
  upsertCardProgress,
  fetchDueCards as dbFetchDueCards,
  incrementStatistics
} from '@/lib/db';

const DecksContext = createContext({});

export const useDecks = () => {
  const context = useContext(DecksContext);
  if (!context) {
    throw new Error('useDecks must be used within DecksProvider');
  }
  return context;
};

export const DecksProvider = ({ children }) => {
  const { user } = useAuth();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadDecks = async () => {
      if (!user) {
        if (isMounted) {
          setDecks([]);
          setLoading(false);
        }
        return;
      }

      if (isMounted) setLoading(true);

      try {
        const loadedDecks = await fetchDecks(user.id);

        if (!isMounted) return;

        if (loadedDecks && loadedDecks.length > 0) {
          setDecks(loadedDecks);
        } else {
          const initialDecks = await createInitialDecks(user.id);
          if (isMounted) {
            setDecks(initialDecks || []);
          }
        }
      } catch (err) {
        console.error('Error loading decks:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDecks();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const createDeck = async (title, description = '') => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await dbCreateDeck(user.id, title, description);

    if (error) {
      console.error('Error creating deck:', error);
      return { error };
    }

    if (data) {
      setDecks(prev => [...prev, data]);
    }
    return { data };
  };

  const deleteDeck = async (deckId) => {
    const { error } = await dbDeleteDeck(deckId);

    if (error) {
      console.error('Error deleting deck:', error);
      return { error };
    }

    setDecks(prev => prev.filter(d => d.id !== deckId));
    return { success: true };
  };

  const addCard = async (deckId, front, back) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await dbAddCard(deckId, front, back);

    if (error) {
      console.error('Error adding card:', error);
      return { error };
    }

    if (data) {
      setDecks(prev => prev.map(deck => {
        if (deck.id === deckId) {
          return { ...deck, cards: [...(deck.cards || []), data] };
        }
        return deck;
      }));
    }
    return { data };
  };

  const deleteCard = async (deckId, cardId) => {
    const { error } = await dbDeleteCard(cardId);

    if (error) {
      console.error('Error deleting card:', error);
      return { error };
    }

    setDecks(prev => prev.map(deck => {
      if (deck.id === deckId) {
        return { ...deck, cards: (deck.cards || []).filter(c => c.id !== cardId) };
      }
      return deck;
    }));

    return { success: true };
  };

  const rateCard = async (cardId, rating) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await upsertCardProgress(user.id, cardId, rating);

    if (error) {
      console.error('Error rating card:', error);
      return { error };
    }

    const statField = rating >= 2 ? 'cards_learned' : 'cards_reviewed';
    await incrementStatistics(user.id, statField);

    return { data };
  };

  const fetchDueCardsForDeck = async (deckId) => {
    if (!user) return [];
    return dbFetchDueCards(deckId);
  };

  const refreshDecks = () => {
    if (user) {
      setLoading(true);
      fetchDecks(user.id).then(loadedDecks => {
        setDecks(loadedDecks || []);
        setLoading(false);
      });
    }
  };

  const value = {
    decks,
    loading,
    error,
    createDeck,
    deleteDeck,
    addCard,
    deleteCard,
    rateCard,
    fetchDueCardsForDeck,
    refreshDecks
  };

  return (
    <DecksContext.Provider value={value}>
      {children}
    </DecksContext.Provider>
  );
};
