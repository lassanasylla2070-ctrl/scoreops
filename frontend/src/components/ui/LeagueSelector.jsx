import { LEAGUE_LIST } from '../../utils/constants';

export default function LeagueSelector({ selected, onChange, showAll = true }) {
  return (
    <div className="flex flex-wrap gap-2">
      {showAll && (
        <button
          onClick={() => onChange(null)}
          className={`btn text-xs px-3 py-1.5 ${
            !selected
              ? 'bg-accent-green text-white'
              : 'bg-surface border border-border text-text-secondary hover:border-border-light hover:text-text-primary'
          }`}
        >
          All Leagues
        </button>
      )}
      {LEAGUE_LIST.map((league) => (
        <button
          key={league.code}
          onClick={() => onChange(league.code)}
          className={`btn text-xs px-3 py-1.5 gap-1.5 ${
            selected === league.code
              ? 'bg-accent-green text-white'
              : 'bg-surface border border-border text-text-secondary hover:border-border-light hover:text-text-primary'
          }`}
        >
          <span>{league.flag}</span>
          <span className="hidden sm:inline">{league.name}</span>
          <span className="sm:hidden">{league.code}</span>
        </button>
      ))}
    </div>
  );
}
