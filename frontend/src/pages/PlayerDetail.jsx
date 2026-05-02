import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Calendar, Flag, BarChart as ChartIcon } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { useFetch } from '../hooks/usePolling';
import { playersApi } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { formatAge, formatBirthdate } from '../utils/formatters';
import { POSITION_SHORT } from '../utils/constants';

export default function PlayerDetail() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(() => playersApi.getById(id), [id]);
  const { isPlayerFav, togglePlayer } = useFavorites();

  if (loading) return <LoadingView />;
  if (error || !data) return <ErrorView error={error} />;

  const player = data.player || data;
  const isFav = isPlayerFav(player.id);
  const posShort = POSITION_SHORT[player.position] || player.position?.slice(0, 2) || '?';

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <Link to="/players" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary">
        <ArrowLeft size={14} /> Back to Players
      </Link>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-surface-elevated flex items-center justify-center text-3xl font-bold text-text-muted">
              {player.name?.[0]}
            </div>
            <span className="absolute -bottom-1 -right-1 badge badge-blue px-2 py-0.5 text-[11px]">
              {posShort}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-text-primary">{player.name}</h1>
                {player.team_name && (
                  <p className="text-text-secondary mt-0.5">
                    {player.team_crest && (
                      <img src={player.team_crest} alt="" className="w-4 h-4 object-contain inline mr-1.5" />
                    )}
                    {player.team_name}
                  </p>
                )}
              </div>
              <button
                onClick={() => togglePlayer(player)}
                className="btn-ghost p-2 flex-shrink-0"
                aria-label="Toggle favourite"
              >
                <Star size={18} fill={isFav ? '#fbbf24' : 'none'} className={isFav ? 'text-accent-yellow' : 'text-text-muted'} />
              </button>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4">
              {player.position && (
                <InfoRow icon="📌" label="Position" value={player.position} />
              )}
              {player.nationality && (
                <InfoRow icon="🌍" label="Nationality" value={player.nationality} />
              )}
              {player.date_of_birth && (
                <InfoRow icon="🎂" label="Born" value={`${formatBirthdate(player.date_of_birth)} (age ${formatAge(player.date_of_birth)})`} />
              )}
              {player.shirt_number && (
                <InfoRow icon="👕" label="Shirt No." value={`#${player.shirt_number}`} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <ChartIcon size={18} className="text-accent-blue" />
            <h3 className="section-title">Attribute Analysis</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockRadarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={player.name}
                  dataKey="A"
                  stroke="#60a5fa"
                  fill="#60a5fa"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <ChartIcon size={18} className="text-accent-green" />
            <h3 className="section-title">Season Goals</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSeasonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#242424', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="goals" fill="#4CAF50" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Career Summary */}
      <div className="card p-6">
        <h3 className="section-title mb-4">Career Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox label="Appearances" value="124" />
          <StatBox label="Total Goals" value="48" />
          <StatBox label="Assists" value="32" />
          <StatBox label="Minutes" value="9,420" />
        </div>
      </div>
    </div>
  );
}

const mockRadarData = [
  { subject: 'Speed', A: 85 },
  { subject: 'Shooting', A: 92 },
  { subject: 'Passing', A: 78 },
  { subject: 'Dribbling', A: 88 },
  { subject: 'Defending', A: 45 },
  { subject: 'Physical', A: 72 },
];

const mockSeasonData = [
  { year: '20/21', goals: 12 },
  { year: '21/22', goals: 18 },
  { year: '22/23', goals: 24 },
  { year: '23/24', goals: 15 },
  { year: '24/25', goals: 21 },
];

function StatBox({ label, value }) {
  return (
    <div className="p-4 bg-surface-elevated/20 rounded-xl border border-border text-center">
      <p className="text-2xl font-extrabold text-text-primary">{value}</p>
      <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-1">{label}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div>
      <p className="text-[11px] text-text-muted uppercase tracking-wide font-semibold mb-0.5">{label}</p>
      <p className="text-sm text-text-primary">{icon} {value}</p>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="skeleton h-5 w-32" />
      <div className="card p-6">
        <div className="flex gap-5">
          <div className="skeleton w-20 h-20 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-7 w-48" />
            <div className="skeleton h-4 w-32" />
            <div className="grid grid-cols-2 gap-4 mt-2">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-8" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorView({ error }) {
  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/players" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-6">
        <ArrowLeft size={14} /> Back to Players
      </Link>
      <div className="card p-10 text-center">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-text-muted">{error || 'Player not found.'}</p>
      </div>
    </div>
  );
}
