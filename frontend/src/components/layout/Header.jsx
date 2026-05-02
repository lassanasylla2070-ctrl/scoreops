import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, X } from 'lucide-react';
import { playersApi, teamsApi } from '../../services/api';

export default function Header() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState({ teams: [], players: [] });
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate  = useNavigate();
  const inputRef  = useRef(null);
  const wrapperRef = useRef(null);
  const timerRef  = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults({ teams: [], players: [] }); setOpen(false); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const [teamsRes, playersRes] = await Promise.all([
          teamsApi.getAll({ q: query }),
          playersApi.getAll({ q: query, limit: 5 }),
        ]);
        setResults({
          teams:   (teamsRes.teams   || []).slice(0, 4),
          players: (playersRes.players || []).slice(0, 4),
        });
        setOpen(true);
      } catch { /* silently fail */ }
      setLoading(false);
    }, 350);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (path) => {
    setQuery(''); setOpen(false);
    navigate(path);
  };

  return (
    <header className="fixed top-0 right-0 left-60 h-[60px] z-30 bg-bg-secondary/90 backdrop-blur-sm border-b border-border flex items-center px-6 gap-4">
      {/* Search */}
      <div ref={wrapperRef} className="relative flex-1 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, players…"
            className="input pl-9 pr-8 h-9 text-sm"
          />
          {query && (
            <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && (results.teams.length > 0 || results.players.length > 0) && (
          <div className="absolute top-full mt-1 left-0 right-0 card border border-border-light py-1 shadow-card-hover animate-fade-in z-50">
            {results.teams.length > 0 && (
              <>
                <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Teams</p>
                {results.teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleSelect(`/teams/${team.id}`)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-hover text-left transition-colors"
                  >
                    {team.crest ? (
                      <img src={team.crest} alt="" className="w-5 h-5 object-contain" />
                    ) : (
                      <div className="w-5 h-5 rounded bg-surface-elevated" />
                    )}
                    <span className="text-sm text-text-primary">{team.name}</span>
                  </button>
                ))}
              </>
            )}
            {results.players.length > 0 && (
              <>
                <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted mt-1">Players</p>
                {results.players.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(`/players/${p.id}`)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-hover text-left transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-surface-elevated flex items-center justify-center text-[10px] text-text-muted">
                      {p.name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm text-text-primary">{p.name}</p>
                      <p className="text-[11px] text-text-muted">{p.position} · {p.team_name}</p>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-badge bg-accent-red/10 border border-accent-red/20">
          <span className="live-dot" />
          <span className="text-xs font-semibold text-accent-red">LIVE</span>
        </div>
      </div>
    </header>
  );
}
