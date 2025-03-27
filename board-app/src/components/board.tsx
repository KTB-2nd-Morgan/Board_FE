import { useEffect, useState } from 'react';
import './board.css';
import { motion, AnimatePresence } from "framer-motion";
import { getPosts, createPost, updatePost, deletePost } from '../api/posts';

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function Board() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 게시글 불러오기
  useEffect(() => {
    getPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('게시글 불러오기 실패:', err.response ?? err.message ?? err);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return;

    if (editingId !== null) {
      try {
        const updated = await updatePost(editingId, { title, body });
        setPosts(posts.map((post) => (post.id === editingId ? updated : post)));
        setEditingId(null);
        setTitle('');
        setBody('');
      } catch (err) {
        console.error('게시글 수정 실패:', err);
        alert('게시글 수정 중 오류 발생');
      }
    } else {
      try {
        const created = await createPost({ title, body });
        setPosts([created, ...posts]);
        setTitle('');
        setBody('');
      } catch (err) {
        console.error('게시글 생성 실패:', err);
        alert('게시글 생성 중 오류 발생');
      }
    }
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setBody(post.body);
    setEditingId(post.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deletePost(id);
        setPosts(posts.filter((post) => post.id !== id));
      } catch (err) {
        console.error('게시글 삭제 실패:', err);
        alert('게시글 삭제 중 오류 발생');
      }
    }
  };

  if (loading) return <p>⏳ 게시글을 불러오는 중입니다...</p>;
  if (error) return <p>❌ {error}</p>;
  return (
    <div className="board-container">
      <h1 className="board-title">📝 게시판</h1>

      <div className="form-group">
        <label>제목</label>
        <input
          type="text"
          value={title}
          placeholder="제목을 입력하세요"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>내용</label>
        <textarea
          value={body}
          placeholder="내용을 입력하세요"
          onChange={(e) => setBody(e.target.value)}
          rows={5}
        />
      </div>

      <button onClick={handleSubmit} className="submit-btn">
        {editingId !== null ? '수정 완료' : '작성'}
      </button>

      {posts.length > 0 && (
        <div className="post-list">
          <AnimatePresence>
  {posts.map((post) => (
    <motion.div
      key={post.id}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10, transition: { duration: 0.6, ease: "easeInOut" } }} // 삭제 시 속도
      transition={{ duration: 0.5, ease: "easeOut" }} // 생성 시 속도
      className="post-item"
    >
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <div className="action-buttons">
        <button onClick={() => handleEdit(post)}>✏️ 수정</button>
        <button onClick={() => handleDelete(post.id)}>🗑 삭제</button>
      </div>
    </motion.div>
  ))}
</AnimatePresence>
        </div>
      )}
    </div>
  );
}
 