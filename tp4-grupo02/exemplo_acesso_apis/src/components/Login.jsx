// src/components/Login.jsx
// Tela de autenticação com suporte a login manual e auto-login via credenciais fixas.
// Diferença iOS/Android: usa metaViewport e evita zoom em inputs (font-size ≥ 16px).
import { useState } from "react";
import { useToast } from "./Toast";

const BASE_URL = "http://ec2-3-20-227-42.us-east-2.compute.amazonaws.com:3000";
const DEFAULT_USER = "leilao_test_api";
const DEFAULT_PASS = "Ftwj029E";

export default function Login({ onToken }) {
  const [username, setUsername] = useState(DEFAULT_USER);
  const [password, setPassword] = useState(DEFAULT_PASS);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const toast = useToast();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Preencha usuário e senha.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username: username.trim(), password }),
      });
      if (!res.ok) throw new Error("Credenciais inválidas");
      const data = await res.json();
      if (!data.accessToken) throw new Error("Token não recebido");
      toast.show("Login realizado com sucesso!", "success");
      onToken(data.accessToken);
    } catch (err) {
      setError(err.message || "Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-logo">LEILÃO<span style={{ color: "var(--clr-accent)" }}>.</span></div>
      <p className="login-subtitle">Plataforma de leilões de veículos</p>

      <div className="login-card">
        <h2 style={{ marginBottom: 20, fontSize: "1.1rem" }}>Entrar na conta</h2>

        {error && (
          <div className="error-msg" style={{ marginBottom: 12 }}>
            ⚠ {error}
          </div>
        )}

        <label htmlFor="login-user">Usuário</label>
        <input
          id="login-user"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          /* iOS/Android: font-size ≥ 16px evita zoom automático */
          style={{ fontSize: 16 }}
          placeholder="seu usuário"
        />

        <label htmlFor="login-pass">Senha</label>
        <input
          id="login-pass"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          autoComplete="current-password"
          style={{ fontSize: 16 }}
          placeholder="••••••••"
        />

        <div style={{ height: 8 }} />

        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", fontSize: "1rem" }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              Autenticando…
            </span>
          ) : "Entrar"}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--clr-muted)", marginTop: 12 }}>
          Credenciais de teste preenchidas automaticamente
        </p>
      </div>
    </div>
  );
}