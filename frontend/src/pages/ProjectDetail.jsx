import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectBySlug, mediaUrl } from '../api/strapi';
import TechBadge from '../components/TechBadge';
import Loader from '../components/Loader';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    getProjectBySlug(slug)
      .then((data) => {
        setProject(data);
        setStatus(data ? 'ready' : 'notfound');
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
      });
  }, [slug]);

  if (status === 'loading') return <Loader />;
  if (status === 'notfound') {
    return (
      <div className="error-msg container">
        Projet introuvable. <Link to="/projets">← Retour aux projets</Link>
      </div>
    );
  }
  if (status === 'error') {
    return <div className="error-msg container">Erreur lors du chargement du projet.</div>;
  }

  const { title, description, coverImage, gallery, technologies, projectUrl, githubUrl, duration, teamType, year } = project;
  const coverUrl = mediaUrl(coverImage);

  return (
    <section>
      <div className="container" style={{ maxWidth: 800 }}>
        <Link to="/projets" className="muted" style={{ fontSize: '0.9rem' }}>← Retour aux projets</Link>
        <h1 style={{ marginTop: 12 }}>{title}</h1>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }} className="muted">
          {year && <span>{year}</span>}
          {duration && <span>· {duration}</span>}
          {teamType && <span>· {teamType}</span>}
        </div>

        {coverUrl && <img src={coverUrl} alt={title} style={{ width: '100%', borderRadius: 'var(--radius)', marginBottom: 24 }} />}

        {technologies?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {technologies.map((t) => (
              <TechBadge key={t.id} tech={t} />
            ))}
          </div>
        )}

        {(projectUrl || githubUrl) && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {projectUrl && <a href={projectUrl} target="_blank" rel="noreferrer" className="btn">Voir le site</a>}
            {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline">Voir le code</a>}
          </div>
        )}

        {description && <div dangerouslySetInnerHTML={{ __html: description }} />}

        {gallery?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 32 }}>
            {gallery.map((img) => (
              <img key={img.id} src={mediaUrl(img)} alt="" style={{ borderRadius: 'var(--radius)' }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
