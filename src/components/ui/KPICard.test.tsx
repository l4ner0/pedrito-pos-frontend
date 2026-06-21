import { render, screen } from "@testing-library/react";
import { DollarSign, ShoppingBag } from "lucide-react";
import { KPICard } from "./KPICard";

const baseProps = {
  label: "Recaudado hoy",
  value: "S/ 547.20",
  sub: "+12% vs ayer",
  icon: DollarSign,
  iconClass: "bg-primary/10 text-primary",
};

describe("KPICard", () => {
  it("renderiza el label", () => {
    render(<KPICard {...baseProps} />);
    expect(screen.getByText("Recaudado hoy")).toBeInTheDocument();
  });

  it("renderiza el valor principal", () => {
    render(<KPICard {...baseProps} />);
    expect(screen.getByText("S/ 547.20")).toBeInTheDocument();
  });

  it("renderiza el subtexto", () => {
    render(<KPICard {...baseProps} />);
    expect(screen.getByText("+12% vs ayer")).toBeInTheDocument();
  });

  it("aplica iconClass al contenedor del ícono", () => {
    const { container } = render(<KPICard {...baseProps} />);
    const iconSpan = container.querySelector("span");
    expect(iconSpan).toHaveClass("bg-primary/10", "text-primary");
  });

  it("renderiza distintos íconos sin errores", () => {
    render(<KPICard {...baseProps} icon={ShoppingBag} iconClass="bg-brand/10 text-brand" />);
    expect(screen.getByText("Recaudado hoy")).toBeInTheDocument();
  });
});
