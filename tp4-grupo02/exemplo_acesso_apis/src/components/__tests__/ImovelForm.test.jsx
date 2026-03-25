// src/components/__tests__/ImovelForm.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ImovelForm from "../ImovelForm";
import { ToastProvider } from "../Toast";

// Mock fetch para ViaCEP
const mockCepData = {
  logradouro: "Rua das Flores",
  bairro: "Centro",
  localidade: "São Paulo",
  uf: "SP",
};

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCepData),
    })
  );
  // Reset CEP cache between tests (module-level object)
  vi.resetModules();
});

afterEach(() => vi.restoreAllMocks());

const Wrapper = ({ children }) => (
  <MemoryRouter>
    <ToastProvider>{children}</ToastProvider>
  </MemoryRouter>
);

describe("ImovelForm", () => {
  it("renderiza campo de CEP", () => {
    render(<Wrapper><ImovelForm onSave={() => {}} /></Wrapper>);
    expect(screen.getByLabelText(/CEP/i)).toBeInTheDocument();
  });

  it("botão Salvar está desabilitado com CEP inválido", () => {
    render(<Wrapper><ImovelForm onSave={() => {}} /></Wrapper>);
    expect(screen.getByRole("button", { name: /Salvar/i })).toBeDisabled();
  });

  it("exibe erro ao digitar CEP inválido curto", async () => {
    render(<Wrapper><ImovelForm onSave={() => {}} /></Wrapper>);
    const cepInput = screen.getByLabelText(/CEP/i);
    await userEvent.type(cepInput, "123");
    await userEvent.click(screen.getByRole("button", { name: /Buscar/i }));
    expect(screen.getByText(/CEP deve ter 8 dígitos/i)).toBeInTheDocument();
  });

  it("preenche endereço após busca de CEP válido", async () => {
    render(<Wrapper><ImovelForm onSave={() => {}} /></Wrapper>);
    const cepInput = screen.getByLabelText(/CEP/i);
    await userEvent.type(cepInput, "01310100");
    await userEvent.click(screen.getByRole("button", { name: /Buscar/i }));
    await waitFor(() =>
      expect(screen.getByDisplayValue(/Rua das Flores/i)).toBeInTheDocument()
    );
    expect(screen.getByDisplayValue(/São Paulo/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/SP/i)).toBeInTheDocument();
  });

  it("botão Salvar habilitado após CEP válido preenchido", async () => {
    render(<Wrapper><ImovelForm onSave={() => {}} /></Wrapper>);
    const cepInput = screen.getByLabelText(/CEP/i);
    await userEvent.type(cepInput, "01310100");
    await userEvent.click(screen.getByRole("button", { name: /Buscar/i }));
    await waitFor(() => screen.getByDisplayValue(/Rua das Flores/i));
    expect(screen.getByRole("button", { name: /Salvar/i })).not.toBeDisabled();
  });

  it("chama onSave com os dados ao submeter", async () => {
    const onSave = vi.fn();
    render(<Wrapper><ImovelForm onSave={onSave} /></Wrapper>);
    const cepInput = screen.getByLabelText(/CEP/i);
    await userEvent.type(cepInput, "01310100");
    await userEvent.click(screen.getByRole("button", { name: /Buscar/i }));
    await waitFor(() => screen.getByDisplayValue(/Rua das Flores/i));
    await userEvent.click(screen.getByRole("button", { name: /Salvar/i }));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ cep: "01310-100", logradouro: "Rua das Flores" })
    );
  });

  it("possui botão para fotografar veículo", () => {
    render(<Wrapper><ImovelForm onSave={() => {}} /></Wrapper>);
    expect(screen.getByText(/Fotografar veículo/i)).toBeInTheDocument();
  });
});