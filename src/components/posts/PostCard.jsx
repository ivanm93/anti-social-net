import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deletePost } from "../../api/postsApi";
import { getCommentsByPost } from "../../api/commentsApi";
import { useAuth } from "../../context/AuthContext";
import { formatRelativeTime } from "../../utils/dateHelpers";
import { getInitials, getAvatarColors } from "../../utils/userHelpers";
import TagBadge from "../tags/TagBadge";
import CommentForm from "../comments/CommentForm";
import CommentCard from "../comments/CommentCard";

export default function PostCard({ post, onDeleted, showComments = false }) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(showComments);
  const [comments, setComments] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const isOwner =
    user?._id === post?.author?._id ||
    user?.nickName === post?.author?.nickName;

  const initials = getInitials(post.author);
  const { bg, color } = getAvatarColors(post.author?.nickName || "");

  // Cargar comentarios reales del backend al montar
  useEffect(() => {
    let active = true;
    setLoadingComments(true);
    getCommentsByPost(post._id)
      .then(({ data }) => {
        if (active) setComments(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingComments(false);
      });
    return () => {
      active = false;
    };
  }, [post._id]);

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminás este post?")) return;
    try {
      setDeleting(true);
      await deletePost(post._id);
      onDeleted?.(post._id);
    } catch {
      alert("No se pudo eliminar el post");
      setDeleting(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  return (
    <div
      className="card border-0 shadow-sm"
      style={{ borderRadius: 14, overflow: "hidden" }}
    >
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-start">
          <Link
            to={`/profile/${post.author?.nickName}`}
            className="d-flex align-items-center gap-2 text-decoration-none"
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 500,
                color,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div>
              <p
                className="mb-0"
                style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A" }}
              >
                {post.author?.name || post.author?.nickName}
              </p>
              <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                @{post.author?.nickName} · {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </Link>

          {isOwner && (
            <div className="dropdown">
              <button
                className="btn btn-sm border-0 text-muted p-1"
                data-bs-toggle="dropdown"
              >
                <i className="ti ti-dots" style={{ fontSize: 18 }}></i>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end border-0 shadow-sm"
                style={{ borderRadius: 10, minWidth: 140 }}
              >
                <li>
                  <Link
                    to={`/post/${post._id}`}
                    className="dropdown-item d-flex align-items-center gap-2"
                    style={{ fontSize: 13 }}
                  >
                    <i className="ti ti-edit" style={{ fontSize: 15 }}></i>{" "}
                    Editar
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2 text-danger"
                    style={{ fontSize: 13 }}
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    <i className="ti ti-trash" style={{ fontSize: 15 }}></i>
                    {deleting ? "Eliminando..." : "Eliminar"}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <p
          className="mt-3 mb-2"
          style={{ fontSize: 14, lineHeight: 1.6, color: "#2C2C2A" }}
        >
          {post.description}
        </p>

        {post.images?.length > 0 && (
          <div
            className={`mt-2 mb-2 ${post.images.length > 1 ? "d-grid gap-1" : ""}`}
            style={{
              gridTemplateColumns: post.images.length > 1 ? "1fr 1fr" : "1fr",
            }}
          >
            {post.images.map((img, i) => (
              <img
                key={img._id || i}
                src={img.url}
                alt=""
                className="w-100"
                style={{ borderRadius: 10, maxHeight: 300, objectFit: "cover" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ))}
          </div>
        )}

        {post.tags?.length > 0 && (
          <div className="mt-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag._id} name={tag.name} />
            ))}
          </div>
        )}

        <div
          className="d-flex gap-3 mt-3 pt-2"
          style={{ borderTop: "1px solid #f0effe" }}
        >
          <button
            className="btn btn-sm border-0 d-flex align-items-center gap-1 text-muted p-0"
            onClick={() => setExpanded(!expanded)}
            style={{ fontSize: 13 }}
          >
            <i className="ti ti-message" style={{ fontSize: 17 }}></i>
            {loadingComments
              ? "Cargando..."
              : comments.length > 0
                ? `${comments.length} comentario${comments.length !== 1 ? "s" : ""}`
                : "Comentar"}
          </button>

          <Link
            to={`/post/${post._id}`}
            className="btn btn-sm border-0 d-flex align-items-center gap-1 text-muted p-0"
            style={{ fontSize: 13 }}
          >
            <i className="ti ti-external-link" style={{ fontSize: 17 }}></i>
            Ver post
          </Link>
        </div>
      </div>

      {expanded && (
        <div
          className="px-3 pb-3"
          style={{ background: "#faf9ff", borderTop: "1px solid #f0effe" }}
        >
          {comments.length > 0 && (
            <div className="mt-3 d-flex flex-column gap-2">
              {comments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  onDeleted={handleCommentDeleted}
                />
              ))}
            </div>
          )}
          <div className="pt-3">
            <CommentForm
              postId={post._id}
              onCommentAdded={handleCommentAdded}
            />
          </div>
        </div>
      )}
    </div>
  );
}
