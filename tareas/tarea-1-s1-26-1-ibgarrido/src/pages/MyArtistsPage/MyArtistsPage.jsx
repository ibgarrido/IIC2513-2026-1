import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyArtistsPage.css";
import Navbar from "../../components/Navbar/Navbar";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import ArtistCardModal from "../../components/ArtistCardModal/ArtistCardModal";
import ArtistFormModal from "../../components/ArtistFormModal/ArtistFormModal";

export default function MyArtistsPage() {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // 1. Cargar Perfil
  // usamos callback al cargar el perfil para poder reutilizar la función después de crear/vender/editar.
  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        "https://t1-back-2026-s1.onrender.com/api/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserProfile(response.data);
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // 2. Cargar Mis Artistas
  // usamos callback para evitar dependencias infinitas en useEffect, y poder llamar a esta función después de crear/vender/editar artistas.
  const fetchMyArtists = useCallback(
    async (page = 1, query = searchQuery) => {
      const token = localStorage.getItem("token");

      try {
        let url = `https://t1-back-2026-s1.onrender.com/api/artists/my?page=${page}&limit=9`;

        if (query.trim() !== "") {
          url += `&search=${encodeURIComponent(query.trim())}`;
        }

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setArtists(response.data.data);
        setMetadata(response.data.meta);
      } catch (error) {
        console.error("Error obteniendo mis artistas:", error);
      }
    },
    [searchQuery]
  );

  // renderizamos el componente después de cargar perfil y artistas,
  //  y cada vez que cambie la página o la query de búsqueda
  useEffect(() => {
    fetchProfile();
    fetchMyArtists(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchMyArtists, fetchProfile]);

  // 4. Modals (Ver detalles, Crear, Editar)
  const handleOpenModal = (artist) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedArtist(null);
    setIsModalOpen(false);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setIsEditMode(false);
  };

  const handleOpenCreateModal = () => {
    setSelectedArtist(null);
    setIsEditMode(false);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = () => {
    setIsModalOpen(false);
    setIsEditMode(true);
    setIsCreateModalOpen(true);
  };

  // 5. Crear artista

  const handleCreateArtist = async (artistData) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "https://t1-back-2026-s1.onrender.com/api/artists",
        {
          name: artistData.name,
          hype_level: Number(artistData.hype_level),
          genres: artistData.genres,
          price: Number(artistData.price),
          image_url: artistData.image_url,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Artista creado exitosamente");
      await fetchProfile();
      await fetchMyArtists(currentPage, searchQuery);
      handleCloseCreateModal();
    } catch (error) {
      const validationErrors = error.response?.data?.details;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        alert("Error de validación:\n" + validationErrors.join("\n"));
        return;
      }
      alert(error.response?.data?.error || "Error al crear artista");
    }
  };

  // 6. Vender artista (mism código de ArtistMarketPage)
  const handleSellArtist = async (artistId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `https://t1-back-2026-s1.onrender.com/api/artists/${artistId}/sell`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message || "Artista vendido exitosamente");
      await fetchProfile();
      await fetchMyArtists(currentPage, searchQuery);
      handleCloseModal();
    } catch (error) {
      alert(error.response?.data?.error || "Error al vender");
    }
  };

  // 7. Eliminar artista
  // https://youtu.be/2QgpLKJl0pg?t=2439
  const handleDeleteArtist = async (artistId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `https://t1-back-2026-s1.onrender.com/api/artists/${artistId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Artista eliminado");
      await fetchMyArtists(currentPage, searchQuery);
      handleCloseModal();
    } catch (error) {
      alert(error.response?.data?.error || "Error al eliminar");
    }
  };

  // 8. editar artista
  // https://youtu.be/2QgpLKJl0pg?t=2076
  const handleUpdateArtist = async (artistData) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `https://t1-back-2026-s1.onrender.com/api/artists/${selectedArtist.id}`,
        {
          name: artistData.name,
          hype_level: Number(artistData.hype_level),
          genres: artistData.genres,
          price: Number(artistData.price),
          image_url: artistData.image_url,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Artista actualizado exitosamente");
      await fetchMyArtists(currentPage); // Recargamos la grilla actual
      handleCloseCreateModal(); // Cerramos el formulario
    } catch (error) {
      const validationErrors = error.response?.data?.details;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        alert("Error de validación: \n" + validationErrors.join("\n"));
        return;
      }
      alert(error.response?.data?.error || "Error al actualizar artista");
    }
  };

  // 9. Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div className="myArtists">Cargando...</div>;

  return (
    <div className="myArtists">
      <Navbar userProfile={userProfile} onLogout={handleLogout} />
      <div className="myArtists__aurora" aria-hidden="true" />

      <main className="myArtists__grid__container">
        <div className="myArtists__headerRow">
          <h1>Mi Lineup</h1>
          <button
            type="button"
            className="myArtists__createButton"
            onClick={handleOpenCreateModal}
          >
            Crear artista
          </button>
        </div>

        {artists.length === 0 ? (
          <p className="no-artists">No has contratado artistas aún.</p>
        ) : (
          <>
            <div className="myArtists__grid">
              {artists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  onOpenModal={handleOpenModal}
                />
              ))}
            </div>

            {/* Paginación */}
            {metadata && metadata.totalPages > 1 && (
              <div className="market__pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Anterior
                </button>

                <span>
                  Página {currentPage} de {metadata.totalPages}
                </span>

                <button
                  disabled={currentPage === metadata.totalPages}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, metadata.totalPages)
                    )
                  }
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <ArtistCardModal
        artist={selectedArtist}
        isOpen={isModalOpen}
        isOwnerView={true}
        onClose={handleCloseModal}
        onSell={handleSellArtist}
        onDelete={handleDeleteArtist}
        onEdit={handleOpenEditModal}
      />

      <ArtistFormModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={isEditMode ? handleUpdateArtist : handleCreateArtist}
        initialValues={isEditMode ? selectedArtist : null}
      />

    </div>
  );
}