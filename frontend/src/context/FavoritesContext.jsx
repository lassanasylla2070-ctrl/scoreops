import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fb_favorites') || '{"teams":[],"players":[]}');
    } catch {
      return { teams: [], players: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem('fb_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleTeam = (team) => {
    setFavorites((prev) => {
      const exists = prev.teams.some((t) => t.id === team.id);
      return {
        ...prev,
        teams: exists
          ? prev.teams.filter((t) => t.id !== team.id)
          : [...prev.teams, { id: team.id, name: team.name, crest: team.crest }],
      };
    });
  };

  const togglePlayer = (player) => {
    setFavorites((prev) => {
      const exists = prev.players.some((p) => p.id === player.id);
      return {
        ...prev,
        players: exists
          ? prev.players.filter((p) => p.id !== player.id)
          : [...prev.players, { id: player.id, name: player.name }],
      };
    });
  };

  const isTeamFav   = (id) => favorites.teams.some((t) => t.id === id);
  const isPlayerFav = (id) => favorites.players.some((p) => p.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleTeam, togglePlayer, isTeamFav, isPlayerFav }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
