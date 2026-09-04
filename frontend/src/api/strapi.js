import axios from 'axios';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
});

/**
 * Transforme une URL de média Strapi (relative) en URL absolue.
 * Strapi renvoie parfois des chemins relatifs type "/uploads/xxx.png".
 */
export function mediaUrl(media) {
  if (!media?.url) return null;
  return media.url.startsWith('http') ? media.url : `${STRAPI_URL}${media.url}`;
}

export async function getProfil() {
  const { data } = await api.get('/profil', {
    params: { populate: ['photo', 'cvFile'] },
  });
  return data.data;
}

export async function getProjects() {
  const { data } = await api.get('/projects', {
    params: {
      populate: ['coverImage', 'technologies', 'technologies.icon'],
      sort: ['order:asc', 'year:desc'],
    },
  });
  return data.data;
}

export async function getProjectBySlug(slug) {
  const { data } = await api.get('/projects', {
    params: {
      filters: { slug: { $eq: slug } },
      populate: ['coverImage', 'gallery', 'technologies', 'technologies.icon'],
    },
  });
  return data.data?.[0] || null;
}

export async function getExperiences() {
  const { data } = await api.get('/experiences', {
    params: { sort: ['order:asc', 'startDate:desc'] },
  });
  return data.data;
}

export default api;
