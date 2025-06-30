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

const routes = [
    {
        path: '/',
        redirect: '/main/dashboard',
    },
    {
        path: '/logIn',
        meta: {
            title: '登入'
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
                    title: '頁面不存在'
                },
                component: () => import('@/views/excepts/NotFound.vue'),
            },
            {
                path: '401',
                meta: {
                    title: '權限不足'
                },
                component: () => import('@/views/excepts/NoPermission.vue'),
            },
            {
                path: 'dashboard',
                meta: {
                    title: '儀表板'
                },
                component: () => import('@/views/dashboard/index.vue'),
            },
            {
                path: 'sys/perControl',
                meta: {
                    title: '系統權限',
                    perCodes: ['func-001-0100', 'func-002-0100']
                },
                component: () => import('@/views/sysControl/SysPerControl.vue'),
            },
            {
                path: 'sys/logs',
                meta: {
                    title: '系統日誌',
                    perCodes: ['func-005-0100']
                },
                component: () => import('@/views/sysControl/SysLogs.vue'),
            },
            {
                path: 'sys/subs',
                meta: {
                    title: '訂閱管理',
                    perCodes: ['func-008-0100']
                },
                component: () => import('@/views/sysControl/Subscriptions.vue'),
            },
            {
                path: 'sys/cusServices',
                meta: {
                    title: '客戶服務',
                    perCodes: ['func-009-0100']
                },
                component: () => import('@/views/sysControl/CusServices.vue'),
            },
            {
                path: 'sys/updateCal',
                meta: {
                    title: '日曆更新',
                    perCodes: ['func-006-0100']
                },
                component: () => import('@/views/sysControl/UpdateCal.vue'),
            },
            {
                path: 'sys/notifications',
                meta: {
                    title: '系統公告',
                    perCodes: ['func-007-0100']
                },
                component: () => import('@/views/sysControl/SysNotifications.vue'),
            }
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
    document.title = website + ' | ' + to.meta.title
    NProgress.done()
})

export default router
