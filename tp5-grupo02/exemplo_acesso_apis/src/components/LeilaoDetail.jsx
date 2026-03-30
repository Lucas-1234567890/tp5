// src/components/LeilaoDetail.jsx
// Detalhes do lote com navegação por swipe, câmera integrada e fotos registradas por lote.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useAppContext } from "../context/AppContext";
import { useToast } from "./Toast";
import Camera from "./Camera";

export default function LeilaoDetail() {
  const {
    isOnline,
    leiloes,
    currentIndex,
    setCurrentIndex,
    addPhotoToLote,
    removePhotoFromLote,
    getPhotosForLote,
  } = useAppContext();

  const lote  = leiloes[currentIndex] ?? null;
  const total = leiloes.length;

  // ID único do lote para indexar fotos
  const loteId = lote?.id ?? lote?.numero_lote ?? lote?.numero ?? currentIndex;
  const photos = getPhotosForLote(loteId);

  const [rubber,    setRubber]    = useState(false);
  const [showCam,   setShowCam]   = useState(false);
  const [bidDone,   setBidDone]   = useState(false);
  const navigate = useNavigate();
  const toast    = useToast();

  const triggerRubber = () => {
    setRubber(true);
    setTimeout(() => setRubber(false), 250);
  };

  const goTo = (i) => {
    if (i < 0 || i >= total) { triggerRubber(); return; }
    setCurrentIndex(i);
    setShowCam(false); // fecha câmera ao trocar de lote
  };

  const handlers = useSwipeable({
    onSwipedLeft:  ({ absX }) => { if (absX > window.innerWidth * 0.15) goTo(currentIndex + 1); },
    onSwipedRight: ({ absX }) => { if (absX > window.innerWidth * 0.15) goTo(currentIndex - 1); },
    delta: 10,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleCapture = (photoUrl) => {
    addPhotoToLote(loteId, photoUrl);
    setShowCam(false);
    toast.show(`📸 Foto registrada neste lote!`, "success");
  };

  const handleDeletePhoto = (photoId) => {
    removePhotoFromLote(loteId, photoId);
    toast.show("Foto removida", "default");
  };

  const handleBid = () => {
    if (!isOnline) { toast.show("Sem conexão — lance não enviado", "error"); return; }
    setBidDone(true);
    toast.show("Lance registrado com sucesso! 🎉", "success");
    setTimeout(() => setBidDone(false), 3000);
  };

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

  // Todos os campos disponíveis na tabela lote
  const fields = [
    ["Nº do Lote",      lote.numero_lote ?? lote.numero ?? lote.id],
    ["Tipo de Veículo", lote.tipo_veiculo ?? lote.tipo],
    ["Marca",           lote.marca],
    ["Modelo",          lote.modelo],
    ["Versão",          lote.versao],
    ["Ano Fabricação",  lote.ano_fabricacao],
    ["Ano Modelo",      lote.ano_modelo],
    ["Cor",             lote.cor],
    ["Combustível",     lote.combustivel],
    ["Câmbio",          lote.automatico != null
                          ? (lote.automatico ? "Automático" : "Manual")
                          : null],
    ["Direção",         lote.direcao],
    ["KM",              lote.km != null
                          ? `${Number(lote.km).toLocaleString("pt-BR")} km`
                          : null],
    ["Ar Condicionado", lote.ar        != null ? (lote.ar        ? "✅ Sim" : "❌ Não") : null],
    ["Ligando",         lote.ligando   != null ? (lote.ligando   ? "✅ Sim" : "❌ Não") : null],
    ["IPVA Pago",       lote.ipva_pago != null ? (lote.ipva_pago ? "✅ Sim" : "❌ Não") : null],
    ["Chassi",          lote.chassi],
    ["Placa",           lote.placa],
    ["Renavam",         lote.renavam],
    ["Categoria",       lote.categoria],
    ["Situação",        lote.situacao],
    ["Cidade",          lote.cidade],
    ["Estado",          lote.estado ?? lote.uf],
    ["Pátio",           lote.patio],
    ["Valor de Tabela", lote.valor_tabela != null
                          ? `R$ ${Number(lote.valor_tabela).toLocaleString("pt-BR")}`
                          : null],
    ["Valor Inicial",   lote.valor_inicial != null
                          ? `R$ ${Number(lote.valor_inicial).toLocaleString("pt-BR")}`
                          : null],
    ["Valor de Venda",  lote.valor_venda != null
                          ? `R$ ${Number(lote.valor_venda).toLocaleString("pt-BR")}`
                          : null],
    ["Observações",     lote.observacoes ?? lote.obs],
  ].filter(([, val]) => val != null && val !== "" && val !== undefined);

  const maxDots = Math.min(total, 7);
  const dots    = total > 1
    ? Array.from({ length: maxDots }, (_, i) => {
        const mapped = Math.round((i / (maxDots - 1 || 1)) * (total - 1));
        return mapped === currentIndex;
      })
    : [];

  // ── Se câmera estiver aberta, renderiza só ela ────────
  if (showCam) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header simplificado */}
        <div className="detail-header">
          <button
            className="back-btn"
            onClick={() => setShowCam(false)}
            aria-label="Fechar câmera"
          >
            ←
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.75rem", color: "var(--clr-muted)" }}>FOTOGRAFAR VEÍCULO</div>
            <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {lote.marca} {lote.modelo}
            </div>
          </div>
          {photos.length > 0 && (
            <div style={{
              background: "var(--clr-primary)",
              color: "#000",
              borderRadius: 20,
              padding: "2px 10px",
              fontSize: "0.75rem",
              fontWeight: 700,
              fontFamily: "var(--ff-display)",
            }}>
              {photos.length} foto{photos.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="container" style={{ flex: 1, overflowY: "auto", paddingTop: 16 }}>
          <Camera
            onCapture={handleCapture}
            onClose={() => setShowCam(false)}
          />

          {/* Fotos já registradas neste lote */}
          {photos.length > 0 && (
            <>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 0 8px",
              }}>
                <span style={{
                  fontFamily: "var(--ff-display)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "var(--clr-text)",
                }}>
                  📁 Fotos deste lote ({photos.length})
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingBottom: 24 }}>
                {photos.map(p => (
                  <div key={p.id} style={{
                    position: "relative",
                    borderRadius: "var(--r-md)",
                    overflow: "hidden",
                    background: "var(--clr-surface2)",
                    border: "1px solid var(--clr-border)",
                  }}>
                    <img
                      src={p.url}
                      alt="foto do veículo"
                      style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
                    />
                    <button
                      onClick={() => handleDeletePhoto(p.id)}
                      style={{
                        position: "absolute", top: 6, right: 6,
                        background: "rgba(0,0,0,0.7)", color: "#fff",
                        border: "none", borderRadius: 20, width: 28, height: 28,
                        fontSize: "0.8rem", cursor: "pointer", minHeight: "unset", padding: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                      aria-label="Remover foto"
                    >
                      ✕
                    </button>
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "rgba(0,0,0,0.5)",
                      padding: "3px 6px",
                      fontSize: "0.62rem",
                      color: "rgba(255,255,255,0.7)",
                    }}>
                      {new Date(p.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Tela principal do detalhe ─────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate("/")} aria-label="Voltar">←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.75rem", color: "var(--clr-muted)" }}>VEÍCULO</div>
          <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {lote.marca} {lote.modelo}
          </div>
        </div>

        {/* Botão de câmera no header — sempre visível */}
        <button
          className="btn btn-ghost"
          onClick={() => setShowCam(true)}
          style={{
            minHeight: "unset",
            height: 36,
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.8rem",
            flexShrink: 0,
            position: "relative",
          }}
          aria-label="Fotografar veículo"
        >
          📷
          {photos.length > 0 && (
            <span style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "var(--clr-primary)",
              color: "#000",
              borderRadius: "50%",
              width: 16,
              height: 16,
              fontSize: "0.65rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--ff-display)",
            }}>
              {photos.length}
            </span>
          )}
        </button>

        {total > 1 && (
          <div className="detail-pager">
            {dots.map((active, i) => (
              <div key={i} className={`pager-dot ${active ? "active" : ""}`} />
            ))}
          </div>
        )}
      </div>

      {/* Swipeable content */}
      <div
        {...handlers}
        className={"container" + (rubber ? " rubber" : "")}
        style={{ flex: 1, overflowY: "auto", paddingTop: 4 }}
      >
        {/* Fotos já tiradas (preview compacto) */}
        {photos.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}>
              <span style={{ fontSize: "0.8rem", color: "var(--clr-muted)" }}>
                📁 {photos.length} foto{photos.length !== 1 ? "s" : ""} registrada{photos.length !== 1 ? "s" : ""}
              </span>
              <button
                className="btn btn-ghost"
                style={{ minHeight: "unset", height: 28, padding: "0 10px", fontSize: "0.75rem" }}
                onClick={() => setShowCam(true)}
              >
                Ver todas
              </button>
            </div>
            {/* Scroll horizontal de miniaturas */}
            <div style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 8,
              scrollbarWidth: "none",
            }}>
              {photos.map(p => (
                <img
                  key={p.id}
                  src={p.url}
                  alt="foto lote"
                  onClick={() => setShowCam(true)}
                  style={{
                    height: 72,
                    width: 96,
                    objectFit: "cover",
                    borderRadius: "var(--r-sm)",
                    border: "1px solid var(--clr-border)",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                />
              ))}
              {/* Botão "+" para adicionar mais */}
              <button
                onClick={() => setShowCam(true)}
                style={{
                  height: 72,
                  width: 72,
                  flexShrink: 0,
                  background: "var(--clr-surface2)",
                  border: "1px dashed var(--clr-border)",
                  borderRadius: "var(--r-sm)",
                  color: "var(--clr-muted)",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "unset",
                }}
                aria-label="Adicionar foto"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Preço */}
        <div className="card" style={{ background: "var(--clr-surface2)", marginTop: photos.length > 0 ? 4 : 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--clr-muted)", marginBottom: 2 }}>LANCE ATUAL</div>
              <div className="field-value price" style={{ fontSize: "1.6rem" }}>
                R$ {Number(lote.lance ?? 0).toLocaleString("pt-BR")}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--clr-muted)", marginBottom: 2 }}>VALOR INICIAL</div>
              <div style={{ color: "var(--clr-muted)", fontWeight: 600 }}>
                R$ {Number(lote.valor_inicial ?? 0).toLocaleString("pt-BR")}
              </div>
            </div>
          </div>
        </div>

        {/* Botão de câmera — destaque quando não há fotos ainda */}
        {photos.length === 0 && (
          <button
            className="btn btn-ghost"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 4,
              borderStyle: "dashed",
            }}
            onClick={() => setShowCam(true)}
          >
            📷 Fotografar este veículo
          </button>
        )}

        {/* Todos os campos do lote */}
        <div className="card detail-fields" style={{ padding: 0, overflow: "hidden" }}>
          {fields.map(([label, val]) => (
            <div className="field-row" key={label} style={{ padding: "10px 16px" }}>
              <span className="field-label">{label}</span>
              <span className="field-value">{val}</span>
            </div>
          ))}
        </div>

        {/* Navegação entre lotes */}
        {total > 1 && (
          <div style={{ display: "flex", gap: 8, padding: "8px 0 4px" }}>
            <button
              className="btn btn-ghost"
              style={{ flex: 1 }}
              disabled={currentIndex === 0}
              onClick={() => goTo(currentIndex - 1)}
            >
              ← Anterior
            </button>
            <span style={{ display: "flex", alignItems: "center", fontSize: "0.82rem", color: "var(--clr-muted)", whiteSpace: "nowrap" }}>
              {currentIndex + 1} / {total}
            </span>
            <button
              className="btn btn-ghost"
              style={{ flex: 1 }}
              disabled={currentIndex === total - 1}
              onClick={() => goTo(currentIndex + 1)}
            >
              Próximo →
            </button>
          </div>
        )}

        <div className="swipe-hint">
          <span>←</span>
          <span>{currentIndex + 1} de {total}</span>
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
      </div>
    </div>
  );
}