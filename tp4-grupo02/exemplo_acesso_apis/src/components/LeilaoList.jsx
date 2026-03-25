// src/components/LeilaoList.jsx
import { useCallback, useEffect, useRef, useState } from "react";

const BASE_URL = "http://ec2-3-20-227-42.us-east-2.compute.amazonaws.com:3000";
const PTR_THRESHOLD = 80;

export default function LeilaoList({ token, onSelect, onData }) {
  const [leiloes, setLeiloes] = useState(null);        // lista de leilões da API
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [loadingLeilaoId, setLoadingLeilaoId] = useState(null); // feedback por card

  const touchStartY = useRef(0);
  const containerRef = useRef(null);

  // 1. Busca /leiloes — lista geral, sem id fixo
  const fetchLeiloes = useCallback(
    (isRefresh = false) => {
      if (!token) return;
      isRefresh ? setRefreshing(true) : setLoading(true);
      fetch(`${BASE_URL}/leiloes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => setLeiloes(Array.isArray(d) ? d : []))
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
          setPullY(0);
        });
    },
    [token]
  );

  useEffect(() => { fetchLeiloes(); }, [fetchLeiloes]);

  // 2. Ao clicar num leilão, busca /leiloes/:id/lotes dinamicamente
  const handleSelectLeilao = useCallback(
    (leilao) => {
      setLoadingLeilaoId(leilao.id);
      fetch(`${BASE_URL}/leiloes/${leilao.id}/lotes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((lotes) => {
          const data = Array.isArray(lotes) ? lotes : [];
          onData?.(data);   // atualiza estado global de lotes no App
          onSelect(0);      // navega para o detalhe do primeiro lote
        })
        .finally(() => setLoadingLeilaoId(null));
    },
    [token, onData, onSelect]
  );

  // 3. Live — sorteia um leilão aleatório e carrega os lotes dele
  const handleLive = () => {
    if (!leiloes || leiloes.length === 0) return;
    const random = leiloes[Math.floor(Math.random() * leiloes.length)];
    handleSelectLeilao(random);
  };

  // Pull-to-refresh
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

  if (loading) {
    return (
      <div className="container">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 80 }} />
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
      style={{ overflowY: "auto", height: "100%" }}
    >
      {/* Pull-to-refresh indicator */}
      <div
        className="ptr-indicator"
        style={{
          height: pullY,
          opacity: pullY / PTR_THRESHOLD,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: pullY === 0 ? "height 0.3s" : "none",
        }}
      >
        {refreshing
          ? "🔄 Atualizando..."
          : pullY >= PTR_THRESHOLD
          ? "⬆️ Solte para atualizar"
          : "⬇️ Puxe para atualizar"}
      </div>

      {/* Botão Live */}
      <div style={{ padding: "12px 0 4px" }}>
        <button
          onClick={handleLive}
          disabled={!leiloes || leiloes.length === 0}
          style={{
            width: "100%",
            backgroundColor: "#e74c3c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          🔴 Live — Ver leilão aleatório
        </button>
      </div>

      {/* Lista de leilões */}
      {leiloes?.map((leilao) => (
        <div
          key={leilao.id}
          className="card"
          onClick={() => handleSelectLeilao(leilao)}
          style={{
            opacity: loadingLeilaoId === leilao.id ? 0.5 : 1,
            cursor: "pointer",
          }}
        >
          {loadingLeilaoId === leilao.id && (
            <p style={{ color: "#007bff", margin: "0 0 8px" }}>
              Carregando lotes...
            </p>
          )}
          <h3>{leilao.nome || `Leilão #${leilao.id}`}</h3>
          <p>Data: {leilao.data_inicio || "—"}</p>
          <p>Tipo: {leilao.tipo || "—"}</p>
          <p>Leiloeiro: {leilao.leiloeiro || "—"}</p>
          <p>
            {leilao.cidade || "—"} / {leilao.estado || "—"}
          </p>
        </div>
      ))}
    </div>
  );
}