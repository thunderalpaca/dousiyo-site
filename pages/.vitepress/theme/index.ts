// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './style.css'
import './font.css'
import BigImage from './components/BigImage.vue'
import DataCheck from './components/DataCheck.vue'
import LineInfo from './components/LineInfo.vue'
import Numberling from './components/Numberling.vue'
import Stations from './components/Stations.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('BigImage', BigImage)
    app.component('DataCheck', DataCheck)
    app.component('LineInfo', LineInfo)
    app.component('Numberling', Numberling)
    app.component('Stations', Stations)
  }
} satisfies Theme
