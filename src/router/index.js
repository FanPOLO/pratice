import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/LoginAccount',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginAccount.vue'),
  },
  {
    path: '/DashBoard',
    name: 'DashBoard',
    component: () => import(/* webpackChunkName: "about" */ '../views/DashBoard.vue'),
    children: [{
      path: 'ProductS',
      component: () => import(/* webpackChunkName: "about" */ '../views/ProductS.vue'),
    },
    {
      path: 'cupon',
      component: () => import(/* webpackChunkName: "about" */ '../views/cupon.vue'),
    },
    {
      path: 'Order',
      component: () => import(/* webpackChunkName: "about" */ '../views/Order.vue'),
    },
    ],
  },
  {
    path: '/user',
    component: () => import('../views/Userboard.vue'),
    children: [
      {
        path: 'cart',
        component: () => import('../views/UserCart.vue'),
      },
      {
        path: 'product/:productId',
        component: () => import('../views/UserProduct.vue'),
      },
      {
        path: 'checkout/:orderId',
        component: () => import('../views/UserCheckout.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
