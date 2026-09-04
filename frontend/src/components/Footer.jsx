export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', padding: '24px 0', marginTop: 'auto' }}>
      <div className="container muted" style={{ fontSize: '0.85rem', textAlign: 'center' }}>
        © {new Date().getFullYear()} Samuel Galliani-Royer — Portfolio propulsé par Strapi &amp; React
      </div>
    </footer>
  );
}
