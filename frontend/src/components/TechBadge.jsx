import { mediaUrl } from '../api/strapi';

export default function TechBadge({ tech }) {
  const iconUrl = mediaUrl(tech.icon);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        border: '1px solid var(--color-border)',
        borderRadius: 3,
        padding: '4px 8px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--color-text-faint)',
      }}
    >
      {iconUrl && <img src={iconUrl} alt={tech.name} style={{ width: 12, height: 12 }} />}
      {tech.name}
    </span>
  );
}
