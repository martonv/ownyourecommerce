import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://ownyourecommerce.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
