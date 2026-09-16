import { useEffect, useState } from 'react';
import { getProjects } from '../api/strapi';
import ProjectCard from '../components/ProjectCard';
import Loader from '../components/Loader';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data || []);
        setStatus('ready');
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
      });
  }, []);

  if (status === 'loading') return <Loader />;
  if (status === 'error') {
    return <div className="error-msg container">Impossible de charger les projets depuis le CMS.</div>;
  }

  return (
    <section style={{ paddingTop: 72 }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--color-text)', paddingBottom: 16, marginBottom: 40 }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Tous les projets</h2>
          <span className="eyebrow">Projets</span>
        </div>
        {projects.length === 0 ? (
          <p className="muted">
            Aucun projet publié pour l'instant. Ajoute-en un depuis l'admin Strapi (<code>/admin</code> → Contenu → Projet).
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
