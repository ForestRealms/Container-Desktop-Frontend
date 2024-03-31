<script setup>
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import {useToast} from "primevue/usetoast";
import {reactive, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import {usePrimeVue} from "primevue/config";
import {useCssVar} from "@vueuse/core";
import RegisterForm from "@/components/RegisterForm.vue";

const router = useRouter()

const form = reactive({
  username: undefined,
  password: undefined
})

const toast = useToast();

const sendMessage = (type, title, detail) => {
  toast.add({severity: type, closable: false, summary: title, detail: detail, life: 2000})
}
const check = () => {
  if (form.username === undefined) {
    sendMessage('warn', '警告', '请输入用户名')
    return false
  }
  if (form.password === undefined) {
    sendMessage('warn', '警告', '请输入密码')
    return false
  }
  return true
}
const login = (form) => {
  if (!check()) {
    return
  }
  const data = JSON.stringify({
    "username": form.username,
    "password": form.password
  });
  const config = {
    method: 'post',
    url: '/login',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    data : data
  };
  axios(config)
      .then(response => {
        console.log(response)
        localStorage.setItem("token", response.data.details.token)
        localStorage.setItem("admin", response.data.details.admin)
        toast.add({
          severity: "success", summary: "登录成功", life: 2000
        })
        setTimeout(() => {
          router.push({name: 'instances'})
        }, 500)

      }).catch(error => {
        if (error.response.status === 401 || error.response.status === 404) {
          toast.add({
            severity: "error", summary: "错误", detail: "用户名或密码错误", life: 2000
          })
        } else {
          toast.add({
            severity: "error", summary: "错误", detail: error.response, life: 2000
          })
        }

  })
}
const PrimeVue = usePrimeVue()
const opacity = useCssVar('--opacity')
const changeTheme = () => {
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

const register_visible = ref(false)
</script>

<template>
  <div>
    <Dialog v-model:visible="register_visible" header="Register" modal>
      <RegisterForm @cancel="register_visible=false" @done="register_visible=false"/>
    </Dialog>
    <Toast />
    <h3>用户登录或注册</h3>
    <div class="flex-column">
      <div class="gap-1">
        <label for="username" class="gap-1">用户名</label>
        <InputText id="username"
                   style="margin-left: var(--inline-spacing);"
                   placeholder="请输入用户名"
                   v-model="form.username"></InputText>
      </div>
      <div class="gap-1">
        <label for="password" class="gap-1">密码</label>
        <Password id="password"
                  style="margin-left: var(--inline-spacing);"
                  placeholder="请输入密码"
                  :feedback="false"
                  v-model="form.password"></Password>
      </div>
      <div class="gap-1 flex" style="justify-content: center">
        <Button label="Login" @click="login(form)"></Button>
        <Button label="Register" severity="secondary" style="margin-left: var(--inline-spacing);" @click="register_visible = true"></Button>
        <Button label="深浅色模式切换" text @click="changeTheme" style="margin-left: var(--inline-spacing);"></Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gap-1 {
  margin-top: 1rem;
}
</style>