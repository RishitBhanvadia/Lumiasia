import axios from 'axios';

/**
 * Axios instance pre-configured for future CMS integration.
 * PRD §3 — CORS Configuration & Rate Limiting.
 */

const CMS_BASE_URL = import.meta.env.VITE_CMS_API_URL || '';

const api = axios.create({
  baseURL: CMS_BASE_URL || '/', // Fallback to root for dev
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// ── Request Interceptor ──────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Future: attach auth tokens, API keys
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor — Rate Limit Handling ───────────────────────
let retryCount = 0;
const MAX_RETRIES = 3;

api.interceptors.response.use(
  (response) => {
    retryCount = 0;
    return response;
  },
  async (error) => {
    const { config, response } = error;

    // Handle 429 Too Many Requests with exponential backoff
    if (response?.status === 429 && retryCount < MAX_RETRIES) {
      retryCount++;
      const retryAfter = response.headers['retry-after'];
      const delay = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : Math.pow(2, retryCount) * 1000;

      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    retryCount = 0;
    return Promise.reject(error);
  }
);

export default api;

import { supabase } from './supabase';

/**
 * Fetch projects from Supabase database.
 */
export const fetchProjectsData = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*');

  if (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }

  return data || [];
};
