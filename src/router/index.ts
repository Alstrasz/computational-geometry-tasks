import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

export const known_routes: {[key:string]: string} = {
    home: '/',
    task1: '/task1',
    task2: '/task2',
    task3: '/task3',
    task4: '/task4',
    task5: '/task5',
    task6: '/task6',
};

// eslint-disable-next-line guard-for-in
for ( const prop in known_routes ) {
    let left = __webpack_public_path__ || '/';
    const right = known_routes[prop];
    if ( left[0] != '/' ) {
        left = '/' + left;
    }
    if ( left[left.length - 1] == '/' && right[0] != '/' ) {
        known_routes[prop] = left + right;
    } else if ( left[left.length - 1] != '/' && right[0] == '/' ) {
        known_routes[prop] = left + right;
    } else if ( left[left.length - 1] != '/' && right[0] != '/' ) {
        known_routes[prop] = left + '/' + right;
    } else {
        known_routes[prop] = left + right.substring( 1 );
    }
}

console.log( known_routes );

const routes: Array<RouteRecordRaw> = [
    {
        path: known_routes.home,
        name: 'home',
        component: HomeView,
    },
    {
        path: known_routes.task1,
        name: 'task1',
        component: () => import( /* webpackChunkName: "about" */ '../views/TaskOneView.vue' ),
    },
    {
        path: known_routes.task2,
        name: 'task2',
        component: () => import( /* webpackChunkName: "about" */ '../views/TaskTwoView.vue' ),
    },
    {
        path: known_routes.task3,
        name: 'task3',
        component: () => import( /* webpackChunkName: "about" */ '../views/TaskThreeView.vue' ),
    },
    {
        path: known_routes.task4,
        name: 'task4',
        component: () => import( /* webpackChunkName: "about" */ '../views/TaskFourView.vue' ),
    },
    {
        path: known_routes.task5,
        name: 'task5',
        component: () => import( /* webpackChunkName: "about" */ '../views/TaskFiveView.vue' ),
    },
    {
        path: known_routes.task6,
        name: 'task6',
        component: () => import( /* webpackChunkName: "about" */ '../views/TaskSixView.vue' ),
    },
];

const router = createRouter( {
    history: createWebHistory(),
    routes,
} );

export default router;
