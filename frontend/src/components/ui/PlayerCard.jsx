import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { POSITION_SHORT } from '../../utils/constants';

export default function PlayerCard({ player }) {
  const { isPlayerFav, togglePlayer } = useFavorites();
  const isFav = isPlayerFav(player.id);
  const posShort = POSITION_SHORT[player.position] || player.position?.slice(0, 2).toUpperCase() || '?';

  return (
    <div className="card card-hover relative overflow-hidden group animate-fade-in">
      {/* Fav button */}
      <button
        onClick={(e) => { e.preventDefault(); togglePlayer(player); }}
        className="absolute top-3 right-3 z-10 p-1 rounded hover:bg-surface-hover transition-colors"
        aria-label="Toggle favourite"
      >
        <Star size={14} fill={isFav ? '#fbbf24' : 'none'} className={isFav ? 'text-accent-yellow' : 'text-text-muted'} />
      </button>

      <Link to={`/players/${player.id}`} className="block p-4">
        {/* Avatar + Position badge */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-xl font-bold text-text-muted">
              {player.name?.[0]}
            </div>
            <span className="absolute -bottom-1 -right-1 badge badge-blue text-[9px] px-1 py-0">
              {posShort}
            </span>
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="font-semibold text-sm text-text-primary truncate">{player.name}</p>
            {player.team_name && (
              <p className="text-[12px] text-text-secondary truncate mt-0.5">{player.team_name}</p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12px]">
          {player.nationality && (
            <span className="text-text-muted">🌍 {player.nationality}</span>
          )}
          {player.position && (
            <span className="text-text-muted truncate">📌 {player.position}</span>
          )}
        </div>
      </Link>
    </div>
  );
}
