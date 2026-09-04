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
    <section>
      <div className="container">
        <h2>Tous les projets</h2>
        {projects.length === 0 ? (
          <p className="muted">
            Aucun projet publié pour l'instant. Ajoute-en un depuis l'admin Strapi (<code>/admin</code> → Contenu → Projet).
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
