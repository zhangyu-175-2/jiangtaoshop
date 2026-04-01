import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useMainStore } from '../stores/main'
import constant from '../utils/constant'
import common from '../utils/common'
import {
  handleTokenExpire,
  isLoggedIn,
  getValidToken,
  clearAuthState,
} from '../utils/tokenExpireHandler'
import {
  ensureSessionValid,
  hasStoredSessionToken,
} from '../utils/sessionValidation'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('../components/index'),
      },
      // {
      //   path: '/sort',
      //   name: 'sort',
      //   component: () => import('../components/sort'),
      // },
      // {
      //   path: '/sort/:id',
      //   name: 'sort-category',
      //   component: () => import('../components/sort'),
      // },
      // {
      //   path: '/article/:lang/:id',
      //   name: 'article-translated',
      //   component: () => import('../components/article'),
      // },
      // {
      //   path: '/article/:id',
      //   name: 'article',
      //   component: () => import('../components/article'),
      // },
      // {
      //   path: '/weiYan',
      //   name: 'weiYan',
      //   component: () => import('../components/weiYan'),
      // },
      // {
      //   path: '/love',
      //   name: 'love',
      //   component: () => import('../components/love'),
      // },
      // {
      //   path: '/favorite',
      //   name: 'favorite',
      //   component: () => import('../components/favorite'),
      // },
      // {
      //   path: '/friends',
      //   name: 'friends',
      //   component: () => import('../components/FriendLinks'),
      // },
      // {
      //   path: '/music',
      //   name: 'music',
      //   component: () => import('../components/Music'),
      // },
      // {
      //   path: '/favorites',
      //   name: 'favorites',
      //   component: () => import('../components/Favorites'),
      // },
      // {
      //   path: '/travel',
      //   name: 'travel',
      //   component: () => import('../components/travel'),
      // },
      // {
      //   path: '/message',
      //   name: 'message',
      //   component: () => import('../components/message'),
      // },
      // {
      //   path: '/about',
      //   name: 'about',
      //   component: () => import('../components/about'),
      // },
      // {
      // {
      //   path: '/oauth-callback',
      //   name: 'oauth-callback',
      //   component: () => import('../components/oauth-callback'),
      // },
      // {
      //   path: '/letter',
      //   name: 'letter',
      //   component: () => import('../components/letter'),
      // },
      // {
      //   path: '/privacy',
      //   name: 'privacy',
      //   component: () => import('../views/Privacy'),
      // },
      // {
      //   path: '/payment-return',
      //   name: 'payment-return',
      //   component: () => import('../components/payment-return'),
      // },
    ],
  },
  // {
  //   path: '/verify',
  //   redirect: (to) => {
  //     const redirect = to.query.redirect
  //     const query = { fromVerify: 'true' }
  //     if (redirect) {
  //       query.redirect = redirect
  //     }
  //     return {
  //       path: '/user',
  //       query: query,
  //     }
  //   },
  // },
  // {
  //   path: '/im',
  //   name: 'im',
  //   meta: { requireAuth: true },
  //   component: () => import('../components/im/index'),
  // },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('../components/Forbidden'),
  },
  {
    path: '/404',
    name: 'notFound',
    component: () => import('../components/NotFound'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'catchAll',
    component: () => import('../components/NotFound'),
  },
]

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory("/jiangtaoshop/"),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return { left: 0, top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  if (to.query.redirect === '403') {
    next('/403')
    return
  }

  // const publicPaths = [
  //   '/user',
  //   '/verify',
  //   '/403',
  //   '/404',
  //   '/',
  //   '/about',
  //   '/privacy',
  //   '/payment-return',
  // ]
  // const isPublicPath =
  //   publicPaths.includes(to.path) ||
  //   to.path.startsWith('/article/') ||
  //   to.path.startsWith('/sort/')

  // // 处理OAuth临时授权码
  // if (to.query.code && to.path === '/') {
  //   await handleOAuthAuthCode(to, from, next)
  //   return
  // }

  // if (
  //   !hasStoredSessionToken() &&
  //   (localStorage.getItem('currentUser') || localStorage.getItem('currentAdmin'))
  // ) {
  //   clearAuthState()
  // }

  // if (hasStoredSessionToken()) {
  //   const sessionValid = await ensureSessionValid({
  //     force: false,
  //     source: from.name ? 'route' : 'boot',
  //     currentPath: to.fullPath,
  //     preferAdmin: to.matched.some((record) => record.meta.isAdmin),
  //   })

  //   if (!sessionValid) {
  //     return
  //   }
  // }

  // if (!isPublicPath) {
  //   const needsAdminAuth = to.matched.some((record) => record.meta.isAdmin)

  //   if (needsAdminAuth) {
  //     const adminToken = getValidToken(true)
  //     const isAdminLoggedIn = isLoggedIn(true)

  //     if (!adminToken || !isAdminLoggedIn) {
  //       handleTokenExpire(true, to.fullPath, { showMessage: false })
  //       return
  //     }
  //   } else {
  //     const needsAuth = to.matched.some((record) => record.meta.requireAuth)

  //     if (needsAuth) {
  //       const userToken = getValidToken(false)
  //       const isUserLoggedIn = isLoggedIn(false)

  //       if (!userToken || !isUserLoggedIn) {
  //         handleTokenExpire(false, to.fullPath, { showMessage: false })
  //         return
  //       }
  //     }
  //   }
  // }
  document.title = 'RiverBillowShop'
  next()
})



/**
 * 处理OAuth临时授权码
 * 使用一次性授权码换取真正的token
 */
// async function handleOAuthAuthCode(to, from, next) {
//   const authCode = to.query.code
//   const baseURL = constant.baseURL

//   try {
//     // 调用后端接口，用授权码换取token
//     const response = await fetch(baseURL + '/oauth/exchange', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: 'code=' + encodeURIComponent(authCode),
//     })

//     if (response.ok) {
//       const result = await response.json()
//       if (result && result.code === 200) {
//         const data = result.data
//         const accessToken = data.accessToken
//         const redirectPath = data.redirectPath || sessionStorage.getItem('oauthRedirectPath') || '/'
//         const emailCollectionNeeded = data.emailCollectionNeeded

//         if (emailCollectionNeeded) {
//           const tempUserData = {
//             needsEmailCollection: true,
//           }

//           // Token由后端通过HttpOnly Cookie下发
//           localStorage.setItem('tempUserData', JSON.stringify(tempUserData))

//           next({
//             path: redirectPath,
//             query: { showEmailCollection: 'true' },
//             replace: true,
//           })
//           return
//         }

//         // 正常登录流程 - Token由后端通过HttpOnly Cookie下发
//         localStorage.removeItem('currentAdmin')
//         localStorage.removeItem('currentUser')

//         // 验证会话获取用户信息
//         const tokenResponse = await fetch(baseURL + '/user/token', {
//           method: 'POST',
//           credentials: 'include',
//         })

//         if (tokenResponse.ok) {
//           const tokenResult = await tokenResponse.json()
//           if (tokenResult && tokenResult.code === 200) {
//             const mainStore = useMainStore()
//             mainStore.loadCurrentUser(tokenResult.data)
//             mainStore.loadCurrentAdmin(tokenResult.data)
//           }
//         }

//         // 清理sessionStorage中的临时数据
//         sessionStorage.removeItem('oauthRedirectPath')

//         next({
//           path: redirectPath,
//           replace: true,
//         })
//         return
//       } else {
//         console.error('OAuth授权码交换失败:', result)
//         next({ path: '/', query: {}, replace: true })
//         return
//       }
//     } else {
//       console.error('OAuth授权码交换HTTP错误:', response.status)
//       next({ path: '/', query: {}, replace: true })
//       return
//     }
//   } catch (error) {
//     console.error('OAuth授权码交换异常:', error)
//     next({ path: '/', query: {}, replace: true })
//     return
//   }
// }

export default router
