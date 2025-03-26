import { useState } from 'react';
import './board.css';
import { motion, AnimatePresence } from "framer-motion";


interface Post {
  id: number;
  title: string;
  content: string;
}

export default function Board() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    if (editingId !== null) {
      setPosts(
        posts.map((post) =>
          post.id === editingId ? { ...post, title, content } : post
        )
      );
      setEditingId(null);
    } else {
      const newPost: Post = {
        id: Date.now(),
        title,
        content,
      };
      setPosts([newPost, ...posts]);
    }

    setTitle('');
    setContent('');
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingId(post.id);
  };

  const handleDelete = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

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
          value={content}
          placeholder="내용을 입력하세요"
          onChange={(e) => setContent(e.target.value)}
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
      exit={{ opacity: 0, y: 10, transition: { duration: 0.6, ease: "easeInOut" } }} // ✨ 여기에 따로 줘
      transition={{ duration: 0.5, ease: "easeOut" }} // 생성 시 속도
      className="post-item"
    >
      <h3>{post.title}</h3>
      <p>{post.content}</p>
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
 