import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/task1',
        name: 'task1',
        component: () => import( /* webpackChunkName: "about" */ '../views/TaskOneView.vue' ),
    },
    {
        path: '/task2',
        name: 'task2',
        component: () => import( /* webpackChunkName: "about" */ '../views/TaskTwoView.vue' ),
    },
];

const router = createRouter( {
    history: createWebHistory(),
    routes,
} );

export default router;
