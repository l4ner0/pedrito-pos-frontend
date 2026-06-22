"use client";

import { useRef, useState } from "react";
import { Camera, Store, CreditCard, Printer, UploadCloud, X } from "lucide-react";
import { Toast } from "@/components/ui/Toast";

type ToastState = { message: string; variant: "success" | "error" } | null;

export function ConfiguracionContent() {
  const [toast, setToast] = useState<ToastState>(null);

  const [perfil, setPerfil] = useState({
    nombre: "Amelia Torres",
    rol: "Administrador",
    email: "amelia@minimarket.com",
  });

  const [negocio, setNegocio] = useState({
    nombre: "MiniMarket Don Pedro",
    ruc: "10456789012",
    direccion: "Av. Los Pinos 342, Lima",
    telefono: "987 654 321",
  });

  const [yape, setYape] = useState({
    numero: "987 654 321",
    titular: "Amelia Torres Quispe",
  });
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  function handleQrChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrPreview(URL.createObjectURL(file));
  }

  function handleQrRemove() {
    setQrPreview(null);
    if (qrInputRef.current) qrInputRef.current.value = "";
  }

  const [impresion, setImpresion] = useState({
    imprimirPorDefecto: true,
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setToast({ message: "Configuración guardada correctamente", variant: "success" });
  }

  const initials = perfil.nombre
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex-1 overflow-y-auto">
      <form onSubmit={handleSave}>
        <div className="flex flex-col gap-5 p-6">

          {/* Perfil de usuario */}
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-5 text-base font-semibold text-foreground">Perfil de usuario</h2>

            <div className="mb-6 flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand">
                  <span className="text-lg font-semibold text-white">{initials}</span>
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary/90"
                >
                  <Camera size={12} />
                </button>
              </div>
              <div>
                <p className="font-semibold text-foreground">{perfil.nombre}</p>
                <p className="text-sm text-muted-foreground">
                  {perfil.rol} · {perfil.email}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Nombre completo
              </label>
              <input
                type="text"
                value={perfil.nombre}
                onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </section>

          {/* Información del negocio */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Store size={18} />
              </div>
              <h2 className="text-base font-semibold text-foreground">Información del negocio</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Nombre del negocio
                </label>
                <input
                  type="text"
                  value={negocio.nombre}
                  onChange={(e) => setNegocio({ ...negocio, nombre: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  RUC / DNI
                </label>
                <input
                  type="text"
                  value={negocio.ruc}
                  onChange={(e) => setNegocio({ ...negocio, ruc: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={negocio.telefono}
                  onChange={(e) => setNegocio({ ...negocio, telefono: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Dirección
                </label>
                <input
                  type="text"
                  value={negocio.direccion}
                  onChange={(e) => setNegocio({ ...negocio, direccion: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </section>

          {/* Métodos de pago */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <CreditCard size={18} />
              </div>
              <h2 className="text-base font-semibold text-foreground">Métodos de pago</h2>
            </div>

            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Yape</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Número de teléfono
                </label>
                <input
                  type="text"
                  value={yape.numero}
                  onChange={(e) => setYape({ ...yape, numero: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Titular de la cuenta
                </label>
                <input
                  type="text"
                  value={yape.titular}
                  onChange={(e) => setYape({ ...yape, titular: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="col-span-2">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Imagen QR
                </p>
                <input
                  ref={qrInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleQrChange}
                />
                {qrPreview ? (
                  <div className="flex items-start gap-4">
                    <img
                      src={qrPreview}
                      alt="QR Yape"
                      className="h-36 w-36 rounded-lg border border-border object-contain"
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => qrInputRef.current?.click()}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        Cambiar imagen
                      </button>
                      <button
                        type="button"
                        onClick={handleQrRemove}
                        className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
                      >
                        <X size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => qrInputRef.current?.click()}
                    className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 py-8 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/70"
                  >
                    <UploadCloud size={22} className="text-muted-foreground" />
                    <span>Haz clic para subir la imagen del QR</span>
                    <span className="text-xs">PNG, JPG, WEBP</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Impresión */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Printer size={18} />
              </div>
              <h2 className="text-base font-semibold text-foreground">Impresión</h2>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={impresion.imprimirPorDefecto}
                onChange={(e) => setImpresion({ ...impresion, imprimirPorDefecto: e.target.checked })}
                className="h-4 w-4 cursor-pointer accent-primary"
              />
              <span className="text-sm text-foreground">Imprimir boleta por defecto al confirmar una venta</span>
            </label>
          </section>

          {/* Save */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </form>

      <Toast
        message={toast?.message ?? ""}
        variant={toast?.variant ?? "success"}
        open={toast !== null}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
