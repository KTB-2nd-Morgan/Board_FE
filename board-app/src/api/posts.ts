// src/api/posts.ts
import api from '../lib/axios';
import { logClientError } from './logger';

// 📦 공통 에러 핸들링 래퍼
async function withErrorLogging<T>(fn: () => Promise<T>, label: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    await logClientError({
      message: `[API 오류] ${label}`,
      context: {
        error,
        location: window.location.href
      }
    });
    throw error;
  }
}

// 🧾 게시글 목록 조회
export async function getPosts() {
  return withErrorLogging(
    () => api.get('/posts').then((res) => res.data.data.posts),
    'getPosts() 게시글 목록 조회'
  );
}

// 📝 게시글 생성
export async function createPost(post: { title: string; body: string }) {
  return withErrorLogging(
    () => api.post('/posts', post).then((res) => res.data.data),
    'createPost() 게시글 생성'
  );
}

// ✏️ 게시글 수정
export async function updatePost(id: number, post: { title: string; body: string }) {
  return withErrorLogging(
    () => api.put(`/posts/${id}`, post).then((res) => res.data.data),
    `updatePost() 게시글 ID: ${id} 수정`
  );
}

// 🗑 게시글 삭제
export async function deletePost(id: number) {
  return withErrorLogging(
    () => api.delete(`/posts/${id}`).then((res) => res.data.data),
    `deletePost() 게시글 ID: ${id} 삭제`
  );
}