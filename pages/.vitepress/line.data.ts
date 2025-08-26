import { createContentLoader } from 'vitepress';

export default createContentLoader(['/company/*/line/*.md', '/company/*/*/line/*.md'], {
    includeSrc: false,
    transform(rawData) {
        return rawData.filter(page => !!page.frontmatter.title)
    }
});