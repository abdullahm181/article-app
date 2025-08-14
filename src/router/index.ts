import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DetailArticleView from '@/views/DetailArticleView.vue'
import ArticleView from '@/views/ArticleView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardLayout from '@/components/Layouts/DashboardLayout.vue'
import PublicLayout from '@/components/Layouts/PublicLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CreateProfileView from '@/views/CreateProfileView.vue'
import UpdateProfileView from '@/views/UpdateProfileView.vue'
import { useAuthStore } from '@/store/auth'
import CategoryView from '@/views/CategoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'article',
          name: 'article',
          component: ArticleView,
        },
        {
          path: 'article/:id',
          name: 'detailArticle',
          component: DetailArticleView,
        },
        {
          path: 'login',
          name: 'login',
          meta: { isPublic: true },
          component: LoginView,
        },
        {
          path: 'register',
          name: 'register',
          meta: { isPublic: true },
          component: RegisterView,
        }
      ]
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { isRequiresAuth: true }, // penanda butuh login
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView
        },
        {
          path: 'profile/create',
          name: 'createProfile',
          component: CreateProfileView 
        },
        {
          path: 'profile/update',
          name: 'updateProfile',
          component: UpdateProfileView 
        },
        {
          path: 'category',
          name: 'category',
          meta: { isAdmin: true },
          component: CategoryView 
        }
      ],
    }
    
  ],
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.isRequiresAuth && !authStore.isAuthenticated) {
    alert('You must be logged in to access this page.')
    //return {path : '/login'} // redirect ke halaman login gak pake next
    next({ name: 'login' }) // redirect ke halaman login pake next
  }
  else if(to.meta.isPublic && authStore.isAuthenticated) {
    alert('You are already logged in.')
    next({ name: 'dashboard' })
  }
  else if(to.meta.isAdmin && authStore.user?.role != 'admin') {
    alert('You do not have permission to access this page.')
    next({ name: 'home' }) // redirect ke halaman home kalau bukan admin
  }
  else {
    next()
  }
  // const auth = JSON.parse(localStorage.getItem('auth') as string|| '{}')
  // const isAuthenticated = !!auth.token // contoh cek token JWT
  // //console.log(localStorage.getItem('auth'))
  // if (to.meta.requiresAuth && !isAuthenticated) {
  //   next({ name: '' }) // redirect ke home kalau belum login
  // } else {
  //   next()
  // }
})
export default router
