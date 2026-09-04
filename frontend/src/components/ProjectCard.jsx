import { Link } from 'react-router-dom';
import { mediaUrl } from '../api/strapi';
import TechBadge from './TechBadge';

export default function ProjectCard({ project }) {
  const { title, slug, shortDescription, coverImage, technologies, year } = project;
  const imgUrl = mediaUrl(coverImage);

  return (
    <Link to={`/projets/${slug}`} className="card" style={{ display: 'block', color: 'inherit' }}>
      {imgUrl && <img src={imgUrl} alt={title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
          {year && <span className="muted" style={{ fontSize: '0.85rem' }}>{year}</span>}
        </div>
        <p className="muted" style={{ fontSize: '0.9rem', margin: '8px 0 12px' }}>
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
