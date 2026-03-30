// src/components/LeilaoDetail.jsx
// Detalhes do lote com navegação por swipe, efeito elástico e botão de lance.
// Offline: botão desabilitado + mensagem explicativa.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useAppContext } from "../context/AppContext";
import { useToast } from "./Toast";

export default function LeilaoDetail() {
  // Lê diretamente do contexto para que a navegação entre lotes funcione
  const { isOnline, leiloes, currentIndex, setCurrentIndex } = useAppContext();
  const lote  = leiloes[currentIndex] ?? null;
  const total = leiloes.length;

  const [rubber,  setRubber]  = useState(false);
  const [bidDone, setBidDone] = useState(false);
  const navigate = useNavigate();
  const toast    = useToast();

  const triggerRubber = () => {
    setRubber(true);
    setTimeout(() => setRubber(false), 250);
  };

  const goTo = (i) => {
    if (i < 0 || i >= total) { triggerRubber(); return; }
    setCurrentIndex(i);
  };

  const handlers = useSwipeable({
    onSwipedLeft:  ({ absX }) => { if (absX > window.innerWidth * 0.15) goTo(currentIndex + 1); },
    onSwipedRight: ({ absX }) => { if (absX > window.innerWidth * 0.15) goTo(currentIndex - 1); },
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

  // Todos os campos disponíveis na tabela lote
  const fields = [
    // Identificação
    ["Nº do Lote",      lote.numero_lote ?? lote.numero ?? lote.id],
    ["Tipo de Veículo", lote.tipo_veiculo ?? lote.tipo],
    // Veículo
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
    // Opcionais
    ["Ar Condicionado", lote.ar        != null ? (lote.ar        ? "✅ Sim" : "❌ Não") : null],
    ["Ligando",         lote.ligando   != null ? (lote.ligando   ? "✅ Sim" : "❌ Não") : null],
    ["IPVA Pago",       lote.ipva_pago != null ? (lote.ipva_pago ? "✅ Sim" : "❌ Não") : null],
    // Documentação / estado
    ["Chassi",          lote.chassi],
    ["Placa",           lote.placa],
    ["Renavam",         lote.renavam],
    ["Categoria",       lote.categoria],
    ["Situação",        lote.situacao],
    // Localização
    ["Cidade",          lote.cidade],
    ["Estado",          lote.estado ?? lote.uf],
    ["Pátio",           lote.patio],
    // Valores
    ["Valor de Tabela", lote.valor_tabela != null
                          ? `R$ ${Number(lote.valor_tabela).toLocaleString("pt-BR")}`
                          : null],
    ["Valor Inicial",   lote.valor_inicial != null
                          ? `R$ ${Number(lote.valor_inicial).toLocaleString("pt-BR")}`
                          : null],
    ["Valor de Venda",  lote.valor_venda != null
                          ? `R$ ${Number(lote.valor_venda).toLocaleString("pt-BR")}`
                          : null],
    // Outros
    ["Observações",     lote.observacoes ?? lote.obs],
  ].filter(([, val]) => val != null && val !== "" && val !== undefined);

  const maxDots = Math.min(total, 7);
  const dots    = total > 1
    ? Array.from({ length: maxDots }, (_, i) => {
        const mapped = Math.round((i / (maxDots - 1 || 1)) * (total - 1));
        return mapped === currentIndex;
      })
    : [];

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
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.75rem", color: "var(--clr-muted)" }}>VEÍCULO</div>
          <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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

        {/* Preço */}
        <div className="card" style={{ background: "var(--clr-surface2)", marginTop: 12 }}>
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