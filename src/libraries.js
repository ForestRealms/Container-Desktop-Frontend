import axios from "axios";
import router from "@/router/index.js";
import {ref} from "vue";

export async function getInstanceList(admin = false)  {
    return new Promise((resolve, reject) => {
        const config = {
            method: 'get',
            url: admin ? '/admin/containers/' : '/containers/',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        };

        axios(config)
            .then(response => {
                resolve(response.data.details);
            })
            .catch(error => {
                if (error.response.status === 401) {
                    toast.add({
                        severity: 'error',
                        summary: '错误',
                        detail: '未登录，现在跳转到登录页面',
                        life: 1000
                    });
                    setTimeout(() => {
                        router.push({ name: 'login' });
                    }, 1500);
                }
                reject(error);
            });
    });
}

export async function getVolumeList(admin = false) {
    return new Promise((resolve, reject) => {
        const base = admin? '/admin/volumes/': '/volumes/'
        const config = {
            method: 'get',
            url: base,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        };

        axios(config)
            .then(function (response) {
                resolve(response.data.details)
            })
            .catch(function (error) {
                reject(error);
            });
    })
}

export async function getComputingResource() {
    try {
        const data = await getInstanceList();
        const result = {
            cpu: 0,
            ram: 0,
        };
        result.cpu = data.reduce((total, datum) => total + datum.vcpus, 0);
        result.ram = data.reduce((total, datum) => total + datum.ram, 0);
        return result;
    } catch (error) {
        console.error("获取计算资源失败：", error);
        throw error;
    }
}

export async function getStorageResource() {
    try {
        const data = await getVolumeList();
        let result = 0
        result = data.reduce((total, datum) => total + datum.size, 0);
        return result;
    } catch (error) {
        console.error("获取存储资源失败：", error);
        throw error;
    }
}

export async function getSystemInfo() {
    return new Promise((resolve, reject) => {
        const config = {
            method: 'get',
            url: '/admin/system/',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        };

        axios(config)
            .then(function (response) {
                resolve(response.data.details)
            })
            .catch(function (error) {
                resolve(error)
            });
    })
}