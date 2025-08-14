import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DetailArticleView from '@/views/DetailArticleView.vue'
import ArticleView from '@/views/ArticleView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/article',
      name: 'article',
      component: ArticleView,
    },
    {
      path: '/article/:id',
      name: 'detailArticle',
      component: DetailArticleView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    }
  ],
})

export default router
