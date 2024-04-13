
import {createRouter, createWebHistory} from 'vue-router'
import InstanceList from "@/views/InstanceList.vue";
import CreateInstance from "@/views/CreateInstance.vue";
import VolumeList from "@/views/VolumeList.vue";
import Overview from "@/views/Overview.vue";
import UserControlPanel from "@/views/UserControlPanel.vue";
import HomePage from "@/views/HomePage.vue";
import UserManagement from "@/views/AdminUserInterface/UserManagement.vue";
import ImageManagement from "@/views/AdminUserInterface/ImageManagement.vue";
import NetworkManagement from "@/views/AdminUserInterface/NetworkManagement.vue";
import UserProfile from "@/views/UserProfile.vue";
import InstanceManagement from "@/views/AdminUserInterface/InstanceManagement.vue";
import VolumeManagement from "@/views/AdminUserInterface/VolumeManagement.vue";
import SystemInfo from "@/views/AdminUserInterface/SystemInfo.vue";

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
            },
            {
                path: 'networks',
                name: 'networks',
                component: NetworkManagement
            },
            {
                path: 'profile',
                name: 'profile',
                component: UserProfile
            },
            {
                path: 'instance-management',
                name: 'instance-management',
                component: InstanceManagement
            },
            {
                path: 'volume-management',
                name: 'volume-management',
                component: VolumeManagement
            },
            {
                path: 'system-info',
                name: 'system-info',
                component: SystemInfo
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;