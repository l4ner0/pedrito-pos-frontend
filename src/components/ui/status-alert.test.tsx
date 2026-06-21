import { render, screen } from "@testing-library/react";
import { StatusAlert } from "./status-alert";

describe("StatusAlert", () => {
  it("tiene role alert", () => {
    render(<StatusAlert variant="warning" message="Mensaje de prueba" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renderiza el mensaje de texto", () => {
    render(<StatusAlert variant="warning" message="Stock bajo detectado" />);
    expect(screen.getByText("Stock bajo detectado")).toBeInTheDocument();
  });

  it("renderiza un ReactNode como mensaje", () => {
    render(
      <StatusAlert
        variant="warning"
        message={<><strong>4 productos</strong> con stock bajo</>}
      />,
    );
    expect(screen.getByText("4 productos")).toBeInTheDocument();
    expect(screen.getByText("con stock bajo")).toBeInTheDocument();
  });

  it("aplica clases de variante warning", () => {
    render(<StatusAlert variant="warning" message="Test" />);
    expect(screen.getByRole("alert")).toHaveClass("text-warning");
  });

  it("aplica clases de variante success", () => {
    render(<StatusAlert variant="success" message="Test" />);
    expect(screen.getByRole("alert")).toHaveClass("text-success");
  });

  it("aplica clases de variante error", () => {
    render(<StatusAlert variant="error" message="Test" />);
    expect(screen.getByRole("alert")).toHaveClass("text-danger");
  });

  it("acepta className adicional", () => {
    render(<StatusAlert variant="success" message="Test" className="mt-4" />);
    expect(screen.getByRole("alert")).toHaveClass("mt-4");
  });
});
