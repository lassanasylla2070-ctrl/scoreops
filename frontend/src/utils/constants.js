// League configurations (mirrors backend)
export const LEAGUES = {
  PL:  { code: 'PL',  id: 2021, name: 'Premier League',  country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#3d195b' },
  PD:  { code: 'PD',  id: 2014, name: 'La Liga',          country: 'Spain',   flag: '🇪🇸', color: '#ff4b44' },
  BL1: { code: 'BL1', id: 2002, name: 'Bundesliga',       country: 'Germany', flag: '🇩🇪', color: '#d00000' },
  SA:  { code: 'SA',  id: 2019, name: 'Serie A',          country: 'Italy',   flag: '🇮🇹', color: '#024694' },
  FL1: { code: 'FL1', id: 2015, name: 'Ligue 1',          country: 'France',  flag: '🇫🇷', color: '#091c3e' },
  CL:  { code: 'CL',  id: 2001, name: 'Champions League', country: 'Europe',  flag: '🇪🇺', color: '#1a237e' },
};

export const LEAGUE_LIST = Object.values(LEAGUES);

export const POSITIONS = ['Goalkeeper', 'Centre-Back', 'Left-Back', 'Right-Back', 'Defensive Midfield', 'Central Midfield', 'Attacking Midfield', 'Left Winger', 'Right Winger', 'Centre-Forward'];

export const POSITION_SHORT = {
  Goalkeeper: 'GK',
  'Centre-Back': 'CB',
  'Left-Back': 'LB',
  'Right-Back': 'RB',
  'Defensive Midfield': 'DM',
  'Central Midfield': 'CM',
  'Attacking Midfield': 'AM',
  'Left Winger': 'LW',
  'Right Winger': 'RW',
  'Centre-Forward': 'CF',
};

export const MATCH_STATUS = {
  SCHEDULED: { label: 'Scheduled', color: 'text-text-muted'  },
  TIMED:     { label: 'Upcoming',  color: 'text-text-muted'  },
  IN_PLAY:   { label: 'LIVE',      color: 'text-accent-red'  },
  PAUSED:    { label: 'HT',        color: 'text-accent-yellow' },
  FINISHED:  { label: 'FT',        color: 'text-text-secondary' },
  POSTPONED: { label: 'PPD',       color: 'text-text-muted'  },
  CANCELLED: { label: 'CAN',       color: 'text-text-muted'  },
  SUSPENDED: { label: 'SUS',       color: 'text-text-muted'  },
};

export const API_BASE = 'http://localhost:3001/api';
export const POLL_INTERVAL_LIVE = 30000;    // 30s
export const POLL_INTERVAL_MATCHES = 60000; // 60s
