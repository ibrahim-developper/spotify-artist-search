import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { Cookies } from 'quasar'
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })
  Router.beforeEach((to,from,next)=>{
    document.title = to.meta.pageTitle + ' | Spotify';
    if(to.hash){
      //set cookies
      let objParams = urlParams(to.hash);
      let timeExpires = (parseInt(objParams.expires_in) / 60) / 60;
      let options = {
        expires: `${timeExpires}h`
      }
      Cookies.set('access_token', objParams.access_token, options)
    }
    if(!to.meta.requiresAuth){
      next()
    }else{
      //go to next
      if(Cookies.has('access_token')){
        // user can continue
        next()
      }else{
        next('/')
      }
    }

  })

  let urlParams = (hash)=>{
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});

    return paramsSplitUp;
  }
  return Router
})
