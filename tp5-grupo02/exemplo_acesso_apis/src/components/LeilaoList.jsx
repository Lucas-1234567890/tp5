// src/components/LeilaoList.jsx
// Lista de leilões com pull-to-refresh, skeletons e botão Live.
// Cache offline via sessionStorage para funcionar sem conexão.
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";

const BASE_URL   = "http://ec2-3-20-227-42.us-east-2.compute.amazonaws.com:3000";
const CACHE_KEY  = "leiloes_cache";
const PTR_THRESHOLD = 80;

export default function LeilaoList({ token, onSelect, onData }) {
  const { isOnline } = useAppContext();
  const [leiloes,       setLeiloes]       = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [refreshing,    setRefreshing]    = useState(false);
  const [pullY,         setPullY]         = useState(0);
  const [loadingId,     setLoadingId]     = useState(null);

  const touchStartY  = useRef(0);
  const containerRef = useRef(null);

  const fetchLeiloes = useCallback((isRefresh = false) => {
    if (!token) return;
    isRefresh ? setRefreshing(true) : setLoading(true);

    fetch(`${BASE_URL}/leiloes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : [];
        setLeiloes(arr);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(arr));
      })
      .catch(() => {
       
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) setLeiloes(JSON.parse(cached));
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
        setPullY(0);
      });
  }, [token]);

  useEffect(() => {
    
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) setLeiloes(JSON.parse(cached));
    fetchLeiloes();
  }, [fetchLeiloes]);

 
  const handleSelectLeilao = useCallback((leilao) => {
    setLoadingId(leilao.id);
    fetch(`${BASE_URL}/leiloes/${leilao.id}/lotes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(lotes => {
        const data = Array.isArray(lotes) ? lotes : [];
        onData?.(data);
        onSelect(0);
      })
      .catch(() => {
        
        onData?.([]);
        onSelect(0);
      })
      .finally(() => setLoadingId(null));
  }, [token, onData, onSelect]);

 
  const handleLive = () => {
    if (!leiloes?.length) return;
    const random = leiloes[Math.floor(Math.random() * leiloes.length)];
    handleSelectLeilao(random);
  };

 
  const onTouchStart = (e) => {
    if (containerRef.current?.scrollTop === 0)
      touchStartY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (!touchStartY.current) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy > 0 && containerRef.current?.scrollTop === 0) {
      e.preventDefault();
      setPullY(Math.min(dy, PTR_THRESHOLD * 1.5));
    }
  };
  const onTouchEnd = () => {
    if (pullY >= PTR_THRESHOLD) fetchLeiloes(true);
    else setPullY(0);
    touchStartY.current = 0;
  };

 
  if (loading && !leiloes) {
    return (
      <div className="container" style={{ paddingTop: 16 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 100, marginBottom: 12 }} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="container ptr-container"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ overflowY: "auto", height: "100%", paddingTop: 8 }}
    >
     
      {!isOnline && (
        <div className="offline-banner">
          📡 Sem conexão — exibindo dados em cache
        </div>
      )}

  
      <div
        className="ptr-indicator"
        style={{
          height: pullY,
          opacity: pullY / PTR_THRESHOLD,
          transition: pullY === 0 ? "height 0.3s" : "none",
        }}
      >
        {refreshing ? "🔄 Atualizando…" : pullY >= PTR_THRESHOLD ? "⬆️ Solte para atualizar" : "⬇️ Puxe para atualizar"}
      </div>

      <button
        className="btn btn-live"
        onClick={handleLive}
        disabled={!leiloes?.length || !isOnline}
      >
        <span className="live-dot" />
        Live — Ver leilão aleatório
      </button>

     
      {leiloes?.map((leilao) => (
        <div
          key={leilao.id}
          className="card card-interactive leilao-card fade-up"
          onClick={() => handleSelectLeilao(leilao)}
          style={{ opacity: loadingId === leilao.id ? 0.5 : 1, cursor: "pointer" }}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && handleSelectLeilao(leilao)}
        >
          {loadingId === leilao.id && (
            <p style={{ fontSize: "0.8rem", color: "var(--clr-accent)", marginBottom: 4 }}>
              ⏳ Carregando lotes…
            </p>
          )}
          <div className="card-title">{leilao.nome || `Leilão #${leilao.id}`}</div>
          <div className="card-meta">
            <span>📅 {leilao.data_inicio || "—"}</span>
            <span>📍 {leilao.cidade || "—"}/{leilao.estado || "—"}</span>
          </div>
          <div className="card-footer">
            <span className="badge badge-primary">{leilao.tipo || "—"}</span>
            <span style={{ fontSize: "0.8rem", color: "var(--clr-muted)" }}>
              {leilao.leiloeiro || "—"}
            </span>
          </div>
        </div>
      ))}

      {leiloes?.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--clr-muted)" }}>
          Nenhum leilão disponível
        </div>
      )}
    </div>
  );
}