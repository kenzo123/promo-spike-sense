export default function SectionCard({ icon: Icon, title, children, badge }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#1A1A1A", border: "1px solid #2A2A2A" }}>
      <div className="px-5 py-4 border-b flex items-center gap-2.5" style={{ borderColor: "#2A2A2A" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(99,102,241,0.1)" }}>
          <Icon size={13} style={{ color: "#6366F1" }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: "#F5F5F5" }}>{title}</h3>
        {badge && <span className="ml-auto">{badge}</span>}
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  );
}