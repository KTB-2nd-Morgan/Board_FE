// src/lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.morgankorea.kr',
//   withCredentials: true, // 쿠키 등 인증 필요 시
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
