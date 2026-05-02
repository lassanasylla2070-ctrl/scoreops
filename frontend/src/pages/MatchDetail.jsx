import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFetch } from '../hooks/usePolling';
import { matchesApi } from '../services/api';
import { formatMatchDate } from '../utils/formatters';
import { MATCH_STATUS } from '../utils/constants';

export default function MatchDetail() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(() => matchesApi.getById(id), [id]);
  const match = data?.match;

  if (loading) return <LoadingView />;
  if (error || !match) return <ErrorView error={error} />;

  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';
  const statusInfo = MATCH_STATUS[match.status] || { label: match.status, color: 'text-text-muted' };
  const homeWin = isFinished && match.home_score > match.away_score;
  const awayWin = isFinished && match.away_score > match.home_score;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <Link to="/scores" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary">
        <ArrowLeft size={14} /> Back to Scores
      </Link>

      {/* Main Score Card */}
      <div className="card p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-sm text-text-muted">{match.competition_name}</span>
          {match.matchday && <span className="text-text-muted">· Matchday {match.matchday}</span>}
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {isLive && <span className="live-dot" />}
          <span className={`text-sm font-bold ${statusInfo.color}`}>
            {isLive ? `${match.minute || ''}′ — LIVE` : statusInfo.label}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center justify-center gap-8">
          {/* Home */}
          <div className="flex-1 text-center">
            <TeamLogo crest={match.home_team_crest} name={match.home_team_name} size="lg" />
            <p className={`mt-2 font-bold text-lg ${homeWin ? 'text-text-primary' : 'text-text-secondary'}`}>
              {match.home_team_name}
            </p>
          </div>

          {/* Score */}
          <div className="text-center flex-shrink-0">
            {match.home_score != null ? (
              <div className="score-text text-5xl font-extrabold">
                <span className={homeWin ? 'text-text-primary' : 'text-text-secondary'}>{match.home_score}</span>
                <span className="text-text-muted mx-2">:</span>
                <span className={awayWin ? 'text-text-primary' : 'text-text-secondary'}>{match.away_score}</span>
              </div>
            ) : (
              <div className="text-3xl font-bold text-text-muted">vs</div>
            )}
            {match.home_score_ht != null && (
              <p className="text-sm text-text-muted mt-1">HT: {match.home_score_ht}–{match.away_score_ht}</p>
            )}
          </div>

          {/* Away */}
          <div className="flex-1 text-center">
            <TeamLogo crest={match.away_team_crest} name={match.away_team_name} size="lg" />
            <p className={`mt-2 font-bold text-lg ${awayWin ? 'text-text-primary' : 'text-text-secondary'}`}>
              {match.away_team_name}
            </p>
          </div>
        </div>

        {/* Date */}
        <p className="mt-5 text-text-muted text-sm">{formatMatchDate(match.utc_date)}</p>
      </div>

      {/* Goals */}
      {(match.goals || []).length > 0 && (
        <div className="card p-5">
          <h3 className="section-title mb-4">⚽ Goals</h3>
          <div className="space-y-2">
            {match.goals.map((g, i) => {
              const isHome = g.team?.id === match.home_team_id;
              return (
                <div key={i} className={`flex items-center gap-2 text-sm ${isHome ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span className="text-accent-green">⚽</span>
                  <span className="font-medium text-text-primary">{g.scorer?.name}</span>
                  {g.assist?.name && <span className="text-text-muted">(assist: {g.assist.name})</span>}
                  <span className="text-text-muted font-mono">{g.minute}′</span>
                  {g.type === 'PENALTY' && <span className="badge badge-yellow">P</span>}
                  {g.type === 'OWN_GOAL' && <span className="badge badge-red">OG</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bookings */}
      {(match.bookings || []).length > 0 && (
        <div className="card p-5">
          <h3 className="section-title mb-4">🟨 Cards</h3>
          <div className="space-y-2">
            {match.bookings.map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span>{b.card === 'RED_CARD' || b.card === 'SECOND_YELLOW_RED' ? '🟥' : '🟨'}</span>
                <span className="font-medium text-text-primary">{b.player?.name}</span>
                <span className="text-text-muted">{b.team?.name}</span>
                <span className="text-text-muted font-mono ml-auto">{b.minute}′</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TeamLogo({ crest, name, size = 'md' }) {
  const sz = size === 'lg' ? 'w-16 h-16' : 'w-10 h-10';
  if (crest) {
    return <img src={crest} alt={name} className={`${sz} object-contain mx-auto`} />;
  }
  return (
    <div className={`${sz} rounded-full bg-surface-elevated flex items-center justify-center text-xl font-bold text-text-muted mx-auto`}>
      {name?.[0]}
    </div>
  );
}

function LoadingView() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="skeleton h-5 w-32" />
      <div className="card p-6">
        <div className="skeleton h-4 w-40 mx-auto mb-5" />
        <div className="flex items-center justify-center gap-8">
          <div className="flex-1 text-center space-y-3">
            <div className="skeleton w-16 h-16 rounded-full mx-auto" />
            <div className="skeleton h-4 w-24 mx-auto" />
          </div>
          <div className="skeleton h-14 w-24" />
          <div className="flex-1 text-center space-y-3">
            <div className="skeleton w-16 h-16 rounded-full mx-auto" />
            <div className="skeleton h-4 w-24 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorView({ error }) {
  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/scores" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-6">
        <ArrowLeft size={14} /> Back to Scores
      </Link>
      <div className="card p-10 text-center">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-text-muted">{error || 'Match not found.'}</p>
      </div>
    </div>
  );
}
