import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/new-task',
      name: 'new-task',
      component: () => import('../views/task/NewTask.vue')
    },
    {
      path: '/task/:id',
      name: 'task-view',
      props: true,
      component: () => import('../views/task/TaskView.vue')
    },
    {
      path: '/task/:taskId/record',
      name: 'record-view',
      props: true,
      component: () => import('../views/record/RecordView.vue')
    }
  ]
})
