import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfil, getProjects, getExperiences, mediaUrl } from '../api/strapi';
import ProjectCard from '../components/ProjectCard';
import Loader from '../components/Loader';

export default function Home() {
  const [profil, setProfil] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | empty | error

  useEffect(() => {
    Promise.all([getProfil(), getProjects(), getExperiences()])
      .then(([profilData, projectsData, experiencesData]) => {
        setProfil(profilData);
        setProjects(projectsData || []);
        setExperiences(experiencesData || []);
        setStatus(profilData ? 'ready' : 'empty');
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
      });
  }, []);

  if (status === 'loading') return <Loader />;

  if (status === 'error') {
    return (
      <div className="error-msg container">
        Impossible de contacter le CMS. Vérifie que le backend Strapi tourne bien
        (<code>npm run develop</code> dans le dossier <code>backend</code>).
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="error-msg container">
        Aucune donnée de profil trouvée. Va dans l'admin Strapi (<code>/admin</code>) et remplis
        le contenu unique <strong>Profil</strong>.
      </div>
    );
  }

  const photoUrl = mediaUrl(profil.photo);
  const cvUrl = mediaUrl(profil.cvFile);
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const toShow = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <>
      <section>
        <div className="container" style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          {photoUrl && (
            <img
              src={photoUrl}
              alt={profil.fullName}
              style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }}
            />
          )}
          <div style={{ flex: 1, minWidth: 280 }}>
            {profil.availability && (
              <span
                style={{
                  display: 'inline-block',
                  marginBottom: 12,
                  fontSize: '0.8rem',
                  color: '#7ee787',
                  background: 'rgba(126,231,135,0.1)',
                  border: '1px solid rgba(126,231,135,0.3)',
                  borderRadius: 999,
                  padding: '4px 12px',
                }}
              >
                {profil.availability}
              </span>
            )}
            <h1 style={{ fontSize: '2.2rem', margin: '0 0 8px' }}>{profil.fullName}</h1>
            <p className="muted" style={{ fontSize: '1.1rem', margin: '0 0 16px' }}>
              {profil.jobTitle} {profil.tagline ? `— ${profil.tagline}` : ''}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/projets" className="btn">Voir mes projets</Link>
              {cvUrl && (
                <a href={cvUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                  Télécharger mon CV
                </a>
              )}
              <Link to="/contact" className="btn btn-outline">Me contacter</Link>
            </div>
          </div>
        </div>
      </section>

      {profil.bio && (
        <section style={{ paddingTop: 0 }}>
          <div className="container card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: '1.3rem' }}>À propos</h2>
            <div style={{ color: 'var(--color-text-muted)' }} dangerouslySetInnerHTML={{ __html: profil.bio }} />
          </div>
        </section>
      )}

      {toShow.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="container">
            <h2>Projets récents</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {toShow.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Link to="/projets" className="btn btn-outline">Tous les projets →</Link>
            </div>
          </div>
        </section>
      )}

      {experiences.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="container">
            <h2>Parcours</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {experiences.map((exp) => (
                <div key={exp.id} className="card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <strong>{exp.title} · {exp.organisation}</strong>
                    <span className="muted" style={{ fontSize: '0.85rem' }}>
                      {exp.startDate} {exp.endDate ? `→ ${exp.endDate}` : exp.current ? '→ aujourd\'hui' : ''}
                    </span>
                  </div>
                  {exp.description && (
                    <div
                      className="muted"
                      style={{ marginTop: 8, fontSize: '0.9rem' }}
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
