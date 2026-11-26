import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import VueDiff from 'vue-diff'

import './assets/main.scss'
import 'vue-diff/dist/index.css'

createApp(App)
  .use(createPinia().use(piniaPluginPersistedstate))
  .use(router)
  .use(VueDiff)
  .mount('#app')
