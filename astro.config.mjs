import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ownyourecommerce.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
