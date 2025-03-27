// src/api/posts.ts
import api from '../lib/axios';

export async function getPosts() {
  const res = await api.get('/posts');
  return res.data.data.posts;
}

export async function createPost(post: { title: string; body: string }) {
    const res = await api.post('/posts', post);
    return res.data.data;
  }
  
  export async function updatePost(id: number, post: { title: string; body: string }) {
    const res = await api.put(`/posts/${id}`, post);
    return res.data.data;
  }
  
  export async function deletePost(id: number) {
    const res = await api.delete(`/posts/${id}`);
    return res.data.data;
  }