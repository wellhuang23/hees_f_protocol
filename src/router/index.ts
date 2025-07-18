import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
    checkLogIn,
    checkPermission
} from '@/utils/permissions'
import { i18n } from '@/lang'
import routerSysItems from '@/router/commons/sysItems.json'
import routerOmsItems from '@/router/commons/omsItems.json'
import { localCache } from '@/utils/storages.ts'
import {USER_INFO, VALID_COM} from '@/global/contstants.ts'

const per0100 = localCache.getCache(USER_INFO)?.per0100 ?? [] as string[]
const comTaxNo = localCache.getCache(VALID_COM)?.currentCom.comTaxNo ?? 'xxxxxxxx'
const modules = import.meta.glob('/src/views/**/**.vue')

function loadRouteItems() {
    let routes = []
    let appendedPath: string[] = []
    // Append Path about System Manage
    for (const item of routerSysItems) {
        for (const perCode of item.meta.perCodes) {
            if (!appendedPath.includes(item.path)) {
                if (per0100.includes(perCode)) {
                    routes.push({
                        path: item.path,
                        meta: {
                            title: item.meta.title,
                            perCodes: item.meta.perCodes,
                        },
                        component: modules[`/src/views/${item.component}.vue`]
                    })

                    appendedPath.push(item.path)
                }
            }
        }
    }
    // Append Path about Organization Manage
    for (const item of routerOmsItems) {
        for (const perCode of item.meta.perCodes) {
            if (!appendedPath.includes(item.path)) {
                if (per0100.includes(perCode.replace('xxxxxxxx', comTaxNo))) {
                    routes.push({
                        path: item.path,
                        meta: {
                            title: item.meta.title,
                            perCodes: item.meta.perCodes,
                        },
                        component: modules[`/src/views/${item.component}.vue`]
                    })

                    appendedPath.push(item.path)
                }
            }
        }
    }
    return routes
}

const dRoutes = loadRouteItems()

const routes = [
    {
        path: '/',
        redirect: '/main/dashboard',
    },
    {
        path: '/logIn',
        meta: {
            title: 'pageTitle.general.logIn'
        },
        component: () => import('@/views/logIn/index.vue')
    },
    {
        path: '/main',
        meta: {
            title: 'HEEs'
        },
        component: () => import('@/views/main.vue'),
        children: [
            {
                path: '404',
                meta: {
                    title: 'pageTitle.general.notExist'
                },
                component: () => import('@/views/excepts/NotFound.vue'),
            },
            {
                path: '401',
                meta: {
                    title: 'pageTitle.general.noPermission'
                },
                component: () => import('@/views/excepts/NoPermission.vue'),
            },
            {
                path: 'dashboard',
                meta: {
                    title: 'pageTitle.general.dashboard'
                },
                component: () => import('@/views/dashboard/index.vue'),
            },
            ...dRoutes
        ]
    },
]

const  router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

// Router Guard
router.beforeEach((to, _from, next) => {
    NProgress.start()
    const logIn = checkLogIn(to)
    if (logIn) {
        checkPermission(to, next)
    } else {
        next({
            path: '/logIn'
        })
    }

})

router.afterEach((to) => {
    const website = 'HEEs'
    const titleKey = to.meta.title as string
    document.title = website + ' | ' + i18n.global.t(titleKey)
    NProgress.done()
})

export default router