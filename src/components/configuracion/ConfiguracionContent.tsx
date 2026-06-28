"use client";

import { useRef, useState } from "react";
import {
  Camera,
  Store,
  CreditCard,
  Printer,
  UploadCloud,
  X,
  UserCircle2,
  Building2,
  ShoppingCart,
} from "lucide-react";
import { Toast } from "@/components/ui/Toast";
import { useBusinessStore } from "@/store/businessStore";
import { useAuthStore } from "@/store/authStore";
import {
  updateBusiness,
  updateBusinessSettings,
} from "@/services/businessService";
import { cn } from "@/lib/utils";

type ToastState = { message: string; variant: "success" | "error" } | null;

const TABS = [
  { id: "perfil", label: "Perfil", icon: UserCircle2 },
  { id: "negocio", label: "Información del negocio", icon: Building2 },
  { id: "ventas", label: "Ventas", icon: ShoppingCart },
] as const;

type TabId = (typeof TABS)[number]["id"];

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30";
const LABEL_CLASS =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export function ConfiguracionContent() {
  const [activeTab, setActiveTab] = useState<TabId>("perfil");
  const [toast, setToast] = useState<ToastState>(null);

  const { business, settings, setBusiness, setSettings } = useBusinessStore();
  const { user } = useAuthStore();

  // — Tab Perfil —
  const [perfil, setPerfil] = useState({
    nombre: user?.fullName ?? "",
    rol: user?.role === "ADMIN" ? "Administrador" : "Cajero",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  }

  const initials = perfil.nombre
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  // — Tab Negocio —
  const [negocio, setNegocio] = useState({
    nombre: business?.name ?? "",
    ruc: business?.ruc ?? "",
    direccion: business?.address ?? "",
    telefono: business?.phone ?? "",
  });
  const [isSavingNegocio, setIsSavingNegocio] = useState(false);

  async function handleSaveNegocio(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingNegocio(true);
    try {
      const updated = await updateBusiness({
        name: negocio.nombre,
        ruc: negocio.ruc,
        address: negocio.direccion,
        phone: negocio.telefono,
      });
      setBusiness(updated);
      setToast({
        message: "Información del negocio actualizada",
        variant: "success",
      });
    } catch (err) {
      setToast({
        message:
          err instanceof Error ? err.message : "Error al guardar los cambios",
        variant: "error",
      });
    } finally {
      setIsSavingNegocio(false);
    }
  }

  // — Tab Configuración —
  const [yape, setYape] = useState({
    numero: settings?.yapeNumber ?? "",
    titular: settings?.yapeAccountHolder ?? "",
  });
  const [qrPreview, setQrPreview] = useState<string | null>(settings?.yapeQrUrl ?? null);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);
  const [impresion, setImpresion] = useState({
    imprimirPorDefecto: settings?.printEnabled ?? true,
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  function handleQrChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);
    setQrPreview(URL.createObjectURL(file));
  }

  function handleQrRemove() {
    setQrFile(null);
    setQrPreview(null);
    if (qrInputRef.current) qrInputRef.current.value = "";
  }

  async function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const updated = await updateBusinessSettings({
        yapeNumber: yape.numero || null,
        yapeAccountHolder: yape.titular || null,
        file: qrFile,
        printEnabled: impresion.imprimirPorDefecto,
        ticketFooter: null,
      });
      setSettings(updated);
      setToast({
        message: "Configuración actualizada correctamente",
        variant: "success",
      });
    } catch (err) {
      setToast({
        message:
          err instanceof Error
            ? err.message
            : "Error al guardar la configuración",
        variant: "error",
      });
    } finally {
      setIsSavingConfig(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="shrink-0 border-b border-border bg-card px-6">
        <div className="flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Perfil */}
      {activeTab === "perfil" && (
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 p-6">
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-base font-semibold text-foreground">
                Perfil de usuario
              </h2>

              <div className="mb-6 flex items-center gap-4">
                <div className="relative shrink-0">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-brand">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Foto de perfil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-white">
                        {initials}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary/90"
                  >
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {perfil.nombre}
                  </p>
                  <p className="text-sm text-muted-foreground">{perfil.rol}</p>
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>Nombre completo</label>
                <input
                  type="text"
                  value={perfil.nombre}
                  onChange={(e) =>
                    setPerfil({ ...perfil, nombre: e.target.value })
                  }
                  className={INPUT_CLASS}
                />
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Tab: Información del negocio */}
      {activeTab === "negocio" && (
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSaveNegocio}>
            <div className="flex flex-col gap-5 p-6">
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Store size={18} />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">
                    Datos del negocio
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={LABEL_CLASS}>Nombre del negocio</label>
                    <input
                      type="text"
                      value={negocio.nombre}
                      onChange={(e) =>
                        setNegocio({ ...negocio, nombre: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>RUC / DNI</label>
                    <input
                      type="text"
                      value={negocio.ruc}
                      onChange={(e) =>
                        setNegocio({ ...negocio, ruc: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Teléfono</label>
                    <input
                      type="text"
                      value={negocio.telefono}
                      onChange={(e) =>
                        setNegocio({ ...negocio, telefono: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={LABEL_CLASS}>Dirección</label>
                    <input
                      type="text"
                      value={negocio.direccion}
                      onChange={(e) =>
                        setNegocio({ ...negocio, direccion: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingNegocio}
                  className="rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  {isSavingNegocio ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Configuración */}
      {activeTab === "ventas" && (
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSaveConfig}>
            <div className="flex flex-col gap-5 p-6">
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <CreditCard size={18} />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">
                    Métodos de pago
                  </h2>
                </div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Yape
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>Número de teléfono</label>
                    <input
                      type="text"
                      value={yape.numero}
                      onChange={(e) =>
                        setYape({ ...yape, numero: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Titular de la cuenta</label>
                    <input
                      type="text"
                      value={yape.titular}
                      onChange={(e) =>
                        setYape({ ...yape, titular: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="col-span-2">
                    <p className={LABEL_CLASS}>Imagen QR</p>
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
                        <UploadCloud size={22} />
                        <span>Haz clic para subir la imagen del QR</span>
                        <span className="text-xs">PNG, JPG, WEBP</span>
                      </button>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-border bg-card p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Printer size={18} />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">
                    Impresión
                  </h2>
                </div>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={impresion.imprimirPorDefecto}
                    onChange={(e) =>
                      setImpresion({ imprimirPorDefecto: e.target.checked })
                    }
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-foreground">
                    Imprimir boleta por defecto al confirmar una venta
                  </span>
                </label>
              </section>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  {isSavingConfig ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <Toast
        message={toast?.message ?? ""}
        variant={toast?.variant ?? "success"}
        open={toast !== null}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
