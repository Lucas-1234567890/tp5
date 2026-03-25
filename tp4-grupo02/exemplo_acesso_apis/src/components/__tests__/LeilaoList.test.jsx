// src/components/__tests__/LeilaoList.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest"; // ← vi, não jest
import LeilaoList from "../LeilaoList";

const mockLotes = [
  { id: 1, marca: "Toyota", modelo: "Corolla", ano_modelo: 2020, valor_inicial: 30000 },
  { id: 2, marca: "Honda",  modelo: "Civic",   ano_modelo: 2021, valor_inicial: 35000 },
];

beforeEach(() => {
  global.fetch = vi.fn(() =>           // ← vi.fn()
    Promise.resolve({ json: () => Promise.resolve(mockLotes) })
  );
});

afterEach(() => vi.resetAllMocks());   // ← vi.resetAllMocks()

describe("LeilaoList", () => {
  it("exibe skeletons enquanto carrega", () => {
    render(<LeilaoList token="tok" onSelect={() => {}} onData={() => {}} />);
    expect(document.querySelectorAll(".skeleton").length).toBeGreaterThan(0);
  });

  it("exibe veículos após carregar", async () => {
    render(<LeilaoList token="tok" onSelect={() => {}} onData={() => {}} />);
    await waitFor(() => expect(screen.getByText(/Veículo 1/i)).toBeInTheDocument());
    expect(screen.getByText(/Toyota/i)).toBeInTheDocument();
    expect(screen.getByText(/Honda/i)).toBeInTheDocument();
  });

  it("chama onSelect ao clicar em um card", async () => {
    const onSelect = vi.fn();          // ← vi.fn()
    render(<LeilaoList token="tok" onSelect={onSelect} onData={() => {}} />);
    await waitFor(() => screen.getByText(/Veículo 1/i));
    screen.getByText(/Veículo 1/i).closest(".card").click();
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("chama fetch com o token correto", async () => {
    render(<LeilaoList token="meu-token" onSelect={() => {}} onData={() => {}} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer meu-token");
  });
});