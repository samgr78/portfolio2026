import { mediaUrl } from '../api/strapi';

export default function TechBadge({ tech }) {
  const iconUrl = mediaUrl(tech.icon);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'var(--color-bg-alt)',
        border: '1px solid var(--color-border)',
        borderRadius: 999,
        padding: '4px 10px',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
      }}
    >
      {iconUrl && <img src={iconUrl} alt={tech.name} style={{ width: 14, height: 14 }} />}
      {tech.name}
    </span>
  );
}
