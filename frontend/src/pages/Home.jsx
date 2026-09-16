import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfil, getProjects, getExperiences, getTechnologies, mediaUrl } from '../api/strapi';
import ProjectCard from '../components/ProjectCard';
import Loader from '../components/Loader';

const CATEGORY_LABELS = {
  frontend: 'Front-end',
  backend: 'Back-end',
  base_de_donnees: 'Données',
  outil: 'Outils',
  methode: 'Méthodes',
};
const CATEGORY_ORDER = ['frontend', 'backend', 'base_de_donnees', 'outil', 'methode'];

export default function Home() {
  const [profil, setProfil] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | empty | error

  useEffect(() => {
    Promise.all([getProfil(), getProjects(), getExperiences(), getTechnologies()])
      .then(([profilData, projectsData, experiencesData, technologiesData]) => {
        setProfil(profilData);
        setProjects(projectsData || []);
        setExperiences(experiencesData || []);
        setTechnologies(technologiesData || []);
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
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const toShow = featured.length > 0 ? featured : projects.slice(0, 4);

  const skillGroups = CATEGORY_ORDER
    .map((cat) => ({
      key: cat,
      title: CATEGORY_LABELS[cat],
      items: technologies.filter((t) => t.category === cat).map((t) => t.name),
    }))
    .filter((g) => g.items.length > 0);

  const stats = [
    { n: String(projects.length), l: projects.length > 1 ? 'projets livrés' : 'projet livré' },
    { n: String(technologies.length), l: 'technologies maîtrisées' },
    { n: String(experiences.length), l: experiences.length > 1 ? 'expériences' : 'expérience' },
  ].filter((s) => s.n !== '0');

  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: 88, paddingBottom: 72 }}>
        <div
          className="container"
          style={{ display: 'grid', gridTemplateColumns: photoUrl ? '1.25fr 0.75fr' : '1fr', gap: 56, alignItems: 'end' }}
        >
          <div>
            {profil.availability && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  border: '1px solid #cfe0ff',
                  background: '#eef4ff',
                  color: 'var(--color-accent-hover)',
                  padding: '7px 14px',
                  borderRadius: 999,
                  fontSize: 13,
                  marginBottom: 34,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)', animation: 'blink 2s infinite' }} />
                {profil.availability}
              </div>
            )}
            <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)', lineHeight: 0.98, margin: '0 0 26px', letterSpacing: '-0.02em' }}>
              {profil.jobTitle || profil.fullName}
              {profil.tagline && (
                <>
                  <br />
                  <em style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>{profil.tagline}</em>
                </>
              )}
            </h1>
            {profil.bio && (
              <div
                className="muted"
                style={{ fontSize: 19, lineHeight: 1.6, maxWidth: '52ch', margin: '0 0 34px' }}
                dangerouslySetInnerHTML={{ __html: profil.bio }}
              />
            )}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/projets" className="btn">Voir les projets</Link>
              {cvUrl && (
                <a href={cvUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                  Télécharger le CV
                </a>
              )}
            </div>
          </div>
          {photoUrl && (
            <div style={{ animation: 'floaty 7s ease-in-out infinite' }}>
              <img
                src={photoUrl}
                alt={profil.fullName}
                style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', borderRadius: 4, border: '1px solid var(--color-border)' }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section style={{ padding: 0 }}>
          <div className="container" style={{ display: 'flex', borderTop: '1px solid var(--color-border-soft)', borderBottom: '1px solid var(--color-border-soft)' }}>
            {stats.map((s) => (
              <div key={s.l} style={{ flex: 1, padding: '28px 0', borderRight: '1px solid var(--color-border-soft)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 40, lineHeight: 1 }}>{s.n}</div>
                <div className="eyebrow" style={{ marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* À propos */}
      {profil.bio && (
        <section>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48 }}>
            <div className="eyebrow">01 — À propos</div>
            <div
              style={{ maxWidth: '62ch', fontSize: 18, lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: profil.bio }}
            />
          </div>
        </section>
      )}

      {/* Parcours */}
      {experiences.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48 }}>
            <div className="eyebrow">02 — Parcours</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {experiences.map((exp, i) => (
                <div
                  key={exp.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 8,
                    padding: '22px 0',
                    borderTop: i === 0 ? '1px solid var(--color-border-soft)' : 'none',
                    borderBottom: '1px solid var(--color-border-soft)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600 }}>{exp.title}</div>
                    <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>{exp.organisation}</div>
                    {exp.description && (
                      <div
                        className="muted"
                        style={{ fontSize: 14, lineHeight: 1.7, marginTop: 10, maxWidth: '60ch' }}
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                  <span className="eyebrow" style={{ whiteSpace: 'nowrap' }}>
                    {exp.startDate} {exp.endDate ? `→ ${exp.endDate}` : exp.current ? "→ aujourd'hui" : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Compétences */}
      {skillGroups.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48 }}>
            <div className="eyebrow">03 — Compétences</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 1,
                background: 'var(--color-border-soft)',
                border: '1px solid var(--color-border-soft)',
              }}
            >
              {skillGroups.map((g) => (
                <div key={g.key} style={{ background: 'var(--color-surface-alt)', padding: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{g.title}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.9, color: 'var(--color-text-faint)' }}>
                    {g.items.join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projets */}
      {toShow.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--color-text)', paddingBottom: 16, marginBottom: 40 }}>
              <h2 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Projets sélectionnés</h2>
              <span className="eyebrow">04 — Projets</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
              {toShow.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
            <div style={{ marginTop: 40 }}>
              <Link to="/projets" className="btn btn-outline">Tous les projets →</Link>
            </div>
          </div>
        </section>
      )}

      {/* CV */}
      {cvUrl && (
        <section style={{ paddingTop: 0 }}>
          <div className="container">
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 4, padding: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 18 }}>05 — CV</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 34, marginBottom: 14 }}>Curriculum vitæ</div>
                <p className="muted" style={{ fontSize: 15, lineHeight: 1.7, margin: 0 }}>Parcours, formation et compétences détaillées en une page.</p>
              </div>
              <a href={cvUrl} target="_blank" rel="noreferrer" className="btn btn-accent">Télécharger le PDF</a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
