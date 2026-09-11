import type { APIRoute } from 'astro';
import { site } from '../../data/site';

// RFC 9116 security.txt. Expires is recomputed on every build, so redeploy at least once a year.
export const GET: APIRoute = ({ site: siteUrl }) => {
  const origin = siteUrl?.origin ?? '';
  const expires = new Date(Date.now() + 364 * 24 * 60 * 60 * 1000).toISOString();
  const body = [
    `Contact: mailto:${site.email}`,
    `Expires: ${expires}`,
    `Policy: ${origin}/security`,
    `Canonical: ${origin}/.well-known/security.txt`,
    'Preferred-Languages: en',
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
