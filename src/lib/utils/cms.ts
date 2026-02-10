// src/lib/cms.ts
import { getLocale } from '$lib/paraglide/runtime';

// Import all JSON files from your pages folder
const pageModules = import.meta.glob('/src/lib/content/**/*.json', { eager: true });

export function getContent(slug: string) {
    const lang = getLocale();
    const path = `/src/lib/content/${slug}.${lang}.json`;
    const fallbackPath = `/src/lib/content/${slug}.en.json`;

    const data = pageModules[path] || pageModules[fallbackPath];

    if (!data) {
        console.warn(`CMS Content missing for: ${slug}`);
        return {};
    }

    return (data as any).default;
}