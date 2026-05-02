import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useFetch } from '../hooks/usePolling';
import { playersApi } from '../services/api';
import PlayerCard from '../components/ui/PlayerCard';
import { PlayerSkeleton } from '../components/ui/LoadingSkeleton';
import { POSITIONS, LEAGUE_LIST } from '../utils/constants';

const TABS = [
  { key: 'browse',   label: '🔍 Browse'      },
  { key: 'scorers',  label: '⚽ Top Scorers'  },
  { key: 'assists',  label: '🎯 Top Assists'  },
];

export default function Players() {
  const [tab,      setTab]      = useState('browse');
  const [q,        setQ]        = useState('');
  const [position, setPosition] = useState('');
  const [league,   setLeague]   = useState('PL');
  const [page,     setPage]     = useState(1);
  const [debouncedQ, setDebouncedQ] = useState('');

  const timerRef = useState(null)[0];

  const handleSearch = (val) => {
    setQ(val);
    clearTimeout(timerRef);
    setTimeout(() => setDebouncedQ(val), 400);
    setPage(1);
  };

  const browseQuery = useFetch(
    () => playersApi.getAll({ q: debouncedQ, position, page, limit: 24 }),
    [debouncedQ, position, page]
  );

  const scorersQuery = useFetch(
    () => playersApi.getTopScorers({ league, limit: 30 }),
    [league]
  );

  const assistsQuery = useFetch(
    () => playersApi.getTopAssisters({ league, limit: 30 }),
    [league]
  );

  const activeQuery = tab === 'browse' ? browseQuery : tab === 'scorers' ? scorersQuery : assistsQuery;
  const { data, loading, error } = activeQuery;

  const players = (tab === 'browse' ? data?.players : data?.scorers) || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-header">Players</h1>
        <p className="text-text-secondary text-sm">Search player profiles, stats, and leaderboards</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface rounded-card p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-badge text-sm font-medium transition-all duration-150
              ${tab === key ? 'bg-accent-green text-white' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Browse filters */}
      {tab === 'browse' && (
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={q}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search players…"
              className="input pl-9 h-9 text-sm"
            />
          </div>
          <select
            value={position}
            onChange={(e) => { setPosition(e.target.value); setPage(1); }}
            className="input h-9 text-sm w-auto min-w-36 bg-surface cursor-pointer"
          >
            <option value="">All Positions</option>
            {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      )}

      {/* Leaderboard league selector */}
      {(tab === 'scorers' || tab === 'assists') && (
        <div className="flex flex-wrap gap-2">
          {LEAGUE_LIST.filter(l => l.code !== 'CL').map((l) => (
            <button
              key={l.code}
              onClick={() => setLeague(l.code)}
              className={`btn text-xs px-3 py-1.5 gap-1.5 ${league === l.code ? 'bg-accent-green text-white' : 'btn-outline'}`}
            >
              {l.flag} {l.name}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card p-4 border-accent-red/30 bg-accent-red/5 text-accent-red text-sm">⚠ {error}</div>
      )}

      {/* Leaderboard table */}
      {(tab === 'scorers' || tab === 'assists') && !loading && (
        <div className="card overflow-hidden">
          <table className="w-full standings-table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 w-10">#</th>
                <th className="text-left py-3 px-4">Player</th>
                <th className="text-left py-3 px-4">Team</th>
                <th className="py-3 px-4 text-center">Goals</th>
                <th className="py-3 px-4 text-center">Assists</th>
                <th className="py-3 px-4 text-center">Played</th>
              </tr>
            </thead>
            <tbody>
              {players.map((s, i) => (
                <tr key={s.player_id || i} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
                  <td className="py-3 px-4 text-text-muted font-mono text-sm">{i + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-surface-elevated flex items-center justify-center text-[11px] font-bold text-text-muted">
                        {s.player_name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{s.player_name}</p>
                        {s.player_nationality && (
                          <p className="text-[11px] text-text-muted">{s.player_nationality}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {s.team_crest && <img src={s.team_crest} alt="" className="w-5 h-5 object-contain" />}
                      <span className="text-sm text-text-secondary">{s.team_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-accent-green">{s.goals}</td>
                  <td className="py-3 px-4 text-center font-semibold text-accent-blue">{s.assists ?? '—'}</td>
                  <td className="py-3 px-4 text-center text-text-muted">{s.played_matches ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {players.length === 0 && (
            <div className="p-8 text-center text-text-muted">No data yet — backend is seeding.</div>
          )}
        </div>
      )}

      {/* Player grid */}
      {tab === 'browse' && (
        <>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => <PlayerSkeleton key={i} />)}
            </div>
          ) : players.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-text-muted">No players found. Backend is loading player data in the background.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {players.map((p) => <PlayerCard key={p.id} player={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline px-3 py-1.5 text-sm disabled:opacity-40"
              >← Prev</button>
              <span className="text-sm text-text-muted">Page {page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-outline px-3 py-1.5 text-sm disabled:opacity-40"
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
