// import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * Ici : on autorise automatiquement la lecture publique (find/findOne)
   * sur les content-types du portfolio, pour que le frontend React
   * puisse consommer l'API sans authentification.
   * Sans ça, il faut cocher les cases à la main dans
   * Réglages > Rôles > Public à chaque nouveau content-type.
   */
  async bootstrap({ strapi }: any) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    const contentTypesToExpose = ['project', 'technologie', 'experience', 'profil'];
    const actionsToEnable = ['find', 'findOne'];

    for (const contentType of contentTypesToExpose) {
      for (const action of actionsToEnable) {
        const actionId = `api::${contentType}.${contentType}.${action}`;

        const existingPermission = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action: actionId, role: publicRole.id } });

        if (!existingPermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: actionId,
              role: publicRole.id,
            },
          });
        }
      }
    }

    strapi.log.info('[portfolio] Permissions publiques (find/findOne) verifiees pour project, technologie, experience, profil.');
  },
};
