// src/components/__tests__/ApiDebug.jsx
// ⚠️ APENAS PARA DESENVOLVIMENTO — visualização crua da API
// Acesse pela rota /api-debug (adicionar temporariamente no App.jsx)
// Remove antes de entregar a versão final.
import { useState } from "react";

const BASE_URL = "http://ec2-3-20-227-42.us-east-2.compute.amazonaws.com:3000";
const DEFAULT_USER = "leilao_test_api";
const DEFAULT_PASS = "Ftwj029E";

const ENDPOINTS = [
  { label: "GET /leiloes",                        url: "/leiloes" },
  { label: "GET /leiloes/10/lotes",               url: "/leiloes/10/lotes" },
  { label: "GET /leiloes/135/lotes",              url: "/leiloes/135/lotes" },
  { label: "GET /leiloes/135/lotes/tipos",        url: "/leiloes/135/lotes/tipos" },
  { label: "GET /leiloes/135/lotes/tipos_veiculos", url: "/leiloes/135/lotes/tipos_veiculos" },
  { label: "GET /leiloes/135/lotes/anos_fabricacao", url: "/leiloes/135/lotes/anos_fabricacao" },
  { label: "GET /lotes/busca?tipo_veiculo=MOTO",  url: "/lotes/busca?tipo_veiculo=MOTO" },
  { label: "GET /leiloes/leiloeiros",             url: "/leiloes/leiloeiros" },
  { label: "GET /leiloes/cidades_estados",        url: "/leiloes/cidades_estados" },
  { label: "GET /leiloes/tipos",                  url: "/leiloes/tipos" },
];

export default function ApiDebug() {
  const [token,    setToken]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [endpoint, setEndpoint] = useState(ENDPOINTS[0].url);
  const [customUrl, setCustomUrl] = useState("");
  const [error,    setError]    = useState(null);
  const [loginErr, setLoginErr] = useState(null);
  const [leilaoId, setLeilaoId] = useState("10");

  const handleLogin = async () => {
    setLoginErr(null);
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username: DEFAULT_USER, password: DEFAULT_PASS }),
      });
      const data = await res.json();
      if (!data.accessToken) throw new Error("Token não recebido");
      setToken(data.accessToken);
    } catch (e) {
      setLoginErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async (url) => {
    if (!token) { setError("Faça login primeiro"); return; }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res  = await fetch(`${BASE_URL}${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Estilos inline para não depender do CSS do projeto
  const s = {
    page:    { fontFamily: "monospace", background: "#0d0f14", color: "#eef0f5", minHeight: "100vh", padding: 16 },
    h1:      { color: "#f5a623", fontSize: "1.2rem", marginBottom: 12, fontFamily: "sans-serif" },
    section: { marginBottom: 16 },
    label:   { fontSize: "0.75rem", color: "#7a8299", display: "block", marginBottom: 4 },
    input:   { background: "#1e2330", border: "1px solid #2a3040", color: "#eef0f5", padding: "8px 12px", borderRadius: 6, width: "100%", marginBottom: 8, fontFamily: "monospace" },
    btn:     { background: "#f5a623", color: "#000", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: 700, marginRight: 8, marginBottom: 6 },
    btnGhost:{ background: "transparent", border: "1px solid #2a3040", color: "#7a8299", borderRadius: 6, padding: "6px 12px", cursor: "pointer", marginRight: 6, marginBottom: 6, fontSize: "0.78rem" },
    pre:     { background: "#161a22", border: "1px solid #2a3040", borderRadius: 8, padding: 12, overflowX: "auto", fontSize: "0.72rem", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: "60vh", overflowY: "auto" },
    error:   { color: "#e84343", fontSize: "0.82rem", marginBottom: 8 },
    success: { color: "#2dd9a4", fontSize: "0.82rem", marginBottom: 8 },
    badge:   { background: "#1e2330", borderRadius: 4, padding: "2px 8px", fontSize: "0.7rem", color: "#7a8299", display: "inline-block", marginBottom: 4 },
  };

  const firstItem = Array.isArray(result) ? result[0] : result;

  return (
    <div style={s.page}>
      <div style={s.h1}>🔍 API Debug — TP5 LeilãoApp</div>
      <div style={{ ...s.badge, marginBottom: 12 }}>APENAS DESENVOLVIMENTO — remover antes da entrega</div>

      {/* Login */}
      <div style={s.section}>
        {!token ? (
          <>
            <button style={s.btn} onClick={handleLogin} disabled={loading}>
              {loading ? "Autenticando…" : "🔑 Autenticar (credenciais padrão)"}
            </button>
            {loginErr && <div style={s.error}>❌ {loginErr}</div>}
          </>
        ) : (
          <div style={s.success}>
            ✅ Autenticado &nbsp;
            <span style={{ ...s.badge, color: "#2dd9a4" }}>
              {token.slice(0, 20)}…
            </span>
            <button style={{ ...s.btnGhost, marginLeft: 8 }} onClick={() => { setToken(null); setResult(null); }}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Endpoints predefinidos */}
      <div style={s.section}>
        <div style={s.label}>ENDPOINTS RÁPIDOS</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {ENDPOINTS.map(ep => (
            <button key={ep.url} style={s.btnGhost} onClick={() => handleFetch(ep.url)}>
              {ep.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leilão dinâmico */}
      <div style={s.section}>
        <div style={s.label}>LEILÃO ESPECÍFICO (ID)</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ ...s.input, width: 80, marginBottom: 0 }}
            value={leilaoId}
            onChange={e => setLeilaoId(e.target.value)}
            placeholder="ID"
          />
          <button style={s.btnGhost} onClick={() => handleFetch(`/leiloes/${leilaoId}/lotes`)}>
            /leiloes/{leilaoId}/lotes
          </button>
          <button style={s.btnGhost} onClick={() => handleFetch(`/leiloes/${leilaoId}`)}>
            /leiloes/{leilaoId}
          </button>
        </div>
      </div>

      {/* URL customizada */}
      <div style={s.section}>
        <div style={s.label}>URL CUSTOMIZADA</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ ...s.input, marginBottom: 0, flex: 1 }}
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            placeholder="/leiloes/135/lotes"
          />
          <button style={s.btn} onClick={() => handleFetch(customUrl || "/leiloes")} disabled={loading}>
            {loading ? "…" : "Buscar"}
          </button>
        </div>
      </div>

      {error && <div style={s.error}>❌ {error}</div>}

      {/* Resultado */}
      {result !== null && (
        <div style={s.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={s.label}>
              RESULTADO &nbsp;
              {Array.isArray(result)
                ? `[Array de ${result.length} itens]`
                : "[Objeto]"
              }
            </div>
            <button style={s.btnGhost} onClick={() => setResult(null)}>✕ Limpar</button>
          </div>

          {/* Mapa de campos do primeiro item — útil para saber nomes reais */}
          {firstItem && typeof firstItem === "object" && (
            <div style={{ marginBottom: 8 }}>
              <div style={s.label}>📋 CAMPOS DO PRIMEIRO ITEM (para mapear no componente)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {Object.keys(firstItem).map(k => (
                  <span key={k} style={{ ...s.badge, color: "#3d6eff" }}>{k}: <span style={{ color: "#f5a623" }}>{typeof firstItem[k]}</span></span>
                ))}
              </div>
            </div>
          )}

          <pre style={s.pre}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}