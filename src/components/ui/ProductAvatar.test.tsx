import { render, screen } from "@testing-library/react";
import { ProductAvatar } from "./ProductAvatar";

describe("ProductAvatar", () => {
  it("renderiza una imagen cuando se provee src", () => {
    render(<ProductAvatar src="/coca-cola.jpg" alt="Coca-Cola 500ml" />);
    const img = screen.getByRole("img", { name: "Coca-Cola 500ml" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/coca-cola.jpg");
  });

  it("usa el alt como texto alternativo de la imagen", () => {
    render(<ProductAvatar src="/img.jpg" alt="Inca Kola 1.5L" />);
    expect(screen.getByAltText("Inca Kola 1.5L")).toBeInTheDocument();
  });

  it("no renderiza imagen cuando no hay src", () => {
    render(<ProductAvatar alt="Sin imagen" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renderiza el placeholder cuando no hay src", () => {
    const { container } = render(<ProductAvatar alt="Sin imagen" />);
    const placeholder = container.firstChild;
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass("bg-secondary");
  });
});
