import { createContentLoader } from 'vitepress';

export default createContentLoader('/station/stations/*.md', {
    includeSrc: true,
    transform(rawData) {
        const pages = rawData.filter(page => !!page.frontmatter.title)
        return pages.map(page => {
            const src: string = (page as any).src || ''

            // Narrow to the "乗り入れ路線" section (up to the next heading)
            let servedSection = ''
            const sectionIdx = src.indexOf('## 乗り入れ路線')
            if (sectionIdx !== -1) {
                const after = src.slice(sectionIdx)
                const nextIdx = after.indexOf('\n## ')
                servedSection = nextIdx !== -1 ? after.slice(0, nextIdx) : after
            }

            // Extract line ids from links to /company/.../line/<id>.md within that section
            const servedLineIds: string[] = []
            if (servedSection) {
                const re = /\]\((\/company\/[^)]+?\/line\/([a-z0-9_-]+)\.md)\)/gi
                for (const m of servedSection.matchAll(re)) {
                    const id = m[2]
                    if (id && !servedLineIds.includes(id)) servedLineIds.push(id)
                }
            }

            // Extract numberings like `B01`, `C12` etc, map letter -> digits
            const numberings: Record<string, string> = {}
            for (const m of src.matchAll(/`([A-Za-z])([0-9]+)`/g)) {
                const letter = m[1]
                const digits = m[2]
                if (letter && digits && !(letter in numberings)) numberings[letter] = digits
            }

            // Keep original fields, add non-breaking extras
            return {
                ...page,
                servedLineIds,
                numberings
            }
        })
    }
});