import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const outputDirs = [path.join(rootDir, 'dist/app/browser')];

// Ngx BOS is an authenticated CRM SPA, not a public/indexable site (see projects/ngx-bos/ai/architecture.md
// "SPA Contract"). Only the root/sign-in page is discoverable — everything past sign-in requires a
// real session and must stay out of search results. CNAME holds the real per-org domain once this
// template is distributed to an org repo (see documentation/org-branches.md); it doesn't exist in the
// source workspace itself, hence the fallback.
const siteUrl = `https://${await readDomain()}`;

await Promise.all(
	outputDirs.map(async (outputDir) => {
		await mkdir(outputDir, { recursive: true });
		await writeFile(path.join(outputDir, 'sitemap.xml'), buildSitemap(siteUrl));
		await writeFile(path.join(outputDir, 'robots.txt'), buildRobots(siteUrl));
	}),
);

function buildSitemap(siteUrl) {
	const lastmod = new Date().toISOString().slice(0, 10);

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${escapeXml(siteUrl)}/sign</loc>
		<lastmod>${lastmod}</lastmod>
	</url>
</urlset>
`;
}

function buildRobots(siteUrl) {
	return `User-agent: *
Allow: /$
Allow: /sign$
Disallow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

async function readDomain() {
	try {
		return trimTrailingSlash((await readFile(path.join(rootDir, 'CNAME'), 'utf8')).trim());
	} catch {
		return 'example.com';
	}
}

function trimTrailingSlash(value) {
	return value.endsWith('/') ? value.slice(0, -1) : value;
}

function escapeXml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
