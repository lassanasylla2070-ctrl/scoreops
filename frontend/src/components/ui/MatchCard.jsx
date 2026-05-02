import { Link } from 'react-router-dom';
import { formatMatchDate, formatKickoffTime } from '../../utils/formatters';
import { MATCH_STATUS } from '../../utils/constants';

export default function MatchCard({ match }) {
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';
  const isScheduled = match.status === 'SCHEDULED' || match.status === 'TIMED';
  const statusInfo = MATCH_STATUS[match.status] || { label: match.status, color: 'text-text-muted' };

  const homeWin = isFinished && match.home_score > match.away_score;
  const awayWin = isFinished && match.away_score > match.home_score;

  return (
    <Link
      to={`/matches/${match.id}`}
      className="card card-hover block p-4 animate-fade-in group"
    >
      {/* League + Time */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-text-muted font-medium truncate">
          {match.competition_name}
          {match.matchday ? ` · MD ${match.matchday}` : ''}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isLive && <span className="live-dot" />}
          <span className={`text-[11px] font-semibold ${statusInfo.color}`}>
            {isLive ? `${match.minute || ''}′` : statusInfo.label}
          </span>
        </div>
      </div>

      {/* Teams + Score */}
      <div className="space-y-2">
        {/* Home */}
        <div className="flex items-center gap-3">
          <TeamCrest crest={match.home_team_crest} name={match.home_team_name} />
          <span className={`flex-1 text-sm font-medium truncate ${homeWin ? 'text-text-primary' : isFinished ? 'text-text-secondary' : 'text-text-primary'}`}>
            {match.home_team_name}
          </span>
          {!isScheduled && (
            <span className={`score-text text-xl ${homeWin ? 'text-text-primary' : 'text-text-secondary'}`}>
              {match.home_score ?? '—'}
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center gap-3">
          <TeamCrest crest={match.away_team_crest} name={match.away_team_name} />
          <span className={`flex-1 text-sm font-medium truncate ${awayWin ? 'text-text-primary' : isFinished ? 'text-text-secondary' : 'text-text-primary'}`}>
            {match.away_team_name}
          </span>
          {!isScheduled && (
            <span className={`score-text text-xl ${awayWin ? 'text-text-primary' : 'text-text-secondary'}`}>
              {match.away_score ?? '—'}
            </span>
          )}
        </div>
      </div>

      {/* Kickoff time for scheduled */}
      {isScheduled && (
        <div className="mt-3 pt-3 border-t border-border text-center">
          <span className="text-sm text-text-secondary font-medium">
            {formatMatchDate(match.utc_date)}
          </span>
        </div>
      )}

      {/* HT Score */}
      {isFinished && match.home_score_ht != null && (
        <div className="mt-2 text-center">
          <span className="text-[11px] text-text-muted">
            HT: {match.home_score_ht}–{match.away_score_ht}
          </span>
        </div>
      )}
    </Link>
  );
}

function TeamCrest({ crest, name }) {
  if (crest) {
    return (
      <img
        src={crest}
        alt={name}
        className="w-7 h-7 object-contain flex-shrink-0"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-surface-elevated flex items-center justify-center text-[11px] font-bold text-text-muted flex-shrink-0">
      {name?.[0]}
    </div>
  );
}
