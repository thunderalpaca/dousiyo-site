import { defineConfig } from 'vitepress'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'

// https://vitepress.dev/reference/site-config
const rawBase = process.env.VITEPRESS_BASE
const normalizedBase = rawBase && rawBase.trim() !== ''
  ? `/${rawBase.replace(/^\/+/g, '').replace(/\/+$/g, '')}/`
  : '/'

export default defineConfig({
  lang: 'ja-JP',
  base: normalizedBase,
  title: '名前どうしよ鯖のサイト',
  ignoreDeadLinks: true,
  description: '名前どうしよ鯖の長い歴史と各鉄道会社について紹介',
  head: [['link', { rel: 'icon', href: `${normalizedBase}favicon.png` }]],
  cleanUrls: true,
  lastUpdated: true,
  vite: { plugins: [pagefindPlugin({
    btnPlaceholder: '検索',
    placeholder: 'サイト内を検索',
    emptyText: '結果はありませんでした',
    heading: '{{searchResult}}個発見'
  })] },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.png',
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'ニュース', link: '/news' },
      { text: '鉄道', link: '/railway' },
      { text: '路線図', link: '/map' },
      { text: '観光', link: '/tour' },
      { text: '法律', link: '/law' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/valine3gDev/dousiyo-site' }
    ],
    editLink: {
      pattern: 'https://github.com/valine3gDev/dousiyo-site/edit/main/pages/:path',
      text: 'このページを編集する'
    },
    lastUpdatedText: '最終更新',
    outlineTitle: '目次',
  },
})
