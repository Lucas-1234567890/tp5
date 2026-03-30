// src/components/__tests__/LeilaoDetail.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import LeilaoDetail from "../LeilaoDetail";
import { AppContext } from "../../context/AppContext";
import { ToastProvider } from "../Toast";

// Helper: monta LeilaoDetail injetando o contexto diretamente,
// sem depender de AppProvider (que usa navigator.onLine e sessionStorage).
function renderWithContext({ leiloes = [], currentIndex = 0, isOnline = true } = {}) {
  const mockCtx = {
    token:            "tok",
    setToken:         vi.fn(),
    logout:           vi.fn(),
    leiloes,
    setLeiloes:       vi.fn(),
    currentIndex,
    setCurrentIndex:  vi.fn(),
    isOnline,
  };

  return render(
    <MemoryRouter>
      <AppContext.Provider value={mockCtx}>
        <ToastProvider>
          <LeilaoDetail />
        </ToastProvider>
      </AppContext.Provider>
    </MemoryRouter>
  );
}

const lote = {
  marca: "Ford", modelo: "Ka", ano_fabricacao: 2019,
  combustivel: "Gasolina", valor_inicial: 25000, lance: 26000,
};

describe("LeilaoDetail", () => {
  it("renderiza informações do lote", () => {
    renderWithContext({ leiloes: [lote], currentIndex: 0 });
    expect(screen.getByText(/Ford/i)).toBeInTheDocument();
    expect(screen.getByText(/Ka/i)).toBeInTheDocument();
  });

  it("exibe contador de posição correto", () => {
    const lotes = [lote, { ...lote, marca: "Honda" }, { ...lote, marca: "Toyota" }];
    renderWithContext({ leiloes: lotes, currentIndex: 1 });
    expect(screen.getByText(/2 \/ 3/i)).toBeInTheDocument();
  });

  it("exibe mensagem quando não há lote", () => {
    renderWithContext({ leiloes: [], currentIndex: 0 });
    expect(screen.getByText(/Nenhum veículo selecionado/i)).toBeInTheDocument();
  });

  it("exibe valor inicial do lote", () => {
    renderWithContext({ leiloes: [lote], currentIndex: 0 });
    expect(screen.getByText(/25\.000/)).toBeInTheDocument();
  });

  it("botão de lance está presente e habilitado quando online", () => {
    renderWithContext({ leiloes: [lote], currentIndex: 0, isOnline: true });
    expect(screen.getByRole("button", { name: /Dar Lance/i })).not.toBeDisabled();
  });

  it("botão de lance desabilitado quando offline", () => {
    renderWithContext({ leiloes: [lote], currentIndex: 0, isOnline: false });
    expect(screen.getByRole("button", { name: /Dar Lance/i })).toBeDisabled();
  });

  it("exibe botões de navegação quando há múltiplos lotes", () => {
    const lotes = [lote, { ...lote, marca: "Honda" }];
    renderWithContext({ leiloes: lotes, currentIndex: 0 });
    expect(screen.getByRole("button", { name: /Próximo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Anterior/i })).toBeDisabled();
  });
});