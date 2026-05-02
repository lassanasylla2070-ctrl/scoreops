import axios from 'axios';
import { API_BASE } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.error || err.message || 'Network error';
    return Promise.reject(new Error(msg));
  }
);

// ── Matches ──────────────────────────────────────────────────────────────────
export const matchesApi = {
  getAll:     (params = {}) => api.get('/matches', { params }),
  getLive:    ()             => api.get('/matches/live'),
  getUpcoming:()             => api.get('/matches/upcoming'),
  getToday:   ()             => api.get('/matches/today'),
  getById:    (id)           => api.get(`/matches/${id}`),
};

// ── Standings ─────────────────────────────────────────────────────────────────
export const standingsApi = {
  getAll:       ()     => api.get('/standings'),
  getByLeague:  (code) => api.get(`/standings/${code}`),
};

// ── Players ───────────────────────────────────────────────────────────────────
export const playersApi = {
  getAll:         (params = {}) => api.get('/players', { params }),
  getById:        (id)           => api.get(`/players/${id}`),
  getTopScorers:  (params = {}) => api.get('/players/top/scorers', { params }),
  getTopAssisters:(params = {}) => api.get('/players/top/assists', { params }),
};

// ── Teams ─────────────────────────────────────────────────────────────────────
export const teamsApi = {
  getAll:     (params = {}) => api.get('/teams', { params }),
  getById:    (id)           => api.get(`/teams/${id}`),
  getMatches: (id, params)   => api.get(`/teams/${id}/matches`, { params }),
};

// ── News ──────────────────────────────────────────────────────────────────────
export const newsApi = {
  getAll:     (params = {}) => api.get('/news', { params }),
  getById:    (id)           => api.get(`/news/${id}`),
  getSources: ()             => api.get('/news/sources'),
};

export default api;
