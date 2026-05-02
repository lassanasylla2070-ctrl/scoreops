import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export default function StandingsTable({ table = [], highlightTeamId }) {
  if (!table.length) {
    return <p className="text-text-muted text-sm py-4 text-center">No standings data available yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full standings-table">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 w-8">#</th>
            <th className="text-left py-2 px-3">Team</th>
            <th className="py-2 px-2 text-center">P</th>
            <th className="py-2 px-2 text-center">W</th>
            <th className="py-2 px-2 text-center">D</th>
            <th className="py-2 px-2 text-center">L</th>
            <th className="py-2 px-2 text-center">GF</th>
            <th className="py-2 px-2 text-center">GA</th>
            <th className="py-2 px-2 text-center">GD</th>
            <th className="py-2 px-3 text-center font-bold">Pts</th>
            <th className="py-2 px-3 hidden md:table-cell">Form</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, idx) => {
            const isHighlighted = highlightTeamId && row.team_id === highlightTeamId;
            const zone = getZone(row.position, table.length);

            return (
              <tr
                key={row.team_id || idx}
                className={`border-b border-border/50 transition-colors ${
                  isHighlighted ? 'bg-accent-green/5' : ''
                }`}
              >
                {/* Position */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-bold ${zone === 'cl' ? 'text-accent-blue' : zone === 'el' ? 'text-accent-green' : zone === 'rel' ? 'text-accent-red' : 'text-text-secondary'}`}>
                      {row.position}
                    </span>
                  </div>
                </td>

                {/* Team */}
                <td className="py-3 px-3">
                  <Link to={`/teams/${row.team_id}`} className="flex items-center gap-2 hover:text-accent-green transition-colors">
                    {row.team_crest ? (
                      <img src={row.team_crest} alt={row.team_name} className="w-5 h-5 object-contain" />
                    ) : (
                      <div className="w-5 h-5 rounded bg-surface-elevated" />
                    )}
                    <span className="text-sm font-medium text-text-primary">
                      {row.team_short_name || row.team_name}
                    </span>
                  </Link>
                </td>

                <td className="py-3 px-2 text-center text-text-secondary text-sm">{row.played}</td>
                <td className="py-3 px-2 text-center text-text-secondary text-sm">{row.won}</td>
                <td className="py-3 px-2 text-center text-text-secondary text-sm">{row.draw}</td>
                <td className="py-3 px-2 text-center text-text-secondary text-sm">{row.lost}</td>
                <td className="py-3 px-2 text-center text-text-secondary text-sm">{row.goals_for}</td>
                <td className="py-3 px-2 text-center text-text-secondary text-sm">{row.goals_against}</td>
                <td className="py-3 px-2 text-center text-sm">
                  <span className={row.goal_difference > 0 ? 'text-accent-green' : row.goal_difference < 0 ? 'text-accent-red' : 'text-text-muted'}>
                    {row.goal_difference > 0 ? '+' : ''}{row.goal_difference}
                  </span>
                </td>
                <td className="py-3 px-3 text-center font-bold text-text-primary">{row.points}</td>

                {/* Form */}
                <td className="py-3 px-3 hidden md:table-cell">
                  <div className="flex gap-1">
                    {(row.form || '').split(',').filter(Boolean).slice(-5).map((r, i) => (
                      <span key={i} className={`form-${r}`}>{r}</span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 px-3 text-[11px] text-text-muted">
        <span><span className="inline-block w-2 h-2 rounded-full bg-accent-blue mr-1" />Champions League</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-accent-green mr-1" />Europa/Conference</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-accent-red mr-1" />Relegation</span>
      </div>
    </div>
  );
}

function getZone(pos, total) {
  if (pos <= 4)              return 'cl';
  if (pos <= 6)              return 'el';
  if (pos >= total - 2)      return 'rel';
  return null;
}
