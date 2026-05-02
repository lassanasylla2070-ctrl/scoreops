import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { useFetch } from '../hooks/usePolling';
import { teamsApi } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { LEAGUE_LIST } from '../utils/constants';

export default function Teams() {
  const [league, setLeague] = useState('PL');
  const [q, setQ] = useState('');
  const { data, loading } = useFetch(
    () => teamsApi.getAll({ league }),
    [league]
  );

  const teams = (data?.teams || []).filter(
    (t) => !q || t.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Teams</h1>
        <p className="text-text-secondary text-sm">Squad information, fixtures, and club stats</p>
      </div>

      {/* League filter */}
      <div className="flex flex-wrap gap-2">
        {LEAGUE_LIST.filter(l => l.code !== 'CL').map((l) => (
          <button
            key={l.code}
            onClick={() => setLeague(l.code)}
            className={`flex items-center gap-2 px-4 py-2 rounded-card text-sm font-medium transition-all
              ${league === l.code
                ? 'bg-surface-elevated border border-border-light text-text-primary'
                : 'text-text-muted hover:text-text-primary'
              }`}
          >
            <span className="text-lg">{l.flag}</span>
            <span className="hidden sm:inline">{l.name}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search teams…" className="input pl-9 h-9 text-sm" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="skeleton w-16 h-16 rounded-full mx-auto" />
              <div className="skeleton h-4 w-3/4 mx-auto" />
              <div className="skeleton h-3 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {teams.map((team) => <TeamCard key={team.id} team={team} />)}
        </div>
      )}

      {!loading && teams.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-4xl mb-3">🏟</p>
          <p className="text-text-muted">No teams found. Data is loading from the API…</p>
        </div>
      )}
    </div>
  );
}

function TeamCard({ team }) {
  const { isTeamFav, toggleTeam } = useFavorites();
  const fav = isTeamFav(team.id);

  return (
    <div className="card card-hover relative group text-center animate-fade-in">
      <button
        onClick={(e) => { e.preventDefault(); toggleTeam(team); }}
        className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-hover"
      >
        <Star size={13} fill={fav ? '#fbbf24' : 'none'} className={fav ? 'text-accent-yellow' : 'text-text-muted'} />
      </button>

      <Link to={`/teams/${team.id}`} className="block p-4">
        {team.crest ? (
          <img src={team.crest} alt={team.name} className="w-16 h-16 object-contain mx-auto mb-3" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-surface-elevated mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-text-muted">
            {team.tla || team.name?.[0]}
          </div>
        )}
        <p className="text-sm font-semibold text-text-primary leading-snug">{team.short_name || team.name}</p>
        {team.founded && (
          <p className="text-[11px] text-text-muted mt-0.5">Est. {team.founded}</p>
        )}
        {team.venue && (
          <p className="text-[11px] text-text-muted mt-0.5 truncate">🏟 {team.venue}</p>
        )}
      </Link>
    </div>
  );
}
