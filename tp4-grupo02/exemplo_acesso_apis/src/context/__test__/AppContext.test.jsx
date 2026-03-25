// src/context/__tests__/AppContext.test.jsx
import { render, screen, act } from "@testing-library/react";
import { vi } from "vitest";
import { AppProvider, useAppContext } from "../AppContext";

function ConsumerComponent() {
  const { token, setToken, logout, isOnline, leiloes, setLeiloes } = useAppContext();
  return (
    <div>
      <span data-testid="token">{token || "null"}</span>
      <span data-testid="online">{isOnline ? "online" : "offline"}</span>
      <span data-testid="leiloes">{leiloes.length}</span>
      <button onClick={() => setToken("abc")}>set-token</button>
      <button onClick={logout}>logout</button>
      <button onClick={() => setLeiloes([{ id: 1 }])}>set-leiloes</button>
    </div>
  );
}

beforeEach(() => sessionStorage.clear());

describe("AppContext", () => {
  it("inicia com token null quando sessionStorage está vazio", () => {
    render(<AppProvider><ConsumerComponent /></AppProvider>);
    expect(screen.getByTestId("token").textContent).toBe("null");
  });

  it("persiste token no sessionStorage ao chamar setToken", () => {
    render(<AppProvider><ConsumerComponent /></AppProvider>);
    act(() => screen.getByText("set-token").click());
    expect(sessionStorage.getItem("jwt")).toBe("abc");
    expect(screen.getByTestId("token").textContent).toBe("abc");
  });

  it("logout limpa token e lista de leilões", () => {
    render(<AppProvider><ConsumerComponent /></AppProvider>);
    act(() => screen.getByText("set-token").click());
    act(() => screen.getByText("set-leiloes").click());
    act(() => screen.getByText("logout").click());
    expect(screen.getByTestId("token").textContent).toBe("null");
    expect(screen.getByTestId("leiloes").textContent).toBe("0");
    expect(sessionStorage.getItem("jwt")).toBeNull();
  });

  it("lê token do sessionStorage ao montar", () => {
    sessionStorage.setItem("jwt", "existing-token");
    render(<AppProvider><ConsumerComponent /></AppProvider>);
    expect(screen.getByTestId("token").textContent).toBe("existing-token");
  });

  it("isOnline reflete navigator.onLine inicial", () => {
    render(<AppProvider><ConsumerComponent /></AppProvider>);
    const expected = navigator.onLine ? "online" : "offline";
    expect(screen.getByTestId("online").textContent).toBe(expected);
  });

  it("lança erro ao usar useAppContext fora do provider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ConsumerComponent />)).toThrow();
    spy.mockRestore();
  });
});