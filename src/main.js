
import './styles/global.css'
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue'
import ToastService from 'primevue/toastservice';
import router from './router/index'
import 'primeicons/primeicons.css'
import axios from "axios";
import {useCssVar} from "@vueuse/core";
import ConfirmationService from 'primevue/confirmationservice';
import {application} from "../public/config.js";


const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.use(router)
app.config.globalProperties.baseURL = application.baseURL

axios.defaults.baseURL = app.config.globalProperties.baseURL
axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (window.location.pathname === '/') {
            return Promise.reject(error)
        }
        if (error.response.status === 401 && error.response.data.message === 'Unauthorized Access') {
            router.push({name: "login"})
            return Promise.reject(error)
        }
        // if (error.response.status === 403 && error.response.data.message === 'Forbidden') {
        //     router.back();
        //     return Promise.reject(error)
        // }
    }
)
app.mount("#app")



const opacity = useCssVar('--opacity')

export const changeTheme = () => {
    opacity.value = 1-opacity.value
    const current = localStorage.getItem('theme')
    let next = ''
    if (current.includes('light')) next = current.replace('light', 'dark')
    if (current.includes('dark')) next = current.replace('dark', 'light')
    localStorage.setItem('theme', next)
    PrimeVue.changeTheme(current, next, 'switch', () => {
        console.log(111)
    });
}

