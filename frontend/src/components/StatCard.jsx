export default function StatCard({ icon, label, value, accent = false }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: `1px solid ${accent ? 'var(--brand)' : 'var(--border-color)'}`,
        borderRadius: 10,
        padding: 16,
        flex: 1,
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent ? 'var(--brand)' : 'var(--text-primary)' }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
    </div>
  );
}