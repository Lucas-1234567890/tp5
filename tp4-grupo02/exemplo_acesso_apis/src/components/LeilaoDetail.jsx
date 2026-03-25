// src/components/LeilaoDetail.jsx
// Detalhes do lote com navegação por swipe, efeito elástico e botão de lance.
// Offline: botão desabilitado + mensagem explicativa.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useAppContext } from "../context/AppContext";
import { useToast } from "./Toast";

export default function LeilaoDetail({ lote, index, total, onChangeIndex }) {
  const { isOnline } = useAppContext();
  const [rubber, setRubber] = useState(false);
  const [bidDone, setBidDone] = useState(false);
  const navigate = useNavigate();
  const toast    = useToast();

  const triggerRubber = () => {
    setRubber(true);
    setTimeout(() => setRubber(false), 250);
  };

  const handlers = useSwipeable({
    onSwipedLeft:  ({ absX }) => {
      if (absX > window.innerWidth * 0.15)
        index + 1 >= total ? triggerRubber() : onChangeIndex(index + 1);
    },
    onSwipedRight: ({ absX }) => {
      if (absX > window.innerWidth * 0.15)
        index - 1 < 0 ? triggerRubber() : onChangeIndex(index - 1);
    },
    delta: 10,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (!lote) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "var(--clr-muted)" }}>
        <p style={{ fontSize: "2rem" }}>🚗</p>
        <p>Nenhum veículo selecionado.</p>
        <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => navigate("/")}>
          Voltar à lista
        </button>
      </div>
    );
  }

  const fields = [
    ["Marca",           lote.marca],
    ["Modelo",          lote.modelo],
    ["Ano Fabricação",  lote.ano_fabricacao],
    ["Ano Modelo",      lote.ano_modelo],
    ["Combustível",     lote.combustivel],
    ["KM",              lote.km ? `${lote.km.toLocaleString("pt-BR")} km` : null],
    ["Direção",         lote.direcao],
    ["Câmbio",          lote.automatico ? "Automático" : "Manual"],
    ["Ar Condicionado", lote.ar        ? "✅ Sim" : "❌ Não"],
    ["Ligando",         lote.ligando   ? "✅ Sim" : "❌ Não"],
    ["IPVA Pago",       lote.ipva_pago ? "✅ Sim" : "❌ Não"],
  ];

  // pager dots: show up to 7
  const maxDots = Math.min(total, 7);
  const dots    = Array.from({ length: maxDots }, (_, i) => {
    const mapped = Math.round((i / (maxDots - 1)) * (total - 1));
    return mapped === index;
  });

  const handleBid = () => {
    if (!isOnline) { toast.show("Sem conexão — lance não enviado", "error"); return; }
    setBidDone(true);
    toast.show("Lance registrado com sucesso! 🎉", "success");
    setTimeout(() => setBidDone(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate("/")} aria-label="Voltar">←</button>
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--clr-muted)" }}>VEÍCULO</div>
          <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700 }}>
            {lote.marca} {lote.modelo}
          </div>
        </div>
        {total > 1 && (
          <div className="detail-pager">
            {dots.map((active, i) => (
              <div key={i} className={`pager-dot ${active ? "active" : ""}`} />
            ))}
          </div>
        )}
      </div>

      {/* Swipeable content */}
      <div {...handlers} className={"container" + (rubber ? " rubber" : "")}
        style={{ flex: 1, overflowY: "auto", paddingTop: 4 }}>

        {/* Price highlight */}
        <div className="card" style={{ background: "var(--clr-surface2)", marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--clr-muted)", marginBottom: 2 }}>LANCE ATUAL</div>
              <div className="field-value price" style={{ fontSize: "1.6rem" }}>
                R$ {Number(lote.lance || 0).toLocaleString("pt-BR")}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--clr-muted)", marginBottom: 2 }}>VALOR INICIAL</div>
              <div style={{ color: "var(--clr-muted)", fontWeight: 600 }}>
                R$ {Number(lote.valor_inicial || 0).toLocaleString("pt-BR")}
              </div>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="card detail-fields" style={{ padding: 0, overflow: "hidden" }}>
          {fields.map(([label, val]) => (
            <div className="field-row" key={label} style={{ padding: "10px 16px" }}>
              <span className="field-label">{label}</span>
              <span className="field-value">{val || <span style={{ color: "var(--clr-muted)" }}>—</span>}</span>
            </div>
          ))}
        </div>

        {/* Position counter */}
        <div className="swipe-hint">
          <span>←</span>
          <span>{index + 1} de {total}</span>
          <span>→</span>
        </div>
      </div>

      {/* Bid footer */}
      <div className="bid-footer">
        {!isOnline && (
          <p style={{ fontSize: "0.78rem", color: "var(--clr-danger)", textAlign: "center", marginBottom: 8 }}>
            ⚠ Offline — lances desabilitados
          </p>
        )}
        <button
          className={`btn ${bidDone ? "btn-ghost" : "btn-primary"}`}
          style={{ width: "100%", fontSize: "1rem" }}
          onClick={handleBid}
          disabled={!isOnline || bidDone}
        >
          {bidDone ? "✅ Lance Registrado" : "🔨 Dar Lance"}
        </button>
      </div>
    </div>
  );
}