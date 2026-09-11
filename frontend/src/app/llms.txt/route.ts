import { SITE_URL } from '@/lib/seo';
export function GET() {
  return new Response(`# Kühlturm · Ensotek

> Industrial cooling towers and related services. Kühlturm is an Ensotek brand.

## Website
- [Deutsch](${SITE_URL}/de)
- [English](${SITE_URL}/en)
- [Products](${SITE_URL}/en/product)
- [Services](${SITE_URL}/en/service)
- [Knowledge base](${SITE_URL}/en/library)
- [Contact](${SITE_URL}/en/contact)
- [Sitemap](${SITE_URL}/sitemap.xml)

Use the current product documentation and contact Ensotek to confirm project-specific specifications.
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
