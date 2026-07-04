import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  buyArtist,
  fetchArtistsForSale,
} from "../../api/artists";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import ConfirmActionModal from "../../components/ConfirmActionModal/ConfirmActionModal";
import SearchBar from "../../components/SearchBar/SearchBar";
import StatusMessageModal from "../../components/StatusMessageModal/StatusMessageModal";
import { getApiErrorMessage } from "../../utils/apiError";
import { scrollDashboardToTop } from "../../utils/scrollDashboard";
import {
  artistImageUrl,
  artistOwnerId,
  genresToDisplay,
} from "../../utils/artistFromApi";
import "./ArtistMarketPage.css";

const PLACEHOLDER_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="#1a1a1a" width="400" height="400"/><text x="50%" y="50%" fill="#FF007A" font-family="sans-serif" font-size="18" text-anchor="middle" dominant-baseline="middle">DCC</text></svg>`
  );

function mapArtist(apiArtist, userBalance) {
  return {
    id: apiArtist.id,
    name: apiArtist.name,
    genre: genresToDisplay(apiArtist.genres),
    hype: apiArtist.hypeLevel ?? 0,
    price: apiArtist.price ?? 0,
    img: artistImageUrl(apiArtist, PLACEHOLDER_IMG),
    ownerUsername: apiArtist.owner?.username ?? null,
    ownerId: artistOwnerId(apiArtist),
    userBalance:
      typeof userBalance === "number" && Number.isFinite(userBalance)
        ? userBalance
        : undefined,
  };
}

export default function ArtistMarketPage() {
  const { user, setUser } = useOutletContext() ?? {};
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [transactionResult, setTransactionResult] = useState(null);
  const skipPageScrollRef = useRef(true);
  const [buyConfirm, setBuyConfirm] = useState(null);

  const handleSearch = () => {
    const nextQuery = search.trim();
    setPage(1);
    setSearchQuery(nextQuery);
  };

  const toggleFavoritesFilter = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setPage(1);
    setFavoritesOnly((v) => !v);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchArtistsForSale(page, limit, searchQuery, favoritesOnly);
      setData(Array.isArray(res.data) ? res.data : []);
      setMeta(res.meta ?? null);
    } catch {
      setError("No pudimos cargar el mercado. Intenta más tarde.");
      setData([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, favoritesOnly]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (skipPageScrollRef.current) {
      skipPageScrollRef.current = false;
      return;
    }
    scrollDashboardToTop();
  }, [page]);

  const mappedData = useMemo(() => {
    const bal = user?.balance;
    return data.map((a) => mapArtist(a, bal));
  }, [data, user?.balance]);

  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.currentPage ?? page;

  const handleBuy = async (artist) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const { id, name, price } = artist;
    setBusyId(id);
    try {
      const res = await buyArtist(id);
      if (typeof res?.newBalance === "number") {
        setUser?.((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, balance: res.newBalance };
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });
      }
      await load();
      setTransactionResult({
        success: true,
        title: "¡CONTRATO ASEGURADO!",
        data: {
          bookingFee: price,
        },
      });
    } catch (e) {
      const errorMsg = getApiErrorMessage(e);
      const isBudgetError = errorMsg.toLowerCase().includes("balance") || errorMsg.toLowerCase().includes("costo") || errorMsg.toLowerCase().includes("puedes");

      setTransactionResult({
        success: false,
        title: isBudgetError ? "¡PRESUPUESTO EXCEDIDO!" : "SALDO INSUFICIENTE",
        data: {
          remainingBalance: user?.balance || 0,
          bookingPrice: price,
        },
      });
    } finally {
      setBusyId(null);
    }
  };

  const confirmBuy = () => {
    if (!buyConfirm) return;
    const artist = buyConfirm;
    setBuyConfirm(null);
    handleBuy(artist);
  };

  return (
    <main className="artist-market-page">
      <header className="artist-market-page-header">
        <h1 className="font-headline artist-market-page-title">
          Mercado de <span className="artist-market-highlight">artistas</span>
        </h1>
        <div className="artist-market-filter-bar">
          <button
            type="button"
            className={`artist-market-favorites-toggle${favoritesOnly ? " artist-market-favorites-toggle--on" : ""}`}
            onClick={toggleFavoritesFilter}
            title={
              user
                ? favoritesOnly
                  ? "Volver a ver todo el mercado"
                  : "Ver solo tus favoritos"
                : "Inicia sesión para usar favoritos"
            }
          >
            <span className="material-symbols-outlined" aria-hidden>
              {favoritesOnly ? "star" : "star_outline"}
            </span>
            {favoritesOnly ? "Sacar favoritos" : "Filtrar por favoritos"}
          </button>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            placeholder="Buscar en el mercado…"
            ariaLabel="Buscar en el mercado"
            className="artist-market-search-box"
          />
        </div>
      </header>



      <section className="artist-market-section">

        {error ? (
          <p
            className="artist-market-alert artist-market-alert--error artist-market-alert--row"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="artist-market-alert artist-market-alert--row">Cargando mercado…</p>
        ) : (
          <>
            <div className="artist-market-artist-grid">
              {mappedData.length === 0 ? (
                <p className="artist-market-alert artist-market-alert--row">
                  {favoritesOnly
                    ? "No hay favoritos en esta página o con esta búsqueda."
                    : "No hay resultados en esta página."}
                </p>
              ) : (
                mappedData.map((artist) => (
                  <div className="artist-market-artist-cell" key={artist.id}>
                    <ArtistCard
                      artist={artist}
                      variant="marketplace"
                      currentUserId={user?.id}
                      busyId={busyId}
                      onBuy={(artist) => setBuyConfirm(artist)}
                    />
                  </div>
                ))
              )}
            </div>

            {meta && totalPages > 1 ? (
              <div className="artist-market-pagination">
                <button
                  type="button"
                  className="artist-market-pagination-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </button>
                <span className="artist-market-pagination-meta">
                  Página {currentPage} de {totalPages}
                  {typeof meta.totalItems === "number"
                    ? ` · ${meta.totalItems} artistas`
                    : ""}
                </span>
                <button
                  type="button"
                  className="artist-market-pagination-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                >
                  Siguiente
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>

      <ConfirmActionModal
        open={Boolean(buyConfirm)}
        title="¿Confirmar compra?"
        message={
          buyConfirm ? (
            <>
              ¿Seguro que quieres comprar a{" "}
              <strong>{buyConfirm.name}</strong> por{" "}
              {buyConfirm.price.toLocaleString()} LollaCoins?
            </>
          ) : null
        }
        confirmLabel="Sí, comprar"
        cancelLabel="No"
        onCancel={() => setBuyConfirm(null)}
        onConfirm={confirmBuy}
      />

      <StatusMessageModal
        open={Boolean(transactionResult)}
        success={transactionResult?.success}
        title={transactionResult?.title}
        data={transactionResult?.data}
        onClose={() => setTransactionResult(null)}
        primaryActionText="VER MIS CONTRATADOS"
        onPrimaryAction={() => {
          setTransactionResult(null);
          navigate("/mis-artistas");
        }}
        secondaryActionText="SEGUIR EXPLORANDO"
      />
    </main>
  );
}
