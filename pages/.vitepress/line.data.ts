import { createContentLoader } from 'vitepress';

export default createContentLoader(['/company/*/line/*.md', '/company/*/*/line/*.md'], {
    includeSrc: true,
    transform(rawData) {
        const filtered = rawData.filter(page => !!page.frontmatter.title)
        return filtered.map(page => {
            const src = page.src || ''
            // Try to extract hex color following the "ラインカラー" label
            let color = ''
            // 1) Prefer style attribute color (6/8-digit hex)
            const styleMatch = src.match(/style\s*=\s*['"][^'\"]*?color\s*:\s*(#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}))\b/i)
            if (styleMatch) {
                color = styleMatch[1]
            } else {
                // 2) Fallback: first hex after "ラインカラー" (prefer 8/6 then 3)
                const blockMatch = src.match(/ラインカラー[\s\S]*?(#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3}))\b/)
                if (blockMatch) {
                    color = blockMatch[1]
                }
            }
            return { ...page, color }
        })
    }
});