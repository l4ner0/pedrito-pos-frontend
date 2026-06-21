interface KPICardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  iconClass: string;
}

export function KPICard({ label, value, sub, icon: Icon, iconClass }: KPICardProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${iconClass}`}
        >
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-3 text-xl font-semibold tracking-tight lg:text-2xl">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}
