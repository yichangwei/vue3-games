import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = []

// import routes files
const modules = import.meta.globEager('./routes/**/*.ts')

Object.values(modules).forEach(v => {
  routes.push(...v.default)
})

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
