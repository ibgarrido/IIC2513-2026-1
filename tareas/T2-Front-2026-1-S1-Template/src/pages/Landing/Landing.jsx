import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { fetchArtists } from "../../api/artists";
import "./Landing.css";

const PLACEHOLDER_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="#1a1a1a" width="80" height="80"/><text x="50%" y="50%" fill="#FF007A" font-family="sans-serif" font-size="10" text-anchor="middle" dominant-baseline="middle">DCC</text></svg>`
  );

function subscribeToken(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getTokenSnapshot() {
  return localStorage.getItem("token") ?? "";
}

function getServerSnapshot() {
  return "";
}

const LANDING_GRID_CELLS = 25;
const LANDING_FETCH_LIMIT = 40;
const LANDING_MAX_PAGES = 15;

async function fetchMarketArtistsForLanding() {
  const merged = [];
  let page = 1;
  let totalPages = 1;

  while (merged.length < LANDING_GRID_CELLS && page <= LANDING_MAX_PAGES) {
    const res = await fetchArtists(page, LANDING_FETCH_LIMIT);
    const chunk = Array.isArray(res?.data) ? res.data : [];
    totalPages = Math.max(1, Number(res?.meta?.totalPages) || 1);
    for (const a of chunk) {
      if (a.ownerId != null) continue;
      merged.push(a);
      if (merged.length >= LANDING_GRID_CELLS) break;
    }
    if (chunk.length === 0) break;
    if (page >= totalPages) break;
    page += 1;
  }

  return merged;
}

export default function Landing() {
  const token = useSyncExternalStore(
    subscribeToken,
    getTokenSnapshot,
    getServerSnapshot
  );
  const isLoggedIn = Boolean(token);
  const [preview, setPreview] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchMarketArtistsForLanding();
        if (!cancelled) setPreview(list);
      } catch {
        if (!cancelled) setPreview([]);
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const gridSlots25 = useMemo(() => {
    const cells = preview.slice(0, LANDING_GRID_CELLS);
    while (cells.length < LANDING_GRID_CELLS) cells.push(null);
    return cells;
  }, [preview]);

  return (
    <div className="landing-container">
      <div className="landing-ambient" aria-hidden="true">
        <span className="landing-ambient-orb landing-ambient-orb--a" />
        <span className="landing-ambient-orb landing-ambient-orb--b" />
      </div>
      <div className="background-decor">
        <div className="glow-primary landing-glow-pulse" />
        <div className="glow-accent" />
        <div className="grainy-bg" />
      </div>

      <div className="landing-stack">
        <div className="landing-main">
          <section className="landing-primary" aria-labelledby="landing-brand">
            <p className="landing-welcome">Bienvenido</p>
            <h1
              id="landing-brand"
              className="landing-logo font-brutalist-header"
            >
              DCC<span className="landing-logo-accent">Palooza</span>
            </h1>

            <p className="landing-mandate">
              En <strong>2027</strong>, tú eres quien gestiona la contratación de
              artistas para este festival: fichajes, precios y publicación en el
              mercado general.
            </p>

            {!isLoggedIn ? (
              <div className="landing-cta-block">
                <div className="landing-actions landing-actions--single login-actions--unified">
                  <Link to="/login" className="landing-btn primary">
                    Ingresar al Portal
                  </Link>
                </div>
                <p className="landing-hint">
                  Si no tienes cuenta, se creará una automágicamente al ingresar.
                </p>
              </div>
            ) : (
              <div className="landing-cta-block landing-cta-block--session">
                <div className="landing-actions landing-actions--single landing-actions--market">
                  <Link to="/mercado" className="landing-btn primary">
                    Ir al mercado de artistas
                  </Link>
                </div>
              </div>
            )}
          </section>

          <aside className="landing-teaser-aside">
            {!isLoggedIn ? (
              <Link
                to="/mercado"
                className="landing-teaser landing-teaser--pulse"
              >
                <span className="landing-teaser-kicker">Vistazo al mercado</span>
                <div
                  className="landing-teaser-grid landing-teaser-grid--5x5"
                  data-nosnippet
                  aria-hidden="true"
                >
                  {previewLoading ? (
                    Array.from({ length: LANDING_GRID_CELLS }, (_, i) => (
                      <span key={`sk-${i}`} className="landing-teaser-skel" />
                    ))
                  ) : (
                    gridSlots25.map((a, i) => (
                      <span
                        key={a?.id ?? `ph-${i}`}
                        className="landing-teaser-chip"
                        title={a?.name ?? "Tu próximo fichaje"}
                      >
                        <img
                          src={a?.imageUrl || a?.image_url || PLACEHOLDER_IMG}
                          alt=""
                          className="landing-teaser-img"
                        />
                        <span className="landing-teaser-name">
                          {a?.name ?? "Fichaje"}
                        </span>
                      </span>
                    ))
                  )}
                </div>
                <span className="landing-teaser-cta">Ver mercado completo</span>
              </Link>
            ) : (
              <Link to="/mercado" className="landing-teaser landing-teaser--logged">
                <span className="landing-teaser-kicker">Sigues dentro</span>
                <div
                  className="landing-teaser-grid landing-teaser-grid--5x5"
                  data-nosnippet
                  aria-hidden="true"
                >
                  {previewLoading ? (
                    Array.from({ length: LANDING_GRID_CELLS }, (_, i) => (
                      <span key={`skl-${i}`} className="landing-teaser-skel" />
                    ))
                  ) : (
                    gridSlots25.map((a, i) => (
                      <span
                        key={a?.id ?? `lg-${i}`}
                        className="landing-teaser-chip"
                        title={a?.name ?? "Mercado"}
                      >
                        <img
                          src={a?.imageUrl || a?.image_url || PLACEHOLDER_IMG}
                          alt=""
                          className="landing-teaser-img"
                        />
                        <span className="landing-teaser-name">
                          {a?.name ?? "Mercado"}
                        </span>
                      </span>
                    ))
                  )}
                </div>
                <span className="landing-teaser-cta">Ver mercado completo</span>
              </Link>
            )}
          </aside>
        </div>

        <div
          className="landing-hero-badges landing-hero-badges--below"
          aria-hidden="true"
        >
          <span className="landing-badge">Mercado vivo</span>
          <span className="landing-badge landing-badge--accent">LC</span>
          <span className="landing-badge">2027</span>
        </div>

        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <p className="landing-copyright">
              © Derechos reservados{" "}
              <span className="landing-copyright-brand">DCCPALOOZA</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
