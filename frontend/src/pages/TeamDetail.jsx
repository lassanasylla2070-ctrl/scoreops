import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Globe, MapPin, Calendar } from 'lucide-react';
import { useFetch } from '../hooks/usePolling';
import { teamsApi } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import MatchCard from '../components/ui/MatchCard';
import { POSITION_SHORT } from '../utils/constants';

export default function TeamDetail() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(() => teamsApi.getById(id), [id]);
  const { isTeamFav, toggleTeam } = useFavorites();

  if (loading) return <LoadingView />;
  if (error || !data) return <ErrorView error={error} />;

  const { team, players = [], recentMatches = [], upcomingMatches = [] } = data;
  const isFav = isTeamFav(team?.id);

  const grouped = players.reduce((acc, p) => {
    const pos = p.position || 'Unknown';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(p);
    return acc;
  }, {});

  const posOrder = ['Goalkeeper', 'Centre-Back', 'Left-Back', 'Right-Back', 'Defensive Midfield', 'Central Midfield', 'Attacking Midfield', 'Left Winger', 'Right Winger', 'Centre-Forward'];

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/teams" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary">
        <ArrowLeft size={14} /> Back to Teams
      </Link>

      {/* Club header */}
      <div className="card p-6">
        <div className="flex items-start gap-5">
          {team?.crest ? (
            <img src={team.crest} alt={team.name} className="w-20 h-20 object-contain flex-shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-surface-elevated flex items-center justify-center text-3xl font-bold text-text-muted flex-shrink-0">
              {team?.tla || team?.name?.[0]}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-text-primary">{team?.name}</h1>
                {team?.coach_name && (
                  <p className="text-text-secondary text-sm mt-0.5">Manager: {team.coach_name}</p>
                )}
              </div>
              <button
                onClick={() => toggleTeam(team)}
                className="btn-ghost p-2 flex-shrink-0"
              >
                <Star size={18} fill={isFav ? '#fbbf24' : 'none'} className={isFav ? 'text-accent-yellow' : ''} />
              </button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-text-secondary">
              {team?.founded && <span>🏟 Est. {team.founded}</span>}
              {team?.venue   && <span>📍 {team.venue}</span>}
              {team?.website && (
                <a href={team.website} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 hover:text-accent-green transition-colors">
                  <Globe size={13} /> Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Squad */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="section-title">👥 Squad</h2>
          {players.length === 0 ? (
            <div className="card p-6 text-center text-text-muted">No squad data yet.</div>
          ) : (
            posOrder
              .filter((pos) => grouped[pos]?.length)
              .map((pos) => (
                <div key={pos}>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{pos}</p>
                  <div className="card overflow-hidden">
                    {grouped[pos].map((p, i) => (
                      <Link
                        key={p.id}
                        to={`/players/${p.id}`}
                        className={`flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors text-sm ${i > 0 ? 'border-t border-border/40' : ''}`}
                      >
                        {p.shirt_number && (
                          <span className="text-[12px] font-mono text-text-muted w-6 text-center">{p.shirt_number}</span>
                        )}
                        <span className="font-medium text-text-primary flex-1">{p.name}</span>
                        <span className="text-text-muted text-[12px]">{p.nationality}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Sidebar: Recent + Upcoming */}
        <div className="space-y-5">
          {recentMatches.length > 0 && (
            <div>
              <h2 className="section-title mb-3">📋 Recent Results</h2>
              <div className="space-y-2">
                {recentMatches.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </div>
          )}
          {upcomingMatches.length > 0 && (
            <div>
              <h2 className="section-title mb-3">🗓 Next Fixtures</h2>
              <div className="space-y-2">
                {upcomingMatches.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-5 w-32" />
      <div className="card p-6">
        <div className="flex gap-5">
          <div className="skeleton w-20 h-20 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-7 w-48" />
            <div className="skeleton h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorView({ error }) {
  return (
    <div>
      <Link to="/teams" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-6">
        <ArrowLeft size={14} /> Back to Teams
      </Link>
      <div className="card p-10 text-center">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-text-muted">{error || 'Team not found.'}</p>
      </div>
    </div>
  );
}
