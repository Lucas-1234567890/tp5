// src/components/__tests__/LeilaoDetail.test.jsx
import { render, screen } from "@testing-library/react";
import LeilaoDetail from "../LeilaoDetail";

const lote = {
  marca: "Ford", modelo: "Ka", ano_fabricacao: 2019,
  combustivel: "Gasolina", valor_inicial: 25000, lance: 26000,
};

describe("LeilaoDetail", () => {
  it("renderiza informações do lote", () => {
    render(<LeilaoDetail lote={lote} index={0} total={3} onChangeIndex={() => {}} />);
    expect(screen.getByText(/Ford/i)).toBeInTheDocument();
    expect(screen.getByText(/Ka/i)).toBeInTheDocument();
  });

  it("exibe contador de posição correto", () => {
    render(<LeilaoDetail lote={lote} index={1} total={5} onChangeIndex={() => {}} />);
    expect(screen.getByText(/Veículo 2 de 5/i)).toBeInTheDocument();
  });

  it("exibe mensagem quando não há lote", () => {
    render(<LeilaoDetail lote={null} index={0} total={0} onChangeIndex={() => {}} />);
    expect(screen.getByText(/Nenhum veículo selecionado/i)).toBeInTheDocument();
  });

  it("exibe valor inicial do lote", () => {
    render(<LeilaoDetail lote={lote} index={0} total={3} onChangeIndex={() => {}} />);
    expect(screen.getByText(/25000/)).toBeInTheDocument();
  });
});