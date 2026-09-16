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
    <section style={{ paddingTop: 72 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <Link to="/projets" className="eyebrow">← Retour aux projets</Link>
        <h1 style={{ marginTop: 16, marginBottom: 12, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>{title}</h1>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }} className="eyebrow">
          {year && <span>{year}</span>}
          {duration && <span>· {duration}</span>}
          {teamType && <span>· {teamType}</span>}
        </div>

        {coverUrl && (
          <img
            src={coverUrl}
            alt={title}
            style={{ width: '100%', borderRadius: 4, border: '1px solid var(--color-border)', marginBottom: 32 }}
          />
        )}

        {technologies?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {technologies.map((t) => (
              <TechBadge key={t.id} tech={t} />
            ))}
          </div>
        )}

        {(projectUrl || githubUrl) && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            {projectUrl && <a href={projectUrl} target="_blank" rel="noreferrer" className="btn">Voir le site</a>}
            {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline">Voir le code</a>}
          </div>
        )}

        {description && (
          <div style={{ fontSize: 17, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: description }} />
        )}

        {gallery?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 40 }}>
            {gallery.map((img) => (
              <img key={img.id} src={mediaUrl(img)} alt="" style={{ borderRadius: 4, border: '1px solid var(--color-border)' }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
