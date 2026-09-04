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
    <section>
      <div className="container" style={{ maxWidth: 600 }}>
        <h2>Me contacter</h2>
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {email && (
            <div>
              <span className="muted">Email : </span>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          )}
          {phone && (
            <div>
              <span className="muted">Téléphone : </span>
              {phone}
            </div>
          )}
          {location && (
            <div>
              <span className="muted">Localisation : </span>
              {location}
            </div>
          )}
          {linkedinUrl && (
            <div>
              <span className="muted">LinkedIn : </span>
              <a href={linkedinUrl} target="_blank" rel="noreferrer">{linkedinUrl}</a>
            </div>
          )}
          {githubUrl && (
            <div>
              <span className="muted">GitHub : </span>
              <a href={githubUrl} target="_blank" rel="noreferrer">{githubUrl}</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
