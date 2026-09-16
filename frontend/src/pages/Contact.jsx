import { useEffect, useState } from 'react';
import { getProfil } from '../api/strapi';
import Loader from '../components/Loader';

export default function Contact() {
  const [profil, setProfil] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    getProfil()
      .then((data) => {
        setProfil(data);
        setStatus(data ? 'ready' : 'empty');
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
      });
  }, []);

  if (status === 'loading') return <Loader />;
  if (status === 'error' || status === 'empty') {
    return <div className="error-msg container">Impossible de charger les informations de contact.</div>;
  }

  const { email, phone, location, linkedinUrl, githubUrl } = profil;

  return (
    <section style={{ paddingTop: 72 }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Contact</div>
        <h2 style={{ marginBottom: 32 }}>Me contacter</h2>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 4, padding: 32, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--color-surface-alt)' }}>
          {email && (
            <div>
              <span className="eyebrow">Email </span>
              <br />
              <a href={`mailto:${email}`} style={{ fontSize: 16 }}>{email}</a>
            </div>
          )}
          {phone && (
            <div>
              <span className="eyebrow">Téléphone </span>
              <br />
              <span style={{ fontSize: 16 }}>{phone}</span>
            </div>
          )}
          {location && (
            <div>
              <span className="eyebrow">Localisation </span>
              <br />
              <span style={{ fontSize: 16 }}>{location}</span>
            </div>
          )}
          {linkedinUrl && (
            <div>
              <span className="eyebrow">LinkedIn </span>
              <br />
              <a href={linkedinUrl} target="_blank" rel="noreferrer" style={{ fontSize: 16 }}>{linkedinUrl}</a>
            </div>
          )}
          {githubUrl && (
            <div>
              <span className="eyebrow">GitHub </span>
              <br />
              <a href={githubUrl} target="_blank" rel="noreferrer" style={{ fontSize: 16 }}>{githubUrl}</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
