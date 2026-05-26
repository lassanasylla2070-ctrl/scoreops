import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetch } from '../hooks/usePolling';
import { standingsApi } from '../services/api';
import StandingsTable from '../components/ui/StandingsTable';
import { StandingsSkeleton } from '../components/ui/LoadingSkeleton';
import { LEAGUE_LIST } from '../utils/constants';

export default function Standings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeLeague, setActiveLeague] = useState(searchParams.get('league') || 'PL');

  useEffect(() => {
    const league = searchParams.get('league');
    if (league) setActiveLeague(league);
  }, [searchParams]);

  const { data, loading, error } = useFetch(() => standingsApi.getAll(), []);

  const standings = data?.standings || {};
  const current = standings[activeLeague];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Standings</h1>
        <p className="text-text-secondary text-sm">Current season league tables</p>
      </div>

      {/* League Tabs */}
      <div className="flex flex-wrap gap-2">
        {LEAGUE_LIST.map((league) => (
          <button
            key={league.code}
            onClick={() => setActiveLeague(league.code)}
            className={`flex items-center gap-2 px-4 py-2 rounded-card text-sm font-medium transition-all duration-150
              ${activeLeague === league.code
                ? 'bg-surface-elevated border border-border-light text-text-primary shadow'
                : 'text-text-muted hover:text-text-primary'
              }`}
          >
            <span className="text-lg">{league.flag}</span>
            <span className="hidden sm:inline">{league.name}</span>
            <span className="sm:hidden font-bold">{league.code}</span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="card p-4 border-accent-red/30 bg-accent-red/5 text-accent-red text-sm">
          ⚠ {error} — Backend may still be seeding data. Try refreshing in a minute.
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-4"><StandingsSkeleton /></div>
        ) : !current ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-text-muted">No standings data yet — backend is still fetching from the API.</p>
          </div>
        ) : (
          <>
            {/* League header */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <span className="text-2xl">
                {LEAGUE_LIST.find((l) => l.code === activeLeague)?.flag}
              </span>
              <div>
                <h2 className="font-bold text-text-primary">
                  {LEAGUE_LIST.find((l) => l.code === activeLeague)?.name}
                </h2>
                <p className="text-xs text-text-muted">
                  {current.table?.length} teams · Updated {current.updatedAt ? new Date(current.updatedAt * 1000).toLocaleDateString() : 'recently'}
                </p>
              </div>
            </div>
            <StandingsTable table={current.table || []} />
          </>
        )}
      </div>
    </div>
  );
}
