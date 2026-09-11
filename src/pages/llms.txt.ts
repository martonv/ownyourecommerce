import type { APIRoute } from 'astro';
import { site as business } from '../data/site';

// llms.txt (https://llmstxt.org): a plain summary of the site for AI assistants.
export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const body = `# ${business.name}

> ${business.name} (oye.) builds custom eCommerce stores with built-in inventory, production, CRM, marketing, and support systems. Clients own all of the code, pay one flat build fee, and pay no monthly platform fees.

## Services

- Custom storefronts and checkout, with Helcim payments and FedEx, UPS, USPS, and DHL shipping
- Inventory and warehousing: multi-warehouse stock, barcode receiving and picking, purchase orders, lot and serial tracking
- Production and manufacturing: bills of materials, work orders, material checks, routing, and capacity planning
- CRM: contacts, companies, deal pipelines, order history, and HubSpot or Salesforce sync
- Prebuilt growth modules: AI marketing, SEO and AEO, Google Ads and Merchant Center, server-side pixels, social commerce, international selling, affiliates and influencers, email and SMS flows, A/B testing, fraud screening, gift cards, pre-orders, and bundles, reviews and loyalty, an AI shopping assistant, live chat, custom shipping, and accessibility to WCAG 2.2 AA
- Custom builds: B2B portals, quotes, product configurators, subscriptions, customer portals, returns, marketplace sync, point of sale, and EDI

## Pages

- [Home](${url('/')}): services, an interactive sample admin, a cost comparison, the build process, and FAQ
- [Contact](${url('/#contact')}): project inquiry form
- [Privacy Policy](${url('/privacy')})
- [Terms of Service](${url('/terms')})
- [Cookie Policy](${url('/cookies')})
- [Security](${url('/security')})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
