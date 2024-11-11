import { useStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const beforeEnter = (to: any, __: any, next: any) => {
    const store = useStore();

    if (store.isLogged) {
        next('/login');
        return;
    }

    const userRole = store.user!.role;
    const adminRoutes = ['/admin'];
    const appRoutes = ['/app'];

    if (adminRoutes.includes(to.path) && userRole !== 'admin') {
        next('/app');
    } else if (appRoutes.includes(to.path) && userRole !== 'app') {
        next('/admin');
    } else {
        next();
    }
}

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: () => import('../pages/login.vue') },
        { path: '/app', beforeEnter, component: () => import('../pages/mobile/index.vue') },
        { path: '/admin', beforeEnter, component: () => import('../pages/admin/index.vue'),
            children: [
                { path: '', component: () => import('../pages/admin/dashboard.vue') },
                { path: 'create-order', component: () => import('../pages/admin/create-order.vue') },
                { path: 'users', component: () => import('../pages/admin/users.vue') },
                { path: 'orders', component: () => import('../pages/admin/orders.vue') },
                { path: 'orders-table', component: () => import('../pages/admin/orders-table.vue') },
                { path: 'foods', component: () => import('../pages/admin/foods.vue') },
            ]
        },
    ]
})