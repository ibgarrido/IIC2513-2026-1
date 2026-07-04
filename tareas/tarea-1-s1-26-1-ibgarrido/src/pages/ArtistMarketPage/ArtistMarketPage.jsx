import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import ArtistCardModal from "../../components/ArtistCardModal/ArtistCardModal";
import Navbar from "../../components/Navbar/Navbar";
import "./ArtistMarketPage.css";

export default function ArtistMarketPage() {
  const navigate = useNavigate();


  // Source: https://www.freecodecamp.org/news/how-to-use-axios-with-react/ (Sin Syntactic Sugar)
  // State para guardar datos de backend
  const [userProfile, setUserProfile] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [artists, setArtists] = useState([]); 
  const [metadata, setMetadata] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [selectedArtist, setSelectedArtist] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(""); 

  // Primera parte: Cargar datos del usuario (Perfil y balance)
  // Source: https://medium.com/better-programming/handling-async-errors-with-axios-in-react-1e25c058a8c9
  // Source: https://youtu.be/2QgpLKJl0pg?t=1575
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("https://t1-back-2026-s1.onrender.com/api/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        //console.log("Perfil del usuario:", response.data); // Debug
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error obteniendo perfil:", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserProfile(null);
    navigate("/");
  };

  // Parte 2: Cargar artistas en venta
  //Guardar la función de fetch con useCallback para evitar re-renderizados innecesarios
  //Source: https://stackoverflow.com/questions/63333044/handling-api-calls-using-useeffect-vs-using-usecallback
  const fetchArtist = useCallback(async (page = currentPage, query = searchQuery) => {
    try {
      let url = `https://t1-back-2026-s1.onrender.com/api/artists?forSale=true&limit=9&page=${page}`;
      
      if (query.trim() !== "") {
        url += `&search=${encodeURIComponent(query.trim())}`;
      }

      const response = await axios.get(url);
      setArtists(response.data.data);
      setMetadata(response.data.meta);
    } catch (error) {
      console.error("Error obteniendo artistas:", error);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchArtist(currentPage);
  }, [currentPage, fetchArtist]);


  // Parte 3: Modal de artista seleccionado (Buy/Sell)

  // Source Para el post: https://www.geeksforgeeks.org/reactjs/axios-in-react-a-guide-for-beginners/
  // source: https://youtu.be/2QgpLKJl0pg?t=1799
  // Compra
  const handleBuyArtist = async (artistId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://t1-back-2026-s1.onrender.com/api/artists/${artistId}/buy`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message || response.data.Message || "Artista comprado exitosamente");

      const newBalance = response.data.newBalance;
      setUserProfile((prev) => ({ ...prev, balance: newBalance })); // Actualizar balance en el perfil del usuario
      await fetchArtist(1); // Refrescar artistas para actualizar el estado de "forSale"
      setSelectedArtist(null); // Cerrar modal
      setIsModalOpen(false); // Cerrar modal 

    } catch (error) {
      const errorMsg = error.response?.data?.error || "Error al comprar";
      alert(errorMsg);
    }
  };

  // Venta
  const handleSellArtist = async (artistId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `https://t1-back-2026-s1.onrender.com/api/artists/${artistId}/sell`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { message, Message, newBalance } = response.data;
      alert(message || Message || "Artista vendido exitosamente");

      setUserProfile((prev) => ({ ...prev, balance: newBalance }));
      await fetchArtist(1);
      setSelectedArtist(null);
      setIsModalOpen(false);

    } catch (error) {
      const errorMsg = error.response?.data?.error || "Error al vender";
      alert(errorMsg);
    }
  };

  // Funciones para abrir/cerrar modal
  const handleOpenModal = (artist) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedArtist(null);
    setIsModalOpen(false);
  };
  // Mientras se resuelven las promesas para cargar el perfil del usuario
  if (loading) {
    return <div className="market">Cargando datos del usuario...</div>;
  }

  return (
    <div className="market">
      <Navbar userProfile={userProfile} onLogout={handleLogout} />
      <div className="market__aurora" aria-hidden="true" />

      <main className="market__grid__container">
        <h1>Market</h1>
        <div className="market__grid">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} onOpenModal={handleOpenModal} />
          ))}
        </div>

        {metadata && (
          <div className="market__pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, metadata.totalPages))}
              disabled={currentPage === metadata.totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </main>

      <ArtistCardModal
        artist={selectedArtist}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBuy={handleBuyArtist}
        onSell={handleSellArtist}
      />
    </div>
  );
}