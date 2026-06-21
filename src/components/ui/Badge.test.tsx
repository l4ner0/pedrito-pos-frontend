import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renderiza el texto del label", () => {
    render(<Badge label="Bebidas" />);
    expect(screen.getByText("Bebidas")).toBeInTheDocument();
  });

  it("aplica variante default cuando no se especifica variant", () => {
    render(<Badge label="Test" />);
    expect(screen.getByText("Test")).toHaveClass("bg-secondary", "text-muted-foreground");
  });

  it("aplica variante success", () => {
    render(<Badge label="Disponible" variant="success" />);
    expect(screen.getByText("Disponible")).toHaveClass("text-success");
  });

  it("aplica variante warning", () => {
    render(<Badge label="Stock bajo" variant="warning" />);
    expect(screen.getByText("Stock bajo")).toHaveClass("text-warning");
  });

  it("aplica variante danger", () => {
    render(<Badge label="Error" variant="danger" />);
    expect(screen.getByText("Error")).toHaveClass("text-danger");
  });

  it("aplica variante purple", () => {
    render(<Badge label="Bebidas" variant="purple" />);
    expect(screen.getByText("Bebidas")).toHaveClass("bg-violet-100", "text-violet-700");
  });

  it("aplica variante blue", () => {
    render(<Badge label="Lácteos" variant="blue" />);
    expect(screen.getByText("Lácteos")).toHaveClass("bg-sky-100", "text-sky-700");
  });

  it("aplica variante teal", () => {
    render(<Badge label="Limpieza" variant="teal" />);
    expect(screen.getByText("Limpieza")).toHaveClass("bg-teal-100", "text-teal-700");
  });

  it("aplica variante lime", () => {
    render(<Badge label="Snacks" variant="lime" />);
    expect(screen.getByText("Snacks")).toHaveClass("bg-lime-100", "text-lime-700");
  });

  it("aplica variante amber", () => {
    render(<Badge label="Panadería" variant="amber" />);
    expect(screen.getByText("Panadería")).toHaveClass("bg-amber-100", "text-amber-700");
  });

  it("aplica variante emerald", () => {
    render(<Badge label="Frutas" variant="emerald" />);
    expect(screen.getByText("Frutas")).toHaveClass("bg-emerald-100", "text-emerald-700");
  });

  it("acepta className adicional", () => {
    render(<Badge label="Test" className="mt-4" />);
    expect(screen.getByText("Test")).toHaveClass("mt-4");
  });

  it("siempre aplica clases base de pill", () => {
    render(<Badge label="Test" />);
    expect(screen.getByText("Test")).toHaveClass("inline-flex", "rounded-full");
  });
});
