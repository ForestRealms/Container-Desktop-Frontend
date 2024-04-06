
import {createRouter, createWebHistory} from 'vue-router'
import InstanceList from "@/views/InstanceList.vue";
import CreateInstance from "@/views/CreateInstance.vue";
import VolumeList from "@/views/VolumeList.vue";
import Overview from "@/views/Overview.vue";
import UserControlPanel from "@/views/UserControlPanel.vue";
import HomePage from "@/views/HomePage.vue";
import UserManagement from "@/views/UserManagement.vue";
import ImageManagement from "@/views/ImageManagement.vue";

const routes = [
    {
        path: '/', name: 'login', component: HomePage
    },
    {
        path: '/control',
        name: 'control-panel',
        component: UserControlPanel,
        children: [
            {
                path: 'overview',
                name: 'overview',
                component: Overview
            },
            {
                path: 'instances',
                name: 'instances',
                component: InstanceList
            },
            {
              path: 'volumes',
              name: 'volumes',
              component: VolumeList
            },
            {
                path: 'create-instance',
                name: 'create-instance',
                component: CreateInstance
            },
            {
                path: 'users',
                name: 'users',
                component: UserManagement
            },
            {
                path: 'images',
                name: 'images',
                component: ImageManagement
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;