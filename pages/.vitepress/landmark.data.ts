import { createContentLoader } from 'vitepress';

export default createContentLoader('/tour/landmark/*.md', {
    includeSrc: false,
    transform(rawData) {
        return rawData
        .filter(page => !!page.frontmatter.title)
    }
});