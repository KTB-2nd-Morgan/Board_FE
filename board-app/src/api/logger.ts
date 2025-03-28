// src/api/logger.ts
import api from '../lib/axios';

export async function logClientError(payload: {
  level?: 'info' | 'warn' | 'error';
  message: string;
  context?: any;
}) {
  try {
    await api.post('/logs', {
      level: payload.level || 'error',
      message: payload.message,
      context: payload.context || {},
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.warn('🚨 로그 전송 실패:', e);
  }
}
