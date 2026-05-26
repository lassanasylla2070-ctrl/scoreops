import { Link } from 'react-router-dom';
import { Activity, Trophy, Newspaper, TrendingUp, ChevronRight } from 'lucide-react';
import { usePolling, useFetch } from '../hooks/usePolling';
import { matchesApi, standingsApi, newsApi } from '../services/api';
import MatchCard from '../components/ui/MatchCard';
import NewsCard from '../components/ui/NewsCard';
import StandingsTable from '../components/ui/StandingsTable';
import { MatchSkeleton, NewsSkeleton, StandingsSkeleton } from '../components/ui/LoadingSkeleton';
import { POLL_INTERVAL_LIVE } from '../utils/constants';

export default function Home() {
  const { data: liveData, loading: liveLoading }       = usePolling(() => matchesApi.getLive(),   POLL_INTERVAL_LIVE,  []);
  const { data: todayData, loading: todayLoading }     = usePolling(() => matchesApi.getToday(),  60000,               []);
  const { data: standingsData, loading: standingsLoading } = useFetch(() => standingsApi.getAll(), []);
  const { data: newsData, loading: newsLoading }       = useFetch(() => newsApi.getAll({ limit: 6 }), []);

  const liveMatches   = liveData?.matches  || [];
  const todayMatches  = todayData?.matches || [];
  const plStandings   = standingsData?.standings?.PL?.table || [];
  const articles      = newsData?.articles || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-bg-secondary via-surface to-bg-secondary border border-border p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(76,175,80,0.12),transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">⚽</span>
            <span className="badge badge-green text-[11px] font-bold uppercase tracking-wider">Live</span>
          </div>
          <h1 className="text-4xl font-extrabold text-text-primary tracking-tight mb-2">
            ScoreOps
          </h1>
          <p className="text-text-secondary text-lg max-w-xl">
            Live scores, league tables, player stats, and the latest football news — all in one place.
          </p>
          <div className="flex gap-3 mt-5">
            <Link to="/scores" className="btn-primary">
              <Activity size={16} /> Live Scores
            </Link>
            <Link to="/standings" className="btn-outline">
              <Trophy size={16} /> Standings
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: Activity, label: 'Live Matches',   value: liveLoading ? '…' : liveMatches.length },
            { icon: Trophy,   label: "Today's Matches", value: todayLoading ? '…' : todayMatches.length },
            { icon: Newspaper, label: 'News Articles',  value: newsLoading ? '…' : (newsData?.total || 0) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-bg-primary/50 rounded-xl p-4 border border-border/50 text-center">
              <Icon size={20} className="text-accent-green mx-auto mb-1" />
              <div className="text-2xl font-bold text-text-primary">{value}</div>
              <div className="text-xs text-text-muted">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section>
          <SectionHeader title="🔴 Live Now" to="/scores" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {liveMatches.slice(0, 6).map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {/* Today's Matches */}
      <section>
        <SectionHeader title="📅 Today's Matches" to="/scores" />
        {todayLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <MatchSkeleton key={i} />)}
          </div>
        ) : todayMatches.length === 0 ? (
          <EmptyState message="No matches scheduled today." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayMatches.slice(0, 9).map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
      </section>

      {/* Premier League Table */}
      <section>
        <SectionHeader title="🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League" to="/standings?league=PL" />
        <div className="card overflow-hidden">
          {standingsLoading ? <div className="p-4"><StandingsSkeleton /></div> : (
            <StandingsTable table={plStandings.slice(0, 10)} />
          )}
        </div>
      </section>

      {/* Latest News */}
      <section>
        <SectionHeader title="📰 Latest News" to="/news" />
        {newsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <NewsSkeleton key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState message="News is loading — the backend is fetching RSS feeds in the background." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {articles.slice(0, 6).map((a) => <NewsCard key={a.id} article={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function SectionHeader({ title, to }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="section-title">{title}</h2>
      <Link to={to} className="flex items-center gap-1 text-sm text-accent-green hover:underline">
        View all <ChevronRight size={14} />
      </Link>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="card p-8 text-center">
      <p className="text-text-muted">{message}</p>
    </div>
  );
}
