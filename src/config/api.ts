/**
 * API Base URL Configuration
 *
 * Defaults to relative paths (empty string) for local Vite dev proxy and unified Docker deployments.
 * When deploying frontend on Vercel and backend on Render, set VITE_API_URL to your Render service URL
 * (e.g., https://blueblends-backend.onrender.com).
 */
const rawApiUrl = (import.meta as any).env?.VITE_API_URL || '';

export const API_BASE = rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : '';
