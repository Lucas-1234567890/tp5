
// src/components/__tests__/Navbar.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../Navbar";

describe("Navbar", () => {
  it("renderiza os links de navegação", () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText(/Lista/i)).toBeInTheDocument();
    expect(screen.getByText(/Novo/i)).toBeInTheDocument();
  });

  it("link Lista aponta para /", () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText(/Lista/i).closest("a")).toHaveAttribute("href", "/");
  });

  it("link Novo aponta para /novo", () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText(/Novo/i).closest("a")).toHaveAttribute("href", "/novo");
  });
});