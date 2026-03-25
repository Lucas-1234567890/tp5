// src/components/ImovelForm.jsx
// Formulário de cadastro de veículo com busca de CEP, validação e câmera integrada.
// TP5: adicionado upload de foto via câmera do dispositivo.
import { useRef, useState } from "react";
import Camera from "./Camera";
import { useToast } from "./Toast";

const cepCache = {};

function fetchCep(cep) {
  const clean = cep.replace(/\D/g, "");
  if (cepCache[clean]) return Promise.resolve(cepCache[clean]);

  // Real ViaCEP API
  return fetch(`https://viacep.com.br/ws/${clean}/json/`)
    .then(r => { if (!r.ok) throw new Error("CEP não encontrado"); return r.json(); })
    .then(data => {
      if (data.erro) throw new Error("CEP não encontrado");
      const result = {
        logradouro: data.logradouro || "",
        bairro:     data.bairro     || "",
        cidade:     data.localidade || "",
        estado:     data.uf         || "",
      };
      cepCache[clean] = result;
      return result;
    })
    .catch(() => {
      // Fallback mock (offline / CORS)
      if (!/^\d{8}$/.test(clean) || clean.startsWith("00000")) {
        throw new Error("Formato de CEP inválido");
      }
      const mock = { logradouro: "Rua Exemplo", bairro: "Bairro Exemplo", cidade: "Cidade Exemplo", estado: "SP" };
      cepCache[clean] = mock;
      return mock;
    });
}

export default function ImovelForm({ onSave }) {
  const [cep,        setCep]        = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero,     setNumero]     = useState("");
  const [bairro,     setBairro]     = useState("");
  const [cidade,     setCidade]     = useState("");
  const [estado,     setEstado]     = useState("");
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [photo,      setPhoto]      = useState(null);
  const [showCam,    setShowCam]    = useState(false);

  const numeroRef = useRef(null);
  const toast     = useToast();

  const formatCep = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  };

  const handleLookup = () => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) { setError("CEP deve ter 8 dígitos"); return; }
    setError("");
    setLoading(true);
    fetchCep(cep)
      .then(data => {
        setLogradouro(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.cidade);
        setEstado(data.estado);
        setTimeout(() => numeroRef.current?.focus(), 100);
        toast.show("Endereço preenchido automaticamente", "success");
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleCepBlur = () => { if (cep.replace(/\D/, "").length === 8 && !logradouro) handleLookup(); };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) { setError("CEP inválido"); return; }
    if (error) return;
    onSave?.({ cep, logradouro, numero, bairro, cidade, estado, photo });
  };

  const isValid = cep.replace(/\D/g, "").length === 8 && !error;

  if (showCam) {
    return (
      <div style={{ paddingBottom: 16 }}>
        <div className="page-header">
          <h1 className="page-title">📸 <span>Foto do veículo</span></h1>
        </div>
        <div className="container" style={{ paddingTop: 12 }}>
          <Camera
            onCapture={(url) => setPhoto(url)}
            onClose={() => setShowCam(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 16 }}>
      <div className="page-header">
        <h1 className="page-title">➕ <span>Novo Veículo</span></h1>
      </div>

      <div className="container" style={{ paddingTop: 12 }}>
        <div className="card">

          {/* ── Photo section ─────────────────────── */}
          <div style={{ marginBottom: 16 }}>
            {photo ? (
              <div style={{ position: "relative", borderRadius: "var(--r-md)", overflow: "hidden" }}>
                <img src={photo} alt="veículo" className="photo-preview" />
                <button
                  onClick={() => setPhoto(null)}
                  style={{
                    position: "absolute", top: 8, right: 8,
                    background: "rgba(0,0,0,0.65)", color: "#fff",
                    border: "none", borderRadius: 20, padding: "4px 10px",
                    fontSize: "0.8rem", cursor: "pointer", minHeight: "unset",
                  }}
                >
                  Remover foto
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                onClick={() => setShowCam(true)}
              >
                📷 Fotografar veículo
              </button>
            )}
          </div>

          {/* ── CEP ───────────────────────────────── */}
          <label htmlFor="cep">CEP</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              id="cep"
              value={cep}
              onChange={e => { setCep(formatCep(e.target.value)); setError(""); }}
              onBlur={handleCepBlur}
              className={error ? "error" : isValid ? "success" : ""}
              placeholder="00000-000"
              inputMode="numeric"
              style={{ fontSize: 16, flex: 1 }}
              maxLength={9}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLookup}
              disabled={!cep || loading}
              style={{ flexShrink: 0 }}
            >
              {loading ? "…" : "Buscar"}
            </button>
          </div>
          {error && <p className="error-msg">⚠ {error}</p>}

          {/* ── Address fields ─────────────────────── */}
          <div className="row-two" style={{ marginTop: 4 }}>
            <div>
              <label htmlFor="logradouro">Logradouro</label>
              <input id="logradouro" value={logradouro} readOnly style={{ fontSize: 16 }} />
            </div>
            <div>
              <label htmlFor="numero">Número</label>
              <input id="numero" ref={numeroRef} value={numero}
                onChange={e => setNumero(e.target.value)} style={{ fontSize: 16 }} />
            </div>
          </div>

          <div className="row-two">
            <div>
              <label htmlFor="bairro">Bairro</label>
              <input id="bairro" value={bairro} readOnly style={{ fontSize: 16 }} />
            </div>
            <div>
              <label htmlFor="cidade">Cidade</label>
              <input id="cidade" value={cidade} readOnly style={{ fontSize: 16 }} />
            </div>
          </div>

          <label htmlFor="estado">Estado</label>
          <input id="estado" value={estado} readOnly style={{ fontSize: 16, maxWidth: 100 }} />

          {/* ── Submit ─────────────────────────────── */}
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", fontSize: "1rem" }}
              disabled={!isValid || loading}
              onClick={handleSubmit}
            >
              {loading ? "Buscando CEP…" : "💾 Salvar veículo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}