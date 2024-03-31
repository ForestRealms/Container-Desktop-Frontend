<script setup>
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import Menu from "@/components/Menu.vue";
import Divider from "primevue/divider";
const router = useRouter();
const toast = useToast();
if (localStorage.getItem('token') === null) {
  toast.add({severity: 'error', summary: '错误', detail: '您尚未登录，正在跳转到登录页面', life: 1000})
  setTimeout(() => {
    router.push("/")
  }, 1200)
}
const admin = localStorage.getItem('admin') === 'true'
</script>

<template>
  <div class="flex-row" style="margin-top: 2.5rem; min-height: 100%">
    <Toast />
    <div class="left-column">
      <Menu :admin="admin"></Menu>
    </div>
    <Divider layout="vertical" />
    <div class="right-column">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
}

.left-column {
  flex: 0 0 auto; /* 不伸缩，保持固定宽度 */
  width: 20%; /* 左侧栏宽度 */
  /* 其他样式 */
}

.right-column {
  margin-left: 0.5rem;
  flex: 1 1 auto; /* 伸缩以填充剩余空间 */
  /* 其他样式 */
}
</style>