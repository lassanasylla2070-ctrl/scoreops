import { useState, useEffect } from 'react';
import { Search, X, Scale } from 'lucide-react';
import { playersApi } from '../services/api';
import { formatAge, formatNumber } from '../utils/formatters';
import { POSITION_SHORT } from '../utils/constants';

export default function ComparePlayers() {
  const [p1Search, setP1Search] = useState('');
  const [p2Search, setP2Search] = useState('');
  const [p1Results, setP1Results] = useState([]);
  const [p2Results, setP2Results] = useState([]);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  const searchPlayers = async (query, setter) => {
    if (!query.trim()) { setter([]); return; }
    try {
      const res = await playersApi.getAll({ q: query, limit: 5 });
      setter(res.players || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => searchPlayers(p1Search, setP1Results), 300);
    return () => clearTimeout(timer);
  }, [p1Search]);

  useEffect(() => {
    const timer = setTimeout(() => searchPlayers(p2Search, setP2Results), 300);
    return () => clearTimeout(timer);
  }, [p2Search]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
          <Scale size={24} />
        </div>
        <div>
          <h1 className="page-header">Compare Players</h1>
          <p className="text-text-secondary text-sm">Side-by-side comparison of statistics and profiles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Player 1 Selection */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Player 1</label>
          {!player1 ? (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={p1Search}
                onChange={(e) => setP1Search(e.target.value)}
                placeholder="Search first player..."
                className="input pl-10"
              />
              {p1Results.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 card z-50 overflow-hidden">
                  {p1Results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setPlayer1(p); setP1Results([]); setP1Search(''); }}
                      className="w-full px-4 py-2 text-left hover:bg-surface-hover flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-bold">{p.name[0]}</div>
                      <div>
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="text-[11px] text-text-muted">{p.team_name} · {p.position}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <PlayerCompactCard player={player1} onClear={() => setPlayer1(null)} />
          )}
        </div>

        {/* Player 2 Selection */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Player 2</label>
          {!player2 ? (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={p2Search}
                onChange={(e) => setP2Search(e.target.value)}
                placeholder="Search second player..."
                className="input pl-10"
              />
              {p2Results.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 card z-50 overflow-hidden">
                  {p2Results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setPlayer2(p); setP2Results([]); setP2Search(''); }}
                      className="w-full px-4 py-2 text-left hover:bg-surface-hover flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-bold">{p.name[0]}</div>
                      <div>
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="text-[11px] text-text-muted">{p.team_name} · {p.position}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <PlayerCompactCard player={player2} onClear={() => setPlayer2(null)} />
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {player1 && player2 && (
        <div className="card overflow-hidden animate-slide-up">
          <div className="grid grid-cols-3 bg-surface-elevated/50 border-b border-border">
            <div className="p-4 text-center border-r border-border font-bold text-text-primary">{player1.name}</div>
            <div className="p-4 text-center border-r border-border text-xs font-bold uppercase tracking-widest text-text-muted flex items-center justify-center">Metrics</div>
            <div className="p-4 text-center font-bold text-text-primary">{player2.name}</div>
          </div>

          <ComparisonRow label="Position" v1={POSITION_SHORT[player1.position] || player1.position} v2={POSITION_SHORT[player2.position] || player2.position} />
          <ComparisonRow label="Nationality" v1={player1.nationality} v2={player2.nationality} />
          <ComparisonRow label="Age" v1={formatAge(player1.date_of_birth)} v2={formatAge(player2.date_of_birth)} isNumeric />
          <ComparisonRow label="Shirt Number" v1={player1.shirt_number} v2={player2.shirt_number} isNumeric />
          <ComparisonRow label="Club" v1={player1.team_name} v2={player2.team_name} />
          
          <div className="p-4 bg-surface/30 text-center text-[10px] font-bold uppercase tracking-widest text-text-muted border-y border-border">
            Season Statistics (if available)
          </div>

          {/* These would normally come from a deeper stats API, but we'll show what we have in the DB */}
          <ComparisonRow label="Goals" v1={0} v2={0} isNumeric />
          <ComparisonRow label="Assists" v1={0} v2={0} isNumeric />
        </div>
      )}

      {!player1 || !player2 ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center border-dashed">
          <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center text-3xl mb-4 text-text-muted">
            🆚
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Select Two Players</h3>
          <p className="text-text-secondary text-sm max-w-xs">Search and select two players from the inputs above to compare their profiles and stats.</p>
        </div>
      ) : null}
    </div>
  );
}

function PlayerCompactCard({ player, onClear }) {
  return (
    <div className="card p-4 flex items-center gap-4 bg-surface-elevated/20 border-accent-blue/30 relative">
      <button onClick={onClear} className="absolute top-2 right-2 text-text-muted hover:text-text-primary transition-colors">
        <X size={14} />
      </button>
      <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center text-2xl font-bold border-2 border-border">
        {player.name[0]}
      </div>
      <div>
        <h3 className="font-bold text-text-primary">{player.name}</h3>
        <p className="text-xs text-text-secondary">{player.team_name}</p>
        <p className="text-[11px] text-accent-blue font-semibold mt-1">{player.position}</p>
      </div>
    </div>
  );
}

function ComparisonRow({ label, v1, v2, isNumeric = false }) {
  const higherV1 = isNumeric && Number(v1) > Number(v2);
  const higherV2 = isNumeric && Number(v2) > Number(v1);

  return (
    <div className="grid grid-cols-3 border-b border-border/50 last:border-0 hover:bg-white/5 transition-colors">
      <div className={`p-4 text-center border-r border-border text-sm ${higherV1 ? 'text-accent-green font-bold' : 'text-text-primary'}`}>
        {v1 || '—'}
      </div>
      <div className="p-4 text-center border-r border-border text-[11px] text-text-muted font-medium bg-surface/10 flex items-center justify-center italic">
        {label}
      </div>
      <div className={`p-4 text-center text-sm ${higherV2 ? 'text-accent-green font-bold' : 'text-text-primary'}`}>
        {v2 || '—'}
      </div>
    </div>
  );
}
