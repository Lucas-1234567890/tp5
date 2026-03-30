// src/components/__tests__/LeilaoDetail.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import LeilaoDetail from "../LeilaoDetail";
import { AppProvider } from "../../context/AppContext";
import { ToastProvider } from "../Toast";

// Wrapper com contextos necessários
const Wrapper = ({ children }) => (
  <MemoryRouter>
    <AppProvider>
      <ToastProvider>{children}</ToastProvider>
    </AppProvider>
  </MemoryRouter>
);

const lote = {
  marca: "Ford", modelo: "Ka", ano_fabricacao: 2019,
  combustivel: "Gasolina", valor_inicial: 25000, lance: 26000,
};

describe("LeilaoDetail", () => {
  it("renderiza informações do lote", () => {
    render(
      <Wrapper><LeilaoDetail lote={lote} index={0} total={3} onChangeIndex={() => {}} /></Wrapper>
    );
    expect(screen.getByText(/Ford/i)).toBeInTheDocument();
    expect(screen.getByText(/Ka/i)).toBeInTheDocument();
  });

  it("exibe contador de posição correto", () => {
    render(
      <Wrapper><LeilaoDetail lote={lote} index={1} total={5} onChangeIndex={() => {}} /></Wrapper>
    );
    expect(screen.getByText(/2 de 5/i)).toBeInTheDocument();
  });

  it("exibe mensagem quando não há lote", () => {
    render(
      <Wrapper><LeilaoDetail lote={null} index={0} total={0} onChangeIndex={() => {}} /></Wrapper>
    );
    expect(screen.getByText(/Nenhum veículo selecionado/i)).toBeInTheDocument();
  });

  it("exibe valor inicial do lote", () => {
    render(
      <Wrapper><LeilaoDetail lote={lote} index={0} total={3} onChangeIndex={() => {}} /></Wrapper>
    );
    expect(screen.getByText(/25\.000/)).toBeInTheDocument();
  });

  it("botão de lance está presente", () => {
    render(
      <Wrapper><LeilaoDetail lote={lote} index={0} total={3} onChangeIndex={() => {}} /></Wrapper>
    );
    expect(screen.getByText(/Dar Lance/i)).toBeInTheDocument();
  });
});