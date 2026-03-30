// src/components/Camera.jsx
// Recurso do dispositivo: câmera.
// Suporte a iOS (Safari getUserMedia) e Android (Chrome).
// Permite tirar foto, visualizar e salvar junto ao veículo.
import { useEffect, useRef, useState } from "react";
import { useToast } from "./Toast";

export default function Camera({ onCapture, onClose }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const streamRef  = useRef(null);
  const toast      = useToast();

  const [photo,       setPhoto]       = useState(null);   // base64
  const [facingMode,  setFacingMode]  = useState("environment"); 
  const [permission,  setPermission]  = useState("prompt"); // "prompt"|"granted"|"denied"
  const [cameraReady, setCameraReady] = useState(false);


  const startCamera = async (mode = facingMode) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      setCameraReady(false);
      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width:  { ideal: 1280 },
          height: { ideal: 960  },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
      setPermission("granted");
      setPhoto(null);
    } catch (err) {
      console.error("Camera error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermission("denied");
      } else {
        toast.show("Câmera não disponível neste dispositivo", "error");
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
   
  }, []);

  
  const handleCapture = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhoto(dataUrl);
   
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCameraReady(false);
  };

 
  const handleFlip = () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startCamera(next);
  };


  const handleRetake = () => {
    setPhoto(null);
    startCamera(facingMode);
  };

  const handleConfirm = () => {
    if (photo) {
      onCapture?.(photo);
      toast.show("Foto adicionada ao veículo ✅", "success");
      onClose?.();
    }
  };

  if (permission === "denied") {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p style={{ fontSize: "3rem" }}>🚫</p>
        <p style={{ color: "var(--clr-danger)", marginTop: 8 }}>Acesso à câmera negado.</p>
        <p style={{ color: "var(--clr-muted)", fontSize: "0.85rem", marginTop: 8 }}>
          Vá em Configurações → Privacidade → Câmera e permita o acesso para este navegador.
        </p>
        <button className="btn btn-ghost" style={{ marginTop: 16, width: "100%" }} onClick={onClose}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

     
      {!photo ? (
        <div className="camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline   
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: facingMode === "user" ? "scaleX(-1)" : "none",
            }}
          />
          
          <div className="camera-overlay">
            <div className="camera-corner tl" />
            <div className="camera-corner tr" />
            <div className="camera-corner bl" />
            <div className="camera-corner br" />
          </div>
          {!cameraReady && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }}>
              <div className="spinner" />
            </div>
          )}
        </div>
      ) : (
        <img src={photo} alt="Foto capturada" className="photo-preview" />
      )}

     
      <div className="camera-controls">
        {!photo ? (
          <>
            <button
              className="btn btn-ghost"
              style={{ flex: 1 }}
              onClick={handleFlip}
              disabled={!cameraReady}
              title="Virar câmera"
            >
              🔄 Virar
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 2 }}
              onClick={handleCapture}
              disabled={!cameraReady}
            >
              📸 Capturar
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleRetake}>
              ↩ Tirar novamente
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleConfirm}>
              ✅ Usar foto
            </button>
          </>
        )}
      </div>

      {!photo && (
        <button className="btn btn-ghost" style={{ width: "100%" }} onClick={onClose}>
          Cancelar
        </button>
      )}
    </div>
  );
}