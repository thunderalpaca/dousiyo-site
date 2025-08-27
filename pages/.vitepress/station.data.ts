import { createContentLoader } from 'vitepress'

const GOJUON = [
    'あ', 'い', 'う', 'え', 'お',
    'か', 'き', 'く', 'け', 'こ',
    'さ', 'し', 'す', 'せ', 'そ',
    'た', 'ち', 'つ', 'て', 'と',
    'な', 'に', 'ぬ', 'ね', 'の',
    'は', 'ひ', 'ふ', 'へ', 'ほ',
    'ま', 'み', 'む', 'め', 'も',
    'や', 'ゆ', 'よ',
    'ら', 'り', 'る', 'れ', 'ろ',
    'わ', 'を', 'ん',
    'ゐ', 'ゑ'
] as const

const ORDER: Record<string, number> = Object.fromEntries(GOJUON.map((c, i) => [c, i]))

function kataToHira(ch: string): string {
    if (!ch) return ''
    const code = ch.codePointAt(0) ?? 0
    // カタカナ範囲 -> ひらがなへ
    if (code >= 0x30A1 && code <= 0x30FA) {
        return String.fromCodePoint(code - 0x60)
    }
    return ch
}

function normalizeKana(ch: string): string {
    if (!ch) return ''
    let c = kataToHira(ch)
    const smallMap: Record<string, string> = {
        'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
        'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'ゎ': 'わ', 'っ': 'つ'
    }
    if (smallMap[c]) c = smallMap[c]

    const dakuMap: Record<string, string> = {
        'が': 'か', 'ぎ': 'き', 'ぐ': 'く', 'げ': 'け', 'ご': 'こ',
        'ざ': 'さ', 'じ': 'し', 'ず': 'す', 'ぜ': 'せ', 'ぞ': 'そ',
        'だ': 'た', 'ぢ': 'ち', 'づ': 'つ', 'で': 'て', 'ど': 'と',
        'ば': 'は', 'び': 'ひ', 'ぶ': 'ふ', 'べ': 'へ', 'ぼ': 'ほ',
        'ぱ': 'は', 'ぴ': 'ひ', 'ぷ': 'ふ', 'ぺ': 'へ', 'ぽ': 'ほ',
        'ゔ': 'う'
    }
    if (dakuMap[c]) c = dakuMap[c]

    if (c === 'ゐ') c = 'い'
    if (c === 'ゑ') c = 'え'
    return c
}

function firstKanaAfterHiraganaLabel(src: string): string | undefined {
    if (!src) return undefined

    const m = src.match(/^\s*ひらがな:\s*([^\n\r<]+)/m)
    if (!m) return undefined
    const reading = (m[1] || '').trim()
    if (!reading) return undefined

    const first = (reading.match(/[\p{sc=Hiragana}\p{sc=Katakana}\p{L}\p{N}]/u) || [])[0]
    if (!first) return undefined
    return first
}

function gojuonKeyFromSrc(src: string): { idx: number; raw: string } {
    const first = firstKanaAfterHiraganaLabel(src)
    if (!first) return { idx: Number.POSITIVE_INFINITY, raw: '' }
    const base = normalizeKana(first)
    const idx = ORDER[base]
    if (typeof idx === 'number') return { idx, raw: base }

    return { idx: Number.POSITIVE_INFINITY, raw: base }
}

export default createContentLoader('/station/stations/*.md', {
    includeSrc: true,
    transform(rawData) {
        return rawData
            .filter((page) => !!page.frontmatter.title)
            .sort((a, b) => {
                const ka = gojuonKeyFromSrc(a.src || '')
                const kb = gojuonKeyFromSrc(b.src || '')
                if (ka.idx !== kb.idx) return ka.idx - kb.idx
                if (ka.raw !== kb.raw) return ka.raw.localeCompare(kb.raw)
                const ta = String(a.frontmatter?.title || '')
                const tb = String(b.frontmatter?.title || '')
                return ta.localeCompare(tb)
            })
            .map((page) => {
                const k = gojuonKeyFromSrc(page.src || '')
                const groupKey = Number.isFinite(k.idx) && k.raw ? k.raw : 'その他'
                return { ...page, groupKey }
            })
    }
})