import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../utilis/axiosClient";
import { ThumbsUp, Trash2, CornerDownRight, Send } from "lucide-react";

const timeAgo = (date) => {
  const sec = Math.floor((Date.now() - new Date(date)) / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
};

const CommentItem = ({ comment, onReply, onDelete, onUpvote, currentUserId, isAdmin, isReply = false }) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const upvoted = comment.upvotes?.some(u => (u._id || u) === currentUserId);
  const canDelete = comment.userId?._id === currentUserId || isAdmin;

  const submitReply = () => {
    if (!replyText.trim()) return;
    onReply(comment._id, replyText);
    setReplyText("");
    setReplying(false);
  };

  return (
    <div style={{ paddingLeft: isReply ? "2rem" : 0, marginTop: isReply ? "0.75rem" : 0 }}>
      <div style={{ display: "flex", gap: "0.65rem" }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.75rem", fontWeight: 700, color: "#fff",
        }}>
          {(comment.userId?.firstname?.[0] || "U").toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{comment.userId?.firstname || "User"}</span>
            {comment.userId?.role === "admin" && (
              <span style={{ background: "rgba(247,129,102,0.12)", color: "var(--accent)", fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "8px" }}>ADMIN</span>
            )}
            <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{timeAgo(comment.createdAt)}</span>
          </div>
          <p style={{ fontSize: "0.87rem", color: "var(--text-primary)", margin: "0.3rem 0 0.5rem", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
            {comment.content}
          </p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button onClick={() => onUpvote(comment._id)} style={{
              display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "none",
              cursor: "pointer", color: upvoted ? "var(--accent)" : "var(--text-secondary)", fontSize: "0.78rem", fontWeight: 600,
            }}>
              <ThumbsUp size={13} fill={upvoted ? "var(--accent)" : "none"} /> {comment.upvotes?.length || 0}
            </button>
            {!isReply && (
              <button onClick={() => setReplying(p => !p)} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "0.78rem" }}>
                <CornerDownRight size={13} /> Reply
              </button>
            )}
            {canDelete && (
              <button onClick={() => onDelete(comment._id)} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontSize: "0.78rem" }}>
                <Trash2 size={13} /> Delete
              </button>
            )}
          </div>

          {replying && (
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="input-custom"
                style={{ fontSize: "0.82rem", padding: "0.45rem 0.7rem" }}
                onKeyDown={e => e.key === "Enter" && submitReply()}
              />
              <button onClick={submitReply} style={{ background: "var(--accent)", border: "none", color: "#fff", borderRadius: "6px", padding: "0 0.85rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                Post
              </button>
            </div>
          )}
        </div>
      </div>

      {comment.replies?.map(r => (
        <CommentItem key={r._id} comment={r} onReply={onReply} onDelete={onDelete} onUpvote={onUpvote} currentUserId={currentUserId} isAdmin={isAdmin} isReply />
      ))}
    </div>
  );
};

const Discussion = ({ problemId }) => {
  const { user } = useSelector(s => s.auth);
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

//   const fetchComments = (page = 1) => {
//     setLoading(true);
//     axiosClient.get(`/comment/${problemId}?page=${page}&limit=15`)
//       .then(r => { setComments(r.data.comments); setPagination(r.data.pagination); })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   };
const fetchComments = (page = 1) => {
  console.log("problemId:", problemId);
  console.log(
    "Request URL:",
    `${import.meta.env.VITE_BACKEND_URL}/comment/${problemId}?page=${page}&limit=15`
  );

  setLoading(true);

  axiosClient
    .get(`/comment/${problemId}?page=${page}&limit=15`)
    .then((r) => {
      console.log("Success:", r.data);
      setComments(r.data.comments);
      setPagination(r.data.pagination);
    })
    .catch((err) => {
      console.log("Status:", err.response?.status);
      console.log("Response:", err.response?.data);
      console.log("URL:", err.config?.baseURL + err.config?.url);
    })
    .finally(() => setLoading(false));
};

  useEffect(() => { fetchComments(1); }, [problemId]);

  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      const { data } = await axiosClient.post(`/comment/${problemId}`, { content: newComment });
      setComments(prev => [{ ...data, replies: [] }, ...prev]);
      setNewComment("");
    } catch (err) { console.error(err); }
  };

  const postReply = async (parentId, content) => {
    try {
      const { data } = await axiosClient.post(`/comment/${problemId}`, { content, parentId });
      setComments(prev => prev.map(c => c._id === parentId ? { ...c, replies: [...(c.replies || []), data] } : c));
    } catch (err) { console.error(err); }
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axiosClient.delete(`/comment/${id}`);
      setComments(prev =>
        prev.filter(c => c._id !== id).map(c => ({ ...c, replies: (c.replies || []).filter(r => r._id !== id) }))
      );
    } catch (err) { console.error(err); }
  };

  const upvoteComment = async (id) => {
    try {
      const { data } = await axiosClient.post(`/comment/${id}/upvote`);
      const apply = (c) => c._id === id
        ? { ...c, upvotes: data.upvoted ? [...(c.upvotes || []), user._id] : (c.upvotes || []).filter(u => (u._id || u) !== user._id) }
        : c;
      setComments(prev => prev.map(c => ({ ...apply(c), replies: (c.replies || []).map(apply) })));
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: "1.25rem" }}>
      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem" }}>Discussion</h3>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <input
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Ask a question or share your approach..."
          className="input-custom"
          onKeyDown={e => e.key === "Enter" && postComment()}
        />
        <button onClick={postComment} style={{ background: "var(--accent)", border: "none", color: "#fff", borderRadius: "8px", padding: "0 1rem", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Send size={15} />
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Loading comments…</p>
      ) : comments.length === 0 ? (
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>No comments yet. Be the first to discuss this problem.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {comments.map(c => (
            <CommentItem key={c._id} comment={c} onReply={postReply} onDelete={deleteComment} onUpvote={upvoteComment} currentUserId={user?._id} isAdmin={user?.role === "admin"} />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => fetchComments(p)} style={{
              minWidth: 28, height: 28, borderRadius: "6px",
              background: p === pagination.page ? "var(--accent)" : "var(--bg-card)",
              border: "1px solid var(--border)", color: p === pagination.page ? "#fff" : "var(--text-primary)",
              cursor: "pointer", fontSize: "0.78rem",
            }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussion;