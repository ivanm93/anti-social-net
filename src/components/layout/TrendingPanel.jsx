import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllTags, createTag } from "../../api/tagsApi";
import { getAllUsers, followUser } from "../../api/usersApi";
import { useAuth } from "../../context/AuthContext";
import { getAllPosts } from "../../api/postsApi";
import { getUserById } from "../../api/usersApi";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const avatarColors = [
  { bg: '#BDE0FE', color: '#03045E' },
  { bg: '#A8DADC', color: '#1D3557' },
  { bg: '#CAF0F8', color: '#0077B6' }
];

export default function TrendingPanel() {
  const { user } = useAuth();
  
  // Estados de datos
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  
  // Estados de formularios / UI
  const [newTag, setNewTag] = useState("");
  const [addingTag, setAddingTag] = useState(false);

  // 1. Carga inicial de datos combinada
  useEffect(() => {
    if (!user?._id) return;

    const loadPanelData = async () => {
      try {
        const [
          { data: allUsers }, 
          { data: freshUser }, 
          { data: allTags }, 
          { data: allPosts }
        ] = await Promise.all([
          getAllUsers(),
          getUserById(user._id),
          getAllTags(),
          getAllPosts(),
        ]);

        // Procesar Sugerencias de Seguimiento
        const myFollowing = new Set(
          freshUser.following.map((f) => (typeof f === "object" ? f._id : f))
        );
        const filteredSuggestions = allUsers.filter(
          (u) => u._id !== user._id && !myFollowing.has(u._id)
        );
        setSuggestions(filteredSuggestions.slice(0, 3));

        // Procesar Tags Recientes (Tendencias)
        const lastUsedMap = {};
        allPosts.forEach((post) => {
          const postDate = new Date(post.createdAt);
          post.tags?.forEach((tag) => {
            const tagId = tag._id || tag;
            if (!lastUsedMap[tagId] || postDate > lastUsedMap[tagId]) {
              lastUsedMap[tagId] = postDate;
            }
          });
        });

        const recentTags = allTags
          .filter((tag) => lastUsedMap[tag._id])
          .map((tag) => ({ ...tag, lastUsed: lastUsedMap[tag._id] }))
          .sort((a, b) => b.lastUsed - a.lastUsed)
          .slice(0, 4);

        setTags(recentTags);
      } catch (error) {
        console.error("Error al cargar el panel:", error);
      }
    };

    loadPanelData();
  }, [user?._id]);

  // 2. Acción: Seguir Usuario
  const handleFollow = async (targetId) => {
    try {
      await followUser({ userId: user._id, targetUserId: targetId });
      
      // los usuarios actualizados para refrescar la lista visual de inmediato.
      const [{ data: allUsers }, { data: freshUser }] = await Promise.all([
        getAllUsers(),
        getUserById(user._id),
      ]);

      const myFollowing = new Set(
        freshUser.following.map((f) => (typeof f === "object" ? f._id : f))
      );
      
      const updatedSuggestions = allUsers.filter(
        (u) => u._id !== user._id && !myFollowing.has(u._id)
      );
      
      setSuggestions(updatedSuggestions.slice(0, 3));
    } catch {
      alert("No se pudo seguir al usuario");
    }
  };

  // 3. Acción: Crear Tag Nuevo
  const handleCreateTag = async (e) => {
    e.preventDefault();
    const cleanTagName = newTag.trim();
    if (!cleanTagName) return;

    try {
      setAddingTag(true);
      const { data } = await createTag({ name: cleanTagName });
      
      setTags((prev) => [data, ...prev].slice(0, 4));
      setNewTag("");
    } catch {
      alert("No se pudo crear el tag");
    } finally {
      setAddingTag(false);
    }
  };
  return (
    <div
      className="d-flex flex-column gap-3"
      style={{ position: "sticky", top: 76 }}
    >
      <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
        <p
          className="mb-3"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "#888780",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Tendencias
        </p>
        {tags.length === 0 ? (
          <p className="text-muted small mb-0">Sin tags aún</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {tags.map((tag) => (
              <Link
                key={tag._id}
                to={`/explore?tag=${tag.name}`}
                className="text-decoration-none"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    style={{ fontSize: 13, color: "#3C3489", fontWeight: 500 }}
                  >
                    #{tag.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <form onSubmit={handleCreateTag} className="d-flex gap-2 mt-3">
          <input
            type="text"
            className="form-control form-control-sm bg-light border-0"
            placeholder="Nueva tendencia..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            style={{ borderRadius: 8, fontSize: 12 }}
          />
          <button
            type="submit"
            className="btn btn-sm btn-purple"
            disabled={addingTag || !newTag.trim()}
            style={{ borderRadius: 8, fontSize: 12, whiteSpace: "nowrap" }}
          >
            + Tag
          </button>
        </form>
      </div>

      {suggestions.length > 0 && (
        <div
          className="card border-0 shadow-sm p-3"
          style={{ borderRadius: 14 }}
        >
          <p
            className="mb-3"
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#888780",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            A quién seguir
          </p>
          <div className="d-flex flex-column gap-3">
            {suggestions.map((u, i) => {
              const { bg, color } = avatarColors[i % avatarColors.length];
              return (
                <div
                  key={u._id}
                  className="d-flex align-items-center justify-content-between"
                >
                  <Link
                    to={`/profile/${u.nickName}`}
                    className="d-flex align-items-center gap-2 text-decoration-none"
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 500,
                        color,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(u.name || u.nickName)}
                    </div>
                    <div>
                      <p
                        className="mb-0"
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#2C2C2A",
                        }}
                      >
                        {u.name || u.nickName}
                      </p>
                      <p className="mb-0 text-muted" style={{ fontSize: 11 }}>
                        @{u.nickName}
                      </p>
                    </div>
                  </Link>
                  <button
                    className="btn btn-sm"
                    style={{
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 20,
                      border: "1px solid #CECBF6",
                      color: "#3C3489",
                      background: "white",
                    }}
                    onClick={() => handleFollow(u._id)}
                  >
                    Seguir
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
        <p
          className="mb-1"
          style={{ fontSize: 13, fontWeight: 500, color: "#26215C" }}
        >
          Anti-Social Net
        </p>
        <p className="mb-0 text-muted" style={{ fontSize: 11 }}>
          UnaHur · 2026 · C1
        </p>
      </div>
    </div>
  );
}
