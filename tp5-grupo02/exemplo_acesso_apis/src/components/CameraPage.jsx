// src/components/CameraPage.jsx
// Página dedicada à câmera — acessível pelo botão 📷 na Navbar.
// Permite fotografar veículos para consulta ou registro.
import { useState } from "react";
import Camera from "./Camera";
import { useToast } from "./Toast";

export default function CameraPage() {
  const [savedPhotos, setSavedPhotos] = useState([]);
  const [showCamera,  setShowCamera]  = useState(false);
  const toast = useToast();

  const handleCapture = (dataUrl) => {
    setSavedPhotos(prev => [{ id: Date.now(), url: dataUrl }, ...prev]);
  };

  const handleDelete = (id) => {
    setSavedPhotos(prev => prev.filter(p => p.id !== id));
    toast.show("Foto removida", "default");
  };

  return (
    <div style={{ paddingBottom: 16 }}>
     
      <div className="page-header">
        <h1 className="page-title">📷 <span>Câmera</span></h1>
        <p style={{ fontSize: "0.82rem", color: "var(--clr-muted)", marginTop: 2 }}>
          Fotografe veículos para consulta
        </p>
      </div>

      <div className="container" style={{ paddingTop: 12 }}>
        {showCamera ? (
          <Camera
            onCapture={handleCapture}
            onClose={() => setShowCamera(false)}
          />
        ) : (
          <>
            <button
              className="btn btn-primary"
              style={{ width: "100%", fontSize: "1rem", gap: 8, display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={() => setShowCamera(true)}
            >
              📸 Abrir câmera
            </button>

            {savedPhotos.length > 0 && (
              <>
                <div className="section-header">
                  <span style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: "0.95rem" }}>
                    Fotos capturadas ({savedPhotos.length})
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {savedPhotos.map(p => (
                    <div key={p.id} style={{ position: "relative", borderRadius: "var(--r-md)", overflow: "hidden", background: "var(--clr-surface2)" }}>
                      <img src={p.url} alt="veículo" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{
                          position: "absolute", top: 6, right: 6,
                          background: "rgba(0,0,0,0.65)", color: "#fff",
                          border: "none", borderRadius: 20, width: 28, height: 28,
                          fontSize: "0.8rem", cursor: "pointer", minHeight: "unset", padding: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                        aria-label="Remover foto"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {savedPhotos.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: "var(--clr-muted)" }}>
                <p style={{ fontSize: "3rem", marginBottom: 8 }}>📷</p>
                <p style={{ fontSize: "0.9rem" }}>Nenhuma foto ainda.</p>
                <p style={{ fontSize: "0.8rem", marginTop: 4 }}>Clique em "Abrir câmera" para começar.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}