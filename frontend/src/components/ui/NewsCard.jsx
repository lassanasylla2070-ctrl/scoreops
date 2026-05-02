import { Link } from 'react-router-dom';
import { timeAgo, truncate } from '../../utils/formatters';
import { ExternalLink } from 'lucide-react';

export default function NewsCard({ article, featured = false }) {
  const isExternal = article.url?.startsWith('http');

  const Content = (
    <div className={`card card-hover overflow-hidden group animate-fade-in ${featured ? 'md:flex' : ''}`}>
      {/* Image */}
      {article.image_url && (
        <div className={`overflow-hidden bg-surface-elevated ${featured ? 'md:w-72 md:flex-shrink-0' : 'h-40'}`}>
          <img
            src={article.image_url}
            alt={article.title}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${featured ? 'h-full' : 'h-40'}`}
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-gray">{article.source}</span>
            <span className="text-[11px] text-text-muted">{timeAgo(article.published_at)}</span>
          </div>
          <h3 className={`font-semibold text-text-primary leading-snug mb-2 group-hover:text-accent-green transition-colors ${featured ? 'text-base' : 'text-sm'}`}>
            {article.title}
          </h3>
          {article.description && (
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {truncate(article.description, featured ? 200 : 100)}
            </p>
          )}
        </div>
        {isExternal && (
          <div className="flex items-center gap-1 mt-3 text-[12px] text-text-muted group-hover:text-accent-green transition-colors">
            <ExternalLink size={11} />
            <span>Read full article</span>
          </div>
        )}
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        {Content}
      </a>
    );
  }

  return <Link to={`/news/${article.id}`}>{Content}</Link>;
}
