import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useFetch } from '../hooks/usePolling';
import { newsApi } from '../services/api';
import NewsCard from '../components/ui/NewsCard';
import { NewsSkeleton } from '../components/ui/LoadingSkeleton';

export default function News() {
  const [q,      setQ]      = useState('');
  const [source, setSource] = useState('');
  const [page,   setPage]   = useState(1);
  const [debouncedQ, setDebouncedQ] = useState('');

  const handleSearch = (val) => {
    setQ(val);
    clearTimeout(window._newsTimer);
    window._newsTimer = setTimeout(() => { setDebouncedQ(val); setPage(1); }, 400);
  };

  const { data: sourcesData } = useFetch(() => newsApi.getSources(), []);
  const { data, loading, error } = useFetch(
    () => newsApi.getAll({ q: debouncedQ, source, page, limit: 12 }),
    [debouncedQ, source, page]
  );

  const articles = data?.articles || [];
  const totalPages = data?.totalPages || 1;
  const sources = sourcesData?.sources || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-header">Football News</h1>
        <p className="text-text-secondary text-sm">Latest news from BBC Sport, Sky Sports, The Guardian, and Goal.com</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search articles…"
            className="input pl-9 h-9 text-sm"
          />
        </div>

        {sources.length > 0 && (
          <select
            value={source}
            onChange={(e) => { setSource(e.target.value); setPage(1); }}
            className="input h-9 text-sm w-auto min-w-36 bg-surface cursor-pointer"
          >
            <option value="">All Sources</option>
            {sources.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="card p-4 border-accent-red/30 bg-accent-red/5 text-accent-red text-sm">⚠ {error}</div>
      )}

      {/* Featured + Grid */}
      {loading ? (
        <div className="space-y-3">
          <NewsSkeleton featured />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <NewsSkeleton key={i} />)}
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-4xl mb-3">📰</p>
          <p className="text-text-muted">
            {debouncedQ || source
              ? 'No articles match your search.'
              : 'News is loading — the backend is fetching RSS feeds. Refresh in a minute.'}
          </p>
        </div>
      ) : (
        <>
          {/* Featured */}
          {page === 1 && articles[0] && (
            <NewsCard article={articles[0]} featured />
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(page === 1 ? articles.slice(1) : articles).map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-outline px-4 py-2 text-sm disabled:opacity-40"
          >← Previous</button>
          <span className="text-sm text-text-muted">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-outline px-4 py-2 text-sm disabled:opacity-40"
          >Next →</button>
        </div>
      )}

      {/* Auto-refresh notice */}
      <p className="text-center text-[12px] text-text-muted">
        📡 News auto-refreshes from RSS feeds every hour
      </p>
    </div>
  );
}
