import { formatDistanceToNow, format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';

export function formatMatchDate(utcDate) {
  if (!utcDate) return '';
  try {
    const date = parseISO(utcDate);
    if (isToday(date))     return `Today, ${format(date, 'HH:mm')}`;
    if (isTomorrow(date))  return `Tomorrow, ${format(date, 'HH:mm')}`;
    if (isYesterday(date)) return `Yesterday, ${format(date, 'HH:mm')}`;
    return format(date, 'EEE d MMM, HH:mm');
  } catch {
    return utcDate;
  }
}

export function formatKickoffTime(utcDate) {
  if (!utcDate) return '';
  try {
    return format(parseISO(utcDate), 'HH:mm');
  } catch {
    return '';
  }
}

export function formatAge(dateOfBirth) {
  if (!dateOfBirth) return '—';
  try {
    const dob = parseISO(dateOfBirth);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    return age;
  } catch {
    return '—';
  }
}

export function formatBirthdate(dateOfBirth) {
  if (!dateOfBirth) return '—';
  try {
    return format(parseISO(dateOfBirth), 'd MMMM yyyy');
  } catch {
    return dateOfBirth;
  }
}

export function formatScore(home, away) {
  if (home == null || away == null) return '— : —';
  return `${home} : ${away}`;
}

export function formatNumber(n) {
  if (n == null) return '—';
  return Number(n).toLocaleString();
}

export function timeAgo(dateStr) {
  if (!dateStr) return '';
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function getMatchResult(match, teamId) {
  if (match.status !== 'FINISHED') return null;
  const homeWin = match.home_score > match.away_score;
  const draw    = match.home_score === match.away_score;
  if (draw) return 'D';
  if (match.home_team_id === teamId) return homeWin ? 'W' : 'L';
  return homeWin ? 'L' : 'W';
}

export function truncate(str, len = 120) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len).trim() + '…' : str;
}
