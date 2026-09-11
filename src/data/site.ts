// Business details shared by the site and the legal pages.
// Values marked TODO are placeholders. Replace them before launch.
export const site = {
  name: 'Own Your eCommerce',
  legalName: 'Own Your eCommerce',
  // TODO: inbox for leads, privacy requests, and security reports.
  email: 'hello@example.com',
  // TODO: your Formspree form ID, the part after /f/ in https://formspree.io/f/<id>.
  formspreeId: 'YOUR_FORM_ID',
  // TODO: the US state whose laws govern the Terms of Service, e.g. 'Texas'.
  governingState: '',
};

const placeholders = [
  site.email.endsWith('@example.com') && 'email',
  site.formspreeId === 'YOUR_FORM_ID' && 'formspreeId',
  !site.governingState && 'governingState',
].filter(Boolean);

if (placeholders.length > 0) {
  console.warn(`[site] Placeholder values in src/data/site.ts: ${placeholders.join(', ')}. Fill them in before launch.`);
}
