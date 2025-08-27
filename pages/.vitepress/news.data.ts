import { createContentLoader } from 'vitepress';

export default createContentLoader('/news/content/*.md', {
    includeSrc: false,
    transform(rawData) {
        return rawData
            .filter((page) => !!page.frontmatter?.title)
            .sort((a, b) => {
                const aTime = a.frontmatter?.date ? new Date(a.frontmatter.date as string).getTime() : 0;
                const bTime = b.frontmatter?.date ? new Date(b.frontmatter.date as string).getTime() : 0;
                return bTime - aTime;
            });
    }
});