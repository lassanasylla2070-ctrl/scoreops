import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { usePolling } from '../hooks/usePolling';
import { matchesApi } from '../services/api';
import MatchCard from '../components/ui/MatchCard';
import LeagueSelector from '../components/ui/LeagueSelector';
import { MatchSkeleton } from '../components/ui/LoadingSkeleton';
import { POLL_INTERVAL_LIVE, POLL_INTERVAL_MATCHES, LEAGUES } from '../utils/constants';

const TABS = [
  { key: 'live',     label: '🔴 Live'    },
  { key: 'today',    label: '📅 Today'   },
  { key: 'upcoming', label: '🗓 Upcoming' },
  { key: 'results',  label: '✅ Results'  },
];

export default function Scores() {
  const [tab,    setTab]    = useState('today');
  const [league, setLeague] = useState(null);

  // Live matches — poll every 30s
  const liveQuery = usePolling(() => matchesApi.getLive(), POLL_INTERVAL_LIVE, []);

  // Today's matches — poll every 60s
  const todayQuery = usePolling(() => matchesApi.getToday(), POLL_INTERVAL_MATCHES, []);

  // Upcoming — poll every 5min
  const upcomingQuery = usePolling(() => matchesApi.getUpcoming(), 5 * 60000, []);

  // Results (last 7 days)
  const resultsQuery = usePolling(
    () => {
      const to = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      return matchesApi.getAll({ dateFrom: from, dateTo: to, status: 'FINISHED' });
    },
    5 * 60000,
    []
  );

  const queries = {
    live:     liveQuery,
    today:    todayQuery,
    upcoming: upcomingQuery,
    results:  resultsQuery,
  };

  const { data, loading, error, refetch } = queries[tab];

  const allMatches = (
    tab === 'results' ? data?.matches :
    tab === 'live'    ? data?.matches :
    tab === 'today'   ? data?.matches :
                        data?.matches
  ) || [];

  const filtered = league
    ? allMatches.filter((m) => m.competition_id === LEAGUES[league]?.id)
    : allMatches;

  // Group by competition
  const grouped = filtered.reduce((acc, m) => {
    const key = m.competition_name || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-header">Scores</h1>
          <p className="text-text-secondary text-sm">Live and scheduled matches across all major leagues</p>
        </div>
        <button onClick={refetch} className="btn-ghost gap-2 text-sm flex-shrink-0" title="Refresh">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface rounded-card p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-badge text-sm font-medium transition-all duration-150
              ${tab === key
                ? 'bg-accent-green text-white shadow'
                : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            {label}
            {key === 'live' && liveQuery.data?.count > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent-red text-white text-[10px] font-bold">
                {liveQuery.data.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* League filter */}
      <LeagueSelector selected={league} onChange={setLeague} />

      {/* Error */}
      {error && (
        <div className="card p-4 border-accent-red/30 bg-accent-red/5 text-accent-red text-sm">
          ⚠ {error} — Make sure the backend is running.
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => <MatchSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-4xl mb-3">🏟</p>
          <p className="text-text-muted">No matches found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([competition, matches]) => (
            <div key={competition}>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                {competition}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {matches.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Auto-refresh notice */}
      {tab === 'live' && (
        <p className="text-center text-[12px] text-text-muted">
          ↻ Live scores update automatically every 30 seconds
        </p>
      )}
    </div>
  );
}
