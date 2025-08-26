import { createContentLoader } from 'vitepress';

export default createContentLoader('/station/stations/*.md', {
    includeSrc: false,
    transform(rawData) {
        return rawData
        .filter(page => !!page.frontmatter.title)
    }
});