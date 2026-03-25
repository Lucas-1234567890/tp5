// src/components/LeilaoDetail.jsx
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

export default function LeilaoDetail({ lote, index, total, onChangeIndex }) {
  const [rubber, setRubber] = useState(false);

  const triggerRubber = () => {
    setRubber(true);
    setTimeout(() => setRubber(false), 200);
  };

  const handlers = useSwipeable({
    onSwipedLeft: ({ absX }) => {
      if (absX > window.innerWidth * 0.15) {
        index + 1 >= total ? triggerRubber() : onChangeIndex(index + 1);
      }
    },
    onSwipedRight: ({ absX }) => {
      if (absX > window.innerWidth * 0.15) {
        index - 1 < 0 ? triggerRubber() : onChangeIndex(index - 1);
      }
    },
    delta: 10,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (!lote) return <p style={{ padding: 16 }}>Nenhum veículo selecionado.</p>;

  const fields = [
    ["Marca", lote.marca],
    ["Modelo", lote.modelo],
    ["Ano Fabricação", lote.ano_fabricacao],
    ["Ano Modelo", lote.ano_modelo],
    ["Combustível", lote.combustivel],
    ["KM", lote.km],
    ["Direção", lote.direcao],
    ["Câmbio Automático", lote.automatico ? "Sim" : "Não"],
    ["AR Condicionado", lote.ar ? "Sim" : "Não"],
    ["Ligando", lote.ligando ? "Sim" : "Não"],
    ["IPVA Pago", lote.ipva_pago ? "Sim" : "Não"],
    ["Valor Inicial", `R$ ${lote.valor_inicial || "0"}`],
    ["Lance Atual", `R$ ${lote.lance || "0"}`],
  ];

  return (
    <div {...handlers} className={"container" + (rubber ? " rubber" : "")}>
      <div className="card">
        <h2>{`Veículo ${index + 1} de ${total}`}</h2>

        {fields.map(([label, val]) => (
          <p key={label}>
            <strong>{label}:</strong> {val || "Não informado"}
          </p>
        ))}
      </div>

      <p style={{ textAlign: "center", color: "#888" }}>
        ← swipe para navegar →
      </p>
    </div>
  );
}