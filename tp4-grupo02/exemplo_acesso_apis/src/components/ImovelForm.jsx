import { useEffect, useRef, useState } from "react";


const cepCache = {};
function fakeCepLookup(cep) {
  if (cepCache[cep]) {
    return Promise.resolve(cepCache[cep]);
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!/^\d{5}-?\d{3}$/.test(cep) || cep.startsWith("0")) {
        const err = new Error("Renavan formato inválido.");
        reject(err);
      } else {
        const data = {
          logradouro: "Rua Exemplo",
          bairro: "Bairro Exemplo",
          cidade: "Cidade Exemplo",
          estado: "EX",
        };
        cepCache[cep] = data;
        resolve(data);
      }
    }, 400);
  });
}

export default function ImovelForm({ onSave }) {
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const numeroRef = useRef(null);

  const handleLookup = () => {
    setError("");
    setLoading(true);
    fakeCepLookup(cep)
      .then((data) => {
        setLogradouro(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.cidade);
        setEstado(data.estado);
        // move cursor to number
        if (numeroRef.current) numeroRef.current.focus();
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  // when blur on cep
  const handleCepBlur = () => {
    if (cep) handleLookup();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) return;
    onSave && onSave({ cep, logradouro, numero, bairro, cidade, estado });
  };

  const isValidCep = /^\d{5}-?\d{3}$/.test(cep) && !cep.startsWith("0");

  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="card">
        <h2>Novo móvel</h2>
        <div className="row-two" style={{ alignItems: 'center' }}>
          <div style={{ flex: 2 }}>
            <label htmlFor="cep">Renavan</label>
            <input
              id="cep"
              name="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={handleCepBlur}
              className={error ? "error" : ""}
              placeholder="00000-000"
            />
            {error && <p style={{ color: "#FF0000" }}>{error}</p>}
          </div>
          <div style={{ flex: 1, paddingTop: '24px' }}>
            <button type="button" onClick={handleLookup} disabled={!cep || loading}>
              Buscar
            </button>
          </div>
        </div>
        <div className="row-two">
          <div>
            <label htmlFor="logradouro">Logradouro</label>
            <input
              id="logradouro"
              name="logradouro"
              value={logradouro}
              onChange={(e) => setLogradouro(e.target.value)}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="numero">Número</label>
            <input
              id="numero"
              name="numero"
              value={numero}
              ref={numeroRef}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>
        </div>
        <div className="row-two">
          <div>
            <label htmlFor="bairro">Bairro</label>
            <input
              id="bairro"
              name="bairro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="cidade">Cidade</label>
            <input
              id="cidade"
              name="cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              readOnly
            />
          </div>
        </div>
        <div>
          <label htmlFor="estado">Estado</label>
          <input
            id="estado"
            name="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            readOnly
          />
        </div>
        <button type="submit" disabled={!isValidCep || !!error || loading}>
          {loading ? "Buscando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
