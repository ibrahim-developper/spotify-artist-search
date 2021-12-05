
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
         component: () => import('pages/Login.vue'),
         meta:{
          pageTitle:'Login'
        }
      },
      {
        path: 'search',
        component: () => import('pages/Search.vue'),
        meta:{
          requiresAuth:true,
          pageTitle:'Search'
        }
      },
      {
        path: 'albums/:id/:name',
        component: () => import('pages/Albums.vue'),
        meta:{
          requiresAuth:true,
          pageTitle:'Albums'
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
    meta:{
      pageTitle:'Not Found'
    }
  }
]

export default routes
