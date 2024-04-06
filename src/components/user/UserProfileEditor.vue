<script setup>
import axios from "axios";
import Password from "primevue/password";
import Button from "primevue/button";
import Toast from "primevue/toast";
import {useToast} from "primevue/usetoast";
import {ref} from "vue";
import router from "@/router/index.js";

const username = ref('')
const password = ref('')
const password2 = ref('')
const toast = useToast()
const getData = () => {
  const config = {
    method: 'get',
    url: '/users',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  };

  axios(config)
      .then(response => {
        username.value = response.data.details.username
      })
      .catch(error => {
        console.log(error);
      });
}
getData()

const update = () => {
  if (password.value === '') {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please set your password',
      life: 2500
    })
    return;
  }
  if (password.value !== password2.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'The two passwords are different',
      life: 2500
    })
    return;
  }

  const data = JSON.stringify({
    "password": password.value
  });
  const config = {
    method: 'put',
    url: '/users',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
      .then(response => {
        toast.add({
          severity: 'success',
          summary: 'Notification',
          detail: 'Password Changed!',
          life: 2500
        })
        toast.add({
          severity: 'warn',
          summary: 'Warn',
          detail: '登录已过期，请重新登录！',
          life: 2500
        })
        localStorage.removeItem('token')
        setInterval(() => {
          getData()
        }, 1000)
      })
      .catch(error => {
        console.log(error);
      });
}
</script>

<template>
  <Toast />
  <div class="form-items form">
    Username:
    <div>
      {{username}}
    </div>
    <div style="color: var(--highlight-text-color)">Username is <b>unmodifiable</b></div>
  </div>
  <div class="form-items form">
    Change Password:
    <div style="margin-left: 0">
      <Password placeholder="New Password"
                :feedback="false"
                toggle-mask
                v-model="password"/>
    </div>

  </div>
  <div class="form-items form">
    Repeat Password:
    <div style="margin-left: 0">
      <Password placeholder="Repeat Password"
                :feedback="false"
                v-model="password2"
                toggle-mask
                :invalid="password2 !== password"/>
    </div>
    <div>
      {{password2 === password? '': 'The two passwords are different'}}
    </div>
  </div>
  <div class="flex-row-reverse" style="margin-top: 1rem; margin-right: 1rem">
    <Button label="Save" style="margin-left: 0.5rem" @click="update"/>
    <Button label="Back" severity="secondary" @click="router.back()"/>
  </div>
</template>

<style scoped>
.form {
  display: grid;
  grid-template-columns: 20% 40% 40%;
}
.form-items {
  margin-top: 0.7rem;
  align-items: center;
}
.flex-row-reverse {
  display: flex;
  flex-direction: row-reverse;
}
</style>