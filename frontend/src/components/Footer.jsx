import { useEffect, useState } from 'react';
import { getProfil } from '../api/strapi';

export default function Footer() {
  const [profil, setProfil] = useState(null);

  useEffect(() => {
    getProfil().then(setProfil).catch(() => {});
  }, []);

  const contacts = [profil?.email, profil?.phone, profil?.linkedinUrl, profil?.githubUrl].filter(Boolean);

  return (
    <footer style={{ marginTop: 'auto', background: 'var(--color-ink)', color: 'var(--color-ink-text)' }}>
      <div className="container" style={{ padding: '80px 24px 32px' }}>
        <div className="eyebrow" style={{ marginBottom: 20 }}>Contact</div>
        <h2 style={{ color: 'var(--color-ink-text)', fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', marginBottom: 28 }}>
          Parlons de<br />votre projet.
        </h2>
        {contacts.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 56 }}>
            {profil.email && (
              <a href={`mailto:${profil.email}`} style={{ color: '#93b8ff', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                {profil.email}
              </a>
            )}
            {profil.phone && (
              <span style={{ color: '#c9c4bb', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{profil.phone}</span>
            )}
            {profil.linkedinUrl && (
              <a href={profil.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: '#c9c4bb', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                LinkedIn
              </a>
            )}
            {profil.githubUrl && (
              <a href={profil.githubUrl} target="_blank" rel="noreferrer" style={{ color: '#c9c4bb', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                GitHub
              </a>
            )}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
            paddingTop: 24,
            borderTop: '1px solid var(--color-ink-border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: '#7d7871',
          }}
        >
          <span>© {new Date().getFullYear()} {profil?.fullName || 'Samuel Galliani-Royer'}</span>

        </div>
      </div>
    </footer>
  );
}
