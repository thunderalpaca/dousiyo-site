// ...existing code...
import { createContentLoader } from 'vitepress';

export default createContentLoader([
    '/company/*/car/**/*.md',
    '/company/*/*/car/**/*.md',
    '/company/*/index.md',
    '/company/*/*/index.md'
], {
    includeSrc: false,
    transform(rawData) {

        const parentMap = new Map<string, any>();
        rawData.forEach(page => {
            if (!page.url) return;
            const url = page.url.endsWith('/') ? page.url : page.url + '/';
            if (/^\/company\/[^/]+\/$/.test(url) || /^\/company\/[^/]+\/[^/]+\/$/.test(url)) {
                parentMap.set(url, page);
            }
        });

        const carPages = rawData.filter(p => p.url && p.url.includes('/car/'));
        const groupsMap: Record<string, { parent: any | null; children: any[] }> = {};
        carPages.forEach(p => {
            const parts = p.url.split('/car/');
            const parentKey = parts[0].endsWith('/') ? parts[0] : parts[0] + '/';
            if (!groupsMap[parentKey]) groupsMap[parentKey] = { parent: parentMap.get(parentKey) || null, children: [] };
            groupsMap[parentKey].children.push(p);
        });

        return Object.keys(groupsMap).map(k => ({
            parent: groupsMap[k].parent,
            children: groupsMap[k].children.sort((a, b) => {
                const ta = (a.frontmatter?.title || '').toString();
                const tb = (b.frontmatter?.title || '').toString();
                return ta.localeCompare(tb);
            })
        }));
    }
});