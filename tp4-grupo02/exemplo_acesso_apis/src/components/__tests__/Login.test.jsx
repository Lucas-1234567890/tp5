// src/components/__tests__/Login.test.jsx
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login";
import { ToastProvider } from "../Toast";

const Wrapper = ({ children }) => (
  <MemoryRouter>
    <ToastProvider>{children}</ToastProvider>
  </MemoryRouter>
);

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ accessToken: "token-abc-123" }),
    })
  );
});

afterEach(() => vi.resetAllMocks());

describe("Login", () => {
  it("renderiza campos de usuário e senha", () => {
    render(<Wrapper><Login onToken={() => {}} /></Wrapper>);
    expect(screen.getByLabelText(/Usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
  });

  it("renderiza botão Entrar", () => {
    render(<Wrapper><Login onToken={() => {}} /></Wrapper>);
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });

  it("chama onToken com o accessToken após login bem-sucedido", async () => {
    const onToken = vi.fn();
    render(<Wrapper><Login onToken={onToken} /></Wrapper>);
    await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));
    await waitFor(() => expect(onToken).toHaveBeenCalledWith("token-abc-123"));
  });

  it("exibe erro quando credenciais são inválidas", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    );
    render(<Wrapper><Login onToken={() => {}} /></Wrapper>);
    await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));
    await waitFor(() =>
      expect(screen.getByText(/Credenciais inválidas/i)).toBeInTheDocument()
    );
  });

  it("exibe erro ao tentar logar com campos vazios", async () => {
    render(<Wrapper><Login onToken={() => {}} /></Wrapper>);
    // Clear the pre-filled fields
    const userInput = screen.getByLabelText(/Usuário/i);
    const passInput = screen.getByLabelText(/Senha/i);
    await userEvent.clear(userInput);
    await userEvent.clear(passInput);
    await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));
    expect(screen.getByText(/Preencha usuário e senha/i)).toBeInTheDocument();
  });

  it("desabilita botão durante loading", async () => {
    // Never resolves
    global.fetch = vi.fn(() => new Promise(() => {}));
    render(<Wrapper><Login onToken={() => {}} /></Wrapper>);
    await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));
    expect(screen.getByRole("button", { name: /Autenticando/i })).toBeDisabled();
  });
});