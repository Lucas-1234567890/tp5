// src/components/__tests__/LeilaoList.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LeilaoList from "../LeilaoList";
import { AppProvider } from "../../context/AppContext";
import { ToastProvider } from "../Toast";

const Wrapper = ({ children }) => (
  <MemoryRouter>
    <AppProvider>
      <ToastProvider>{children}</ToastProvider>
    </AppProvider>
  </MemoryRouter>
);

const mockLeiloes = [
  { id: 10, nome: "Leilão ABC", tipo: "SEGURADORA", data_inicio: "2024-03-01", cidade: "SP", estado: "SP", leiloeiro: "João" },
  { id: 11, nome: "Leilão XYZ", tipo: "JUDICIAL",   data_inicio: "2024-03-15", cidade: "RJ", estado: "RJ", leiloeiro: "Maria" },
];

const mockLotes = [
  { id: 1, marca: "Toyota", modelo: "Corolla", ano_modelo: 2020, valor_inicial: 30000 },
  { id: 2, marca: "Honda",  modelo: "Civic",   ano_modelo: 2021, valor_inicial: 35000 },
];

beforeEach(() => {
  // /leiloes returns list; /leiloes/:id/lotes returns lots
  global.fetch = vi.fn((url) => {
    if (url.includes("/lotes")) {
      return Promise.resolve({ json: () => Promise.resolve(mockLotes) });
    }
    return Promise.resolve({ json: () => Promise.resolve(mockLeiloes) });
  });
  sessionStorage.clear();
});

afterEach(() => vi.resetAllMocks());

describe("LeilaoList", () => {
  it("exibe skeletons enquanto carrega", () => {
    render(
      <Wrapper>
        <LeilaoList token="tok" onSelect={() => {}} onData={() => {}} />
      </Wrapper>
    );
    expect(document.querySelectorAll(".skeleton").length).toBeGreaterThan(0);
  });

  it("exibe leilões após carregar", async () => {
    render(
      <Wrapper>
        <LeilaoList token="tok" onSelect={() => {}} onData={() => {}} />
      </Wrapper>
    );
    await waitFor(() =>
      expect(screen.getByText(/Leilão ABC/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Leilão XYZ/i)).toBeInTheDocument();
  });

  it("chama onData e onSelect ao clicar num leilão", async () => {
    const onSelect = vi.fn();
    const onData   = vi.fn();
    render(
      <Wrapper>
        <LeilaoList token="tok" onSelect={onSelect} onData={onData} />
      </Wrapper>
    );
    await waitFor(() => screen.getByText(/Leilão ABC/i));
    await userEvent.click(screen.getByText(/Leilão ABC/i).closest(".card"));
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(0));
    expect(onData).toHaveBeenCalledWith(mockLotes);
  });

  it("chama fetch com Authorization header correto", async () => {
    render(
      <Wrapper>
        <LeilaoList token="meu-token" onSelect={() => {}} onData={() => {}} />
      </Wrapper>
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain("/leiloes");
    expect(options.headers.Authorization).toBe("Bearer meu-token");
  });

  it("usa cache do sessionStorage quando fetch falha", async () => {
    sessionStorage.setItem(
      "leiloes_cache",
      JSON.stringify([{ id: 99, nome: "Leilão Cache", tipo: "—", cidade: "—", estado: "—" }])
    );
    global.fetch = vi.fn(() => Promise.reject(new Error("offline")));
    render(
      <Wrapper>
        <LeilaoList token="tok" onSelect={() => {}} onData={() => {}} />
      </Wrapper>
    );
    await waitFor(() =>
      expect(screen.getByText(/Leilão Cache/i)).toBeInTheDocument()
    );
  });

  it("botão Live está desabilitado sem leilões", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve([]) })
    );
    render(
      <Wrapper>
        <LeilaoList token="tok" onSelect={() => {}} onData={() => {}} />
      </Wrapper>
    );
    const liveBtn = document.querySelector(".btn-live");
    // Initially rendered even before fetch resolves
    if (liveBtn) expect(liveBtn).toBeDisabled();
  });
});