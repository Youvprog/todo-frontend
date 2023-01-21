import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TodosView from '../views/TodosView.vue'
import RegisterView from '../views/RegisterView.vue'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/todos',
      name: 'todosview',
      component: TodosView,
      meta: {
        requiredLogin: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    }
  ]
})


router.beforeEach((to, from, next) => {
  const store = useUserStore()
  if(to.meta.requiredLogin  && !store.isAuthenticated) next({ name: 'home' })
  else next()
})


export default router
