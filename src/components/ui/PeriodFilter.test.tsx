import { render, screen, fireEvent } from "@testing-library/react";
import { PeriodFilter } from "./PeriodFilter";

const options = [
  { value: "today", label: "Hoy" },
  { value: "yesterday", label: "Ayer" },
  { value: "week", label: "Hace una semana" },
];

describe("PeriodFilter", () => {
  it("renderiza el label de la opción seleccionada", () => {
    render(<PeriodFilter options={options} value="today" />);
    expect(screen.getByText("Hoy")).toBeInTheDocument();
  });

  it("el dropdown está cerrado inicialmente", () => {
    render(<PeriodFilter options={options} value="today" />);
    expect(screen.queryByText("Ayer")).not.toBeInTheDocument();
    expect(screen.queryByText("Hace una semana")).not.toBeInTheDocument();
  });

  it("abre el dropdown al hacer clic en el botón", () => {
    render(<PeriodFilter options={options} value="today" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Ayer")).toBeInTheDocument();
    expect(screen.getByText("Hace una semana")).toBeInTheDocument();
  });

  it("llama a onChange con el valor correcto al seleccionar una opción", () => {
    const onChange = vi.fn();
    render(<PeriodFilter options={options} value="today" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button", { name: "Ayer" }));
    expect(onChange).toHaveBeenCalledWith("yesterday");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("cierra el dropdown después de seleccionar una opción", () => {
    render(<PeriodFilter options={options} value="today" />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button", { name: "Ayer" }));
    expect(screen.queryByText("Hace una semana")).not.toBeInTheDocument();
  });

  it("usa el primer option como valor inicial en modo no controlado", () => {
    render(<PeriodFilter options={options} />);
    expect(screen.getByText("Hoy")).toBeInTheDocument();
  });

  it("muestra todas las opciones al abrir", () => {
    render(<PeriodFilter options={options} value="yesterday" />);
    fireEvent.click(screen.getByRole("button"));
    options.forEach(({ label }) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
  });
});
