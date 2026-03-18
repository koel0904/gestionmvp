import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocal } from "../../context/LocalContext";

import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Foro() {
  const { user } = useAuth();
  const { selectedLocal } = useLocal();

  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("info");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Check permissions
  const isOwner = user?.role === "owner" || user?.type === "owner";

  useEffect(() => {
    if (selectedLocal) fetchAnuncios();
  }, [selectedLocal]);

  const fetchAnuncios = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/anuncios`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAnuncios(data);
    } catch (err) {
      console.error("Error fetching anuncios:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: basic size check (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("imagen", file);

    setIsUploading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/anuncios/upload`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Error al subir imagen");
      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newContent.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/anuncios`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            content: newContent,
            type: newType,
            imageUrl: imageUrl || null,
            isPinned: false,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to post");
      setIsPosting(false);
      setNewContent("");
      setNewType("info");
      setImageUrl("");
      fetchAnuncios();
    } catch (err) {
      console.error("Error posting anuncio:", err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este anuncio?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/anuncios/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to delete");
      setAnuncios((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting anuncio:", err);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/locales/${selectedLocal.id}/anuncios/${id}/pin`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to pin");
      fetchAnuncios(); // Re-fetch to sort correctly
    } catch (err) {
      console.error("Error toggling pin:", err);
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case "warning":
        return {
          icon: "warning",
          color: "text-amber-400",
          bg: "bg-amber-400/10",
          border: "border-amber-400/30",
          shadow: "shadow-[0_0_15px_rgba(251,191,36,0.15)]",
        };
      case "success":
        return {
          icon: "check_circle",
          color: "text-emerald-400",
          bg: "bg-emerald-400/10",
          border: "border-emerald-400/30",
          shadow: "shadow-[0_0_15px_rgba(52,211,153,0.15)]",
        };
      case "info":
      default:
        return {
          icon: "info",
          color: "text-sky-400",
          bg: "bg-sky-400/10",
          border: "border-sky-400/30",
          shadow: "shadow-[0_0_15px_rgba(56,189,248,0.15)]",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-white/10 border-t-primary-light rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white block bg-clip-text text-transparent to-white/60">
          Foro del Local
        </h1>
        <p className="text-white/60">
          Entérate de las últimas novedades, anuncios y avisos importantes.
        </p>
      </div>

      {/* Editor Section (Only for Owners) */}
      {isOwner && (
        <div className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <form
            onSubmit={handlePost}
            className="flex flex-col gap-4 p-5 rounded-xl bg-[#0A0E17]/80 backdrop-blur-3xl border border-white/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary-light">
                campaign
              </span>
              <h3 className="font-bold text-white/90">Publicar un Anuncio</h3>
            </div>

            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="¿Qué deseas comunicar al equipo?"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none min-h-[100px]"
              required
            />

            {imageUrl && (
              <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-white/10 bg-white/5 p-2">
                <img 
                  src={`http://localhost:3000${imageUrl}`} 
                  alt="Preview" 
                  className="w-full h-auto rounded-lg object-cover max-h-48"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-4 right-4 size-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors shadow-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setNewType("info")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                      newType === "info"
                        ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                        : "text-white/50 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      info
                    </span>
                    Información
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType("warning")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                      newType === "warning"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "text-white/50 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      warning
                    </span>
                    Aviso
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType("success")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                      newType === "success"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-white/50 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      check_circle
                    </span>
                    Éxito
                  </button>
                </div>

                <div className="h-6 w-px bg-white/10 mx-1" />

                <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-all text-sm font-medium ${isUploading ? 'opacity-50 cursor-wait' : ''}`}>
                  <span className="material-symbols-outlined text-[20px] text-purple-400">
                    {isUploading ? 'refresh' : 'image'}
                  </span>
                  <span className="text-white/70">
                    {isUploading ? 'Subiendo...' : 'Imagen'}
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isPosting || !newContent.trim()}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold tracking-wide hover:bg-primary-dark hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPosting ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    refresh
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">
                    send
                  </span>
                )}
                Publicar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements Feed */}
      <div className="flex flex-col gap-4">
        {anuncios.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-white/5 bg-white/[0.02]">
            <span className="material-symbols-outlined text-5xl text-white/20 mb-4">
              forum
            </span>
            <p className="text-white/60 text-lg">
              Aún no hay anuncios en este local.
            </p>
          </div>
        ) : (
          anuncios.map((anuncio) => {
            const styles = getTypeStyles(anuncio.type);
            const isPinned = anuncio.isPinned;

            return (
              <div
                key={anuncio.id}
                className={`relative overflow-hidden rounded-2xl border ${styles.border} ${styles.bg} ${styles.shadow} backdrop-blur-xl transition-all duration-300 group ${
                  isPinned ? "scale-[1.01] z-10" : "hover:border-white/30"
                }`}
              >
                {/* Visual Accent Band */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-1 ${styles.color.replace("text-", "bg-")} opacity-50`}
                />

                <div className="flex flex-col sm:flex-row p-5 sm:p-6 gap-4 sm:gap-6">
                  {/* Icon Column */}
                  <div className="flex-shrink-0 pt-1 flex items-center justify-between sm:block">
                    <div
                      className={`size-12 rounded-xl flex items-center justify-center border ${styles.border} bg-white/5 shadow-inner`}
                    >
                      <span
                        className={`material-symbols-outlined text-2xl ${styles.color}`}
                      >
                        {styles.icon}
                      </span>
                    </div>

                    {/* Mobile Pin/Actions */}
                    <div className="flex sm:hidden items-center gap-2">
                      {isPinned && (
                        <span className="material-symbols-outlined text-primary-light text-[20px] drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]">
                          push_pin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 min-w-0 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white/90">
                            {anuncio.author?.name || "Administración"}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] uppercase tracking-wider font-bold text-white/50 font-mono">
                            {anuncio.author?.role || "Owner"}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-white/40 mt-0.5 block">
                          {format(new Date(anuncio.fecha), "dd MMM yyyy, p", {
                            locale: es,
                          })}
                        </span>
                      </div>

                      {/* Desktop Actions */}
                      <div className="hidden sm:flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {isOwner && (
                          <>
                            <button
                              onClick={() => handleTogglePin(anuncio.id)}
                              className={`size-8 flex items-center justify-center rounded-lg transition-colors border ${
                                isPinned
                                  ? "bg-primary-light/20 text-primary-light border-primary-light/30 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                                  : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border-white/10"
                              }`}
                              title={
                                isPinned ? "Quitar fijado" : "Fijar anuncio"
                              }
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {isPinned ? "keep" : "push_pin"}
                              </span>
                            </button>
                            <button
                              onClick={() => handleDelete(anuncio.id)}
                              className="size-8 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-white/10 transition-colors"
                              title="Eliminar anuncio"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-white/80 whitespace-pre-wrap leading-relaxed text-[15px]">
                      {anuncio.content}
                    </div>

                    {anuncio.imageUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-white/10 bg-black/20 w-full max-w-2xl">
                        <img 
                          src={`http://localhost:3000${anuncio.imageUrl}`} 
                          alt="Contenido del anuncio" 
                          className="w-full h-auto object-contain max-h-[500px]"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Mobile Owner Actions (bottom) */}
                    {isOwner && (
                      <div className="flex sm:hidden items-center gap-3 mt-2 border-t border-white/5 pt-3">
                        <button
                          onClick={() => handleTogglePin(anuncio.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                            isPinned
                              ? "bg-primary-light/20 text-primary-light border-primary-light/30"
                              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/10"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isPinned ? "keep" : "push_pin"}
                          </span>
                          {isPinned ? "Fijado" : "Fijar"}
                        </button>
                        <button
                          onClick={() => handleDelete(anuncio.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/10 border border-white/10 transition-colors text-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pin Indicator Overlay for Desktop */}
                  {isPinned && (
                    <div className="absolute top-4 right-4 hidden sm:block">
                      <span
                        className={`material-symbols-outlined text-[24px] ${styles.color} opacity-20 -rotate-45`}
                      >
                        push_pin
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
