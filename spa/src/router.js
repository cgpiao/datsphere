import {createRouter, createWebHistory} from "vue-router";
import Home from "./components/site/Home";
import Site from "@/components/Site";
import Auth from "@/components/site/Auth";
import Dashboard from "@/components/Dashboard";
import Drive from "@/components/drive/Drive";
import Trash from "@/components/drive/Trash";
import ForgotPassword from "@/components/site/ForgotPassword";
import ResetPassword from "@/components/site/ResetPassword";
import Intro from "@/components/site/Intro";
import Token from "@/components/drive/token/Token";
import TokenDetail from "@/components/drive/token/TokenDetail";

let prefix = process.env.VUE_APP_API_PREFIX || ''
const routes = [
    {
        path: '',
        name: 'site',
        component: Site,
        children: [
            {path: '', name: 'home', component: Home},
            {path: '/intro', name: 'intro', component: Intro},
            {path: '/sign-in', name: 'login', component: Auth},
            {path: '/sign-up', name: 'register', component: Auth},
            {path: '/forgot-password', name: 'forgot-password', component: ForgotPassword},
            {path: '/reset-password', name: 'reset-password', component: ResetPassword},
        ]
    },
    {
        path: '/drive',
        name: 'dashboard',
        component: Dashboard,
        children: [
            {path: '', name: 'drive', component: Drive},
            {path: 'trash', name: 'trash', component: Trash},
            {
                path: 'tokens', name: 'tokens', component: Token
            },
            {
                path: 'tokens/new', name: 'token-new', component: TokenDetail
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(prefix),
    routes,
});

router.beforeEach((to, from, next) => {
    // let isAuthenticated = localStorage.getItem(LS_TOKEN)
    // let guestPages = ['login']
    // if (!guestPages.includes(to.name.toString()) && to.name !== 'login' && !isAuthenticated) next({name: 'login'})
    next()
});

export default router

