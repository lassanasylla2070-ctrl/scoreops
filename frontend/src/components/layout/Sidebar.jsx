import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Activity, BarChart2, Users, Newspaper, Shield,
  ChevronLeft, ChevronRight, Star, Trophy, Scale
} from 'lucide-react';
import { LEAGUE_LIST } from '../../utils/constants';

const NAV_ITEMS = [
  { to: '/',          icon: Home,      label: 'Home'       },
  { to: '/scores',    icon: Activity,  label: 'Live Scores' },
  { to: '/standings', icon: Trophy,    label: 'Standings'  },
  { to: '/players',   icon: Users,     label: 'Players'    },
  { to: '/compare',   icon: Scale,     label: 'Compare'    },
  { to: '/teams',     icon: Shield,    label: 'Teams'      },
  { to: '/news',      icon: Newspaper, label: 'News'       },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-40 flex flex-col
        bg-bg-secondary border-r border-border
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center h-[60px] px-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-accent-green flex items-center justify-center flex-shrink-0 text-lg">
            ⚽
          </div>
          {!collapsed && (
            <span className="font-extrabold text-base text-text-primary truncate">
              ScoreOps
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-badge transition-all duration-150 group
              ${isActive
                ? 'bg-accent-green/10 text-accent-green font-semibold'
                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm truncate">{label}</span>}
          </NavLink>
        ))}

        {/* Leagues section */}
        {!collapsed && (
          <div className="pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted px-3 mb-2">
              Leagues
            </p>
            {LEAGUE_LIST.map((league) => (
              <NavLink
                key={league.code}
                to={`/standings?league=${league.code}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-badge text-sm transition-all duration-150
                  ${isActive
                    ? 'bg-surface text-text-primary'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`
                }
              >
                <span className="text-base">{league.flag}</span>
                <span className="truncate">{league.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 py-3 border-t border-border">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-badge text-text-muted hover:bg-surface-hover hover:text-text-primary transition-all duration-150 text-sm"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
