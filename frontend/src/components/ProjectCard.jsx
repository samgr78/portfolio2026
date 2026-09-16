import { Link } from 'react-router-dom';
import { mediaUrl } from '../api/strapi';
import TechBadge from './TechBadge';

export default function ProjectCard({ project }) {
  const { title, slug, shortDescription, coverImage, technologies, year } = project;
  const imgUrl = mediaUrl(coverImage);

  return (
    <Link
      to={`/projets/${slug}`}
      className="project-card"
      style={{
        display: 'block',
        color: 'inherit',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        background: 'var(--color-surface-alt)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          aspectRatio: '16 / 10',
          background: imgUrl
            ? undefined
            : 'repeating-linear-gradient(135deg, #ece8e1 0 8px, #f4f1ec 8px 16px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {imgUrl && (
          <img src={imgUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      <div style={{ padding: '22px 24px 26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 600 }}>{title}</span>
          {year && <span className="eyebrow">{year}</span>}
        </div>
        <p className="muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px' }}>
          {shortDescription}
        </p>
        {technologies?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {technologies.map((t) => (
              <TechBadge key={t.id} tech={t} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
