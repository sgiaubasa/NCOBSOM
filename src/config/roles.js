export const USER_ROLES = {
  "sergio.montes@aubasa.com.ar": ["hallazgos", "infodoc"]
};

/**
 * Función helper para verificar si un usuario tiene acceso a un módulo
 */
export const hasAccess = (email, module) => {
  if (!email) return false;
  const userRoles = USER_ROLES[email.toLowerCase()];
  if (!userRoles) return false;
  return userRoles.includes(module);
};
