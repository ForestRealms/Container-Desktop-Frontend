<script setup>
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Toast from "primevue/toast";
import {reactive} from "vue";
import {useToast} from "primevue/usetoast";
import axios from "axios";
const form = reactive({
  username: undefined,
  password: undefined,
  password2: undefined
})

const toast = useToast()

const emits = defineEmits(['cancel', 'done'])

const submit = () => {
  if (form.username === undefined || form.username === '') {
    toast.add({
      summary: 'Warning',
      detail: '请输入用户名',
      severity: 'warn',
      life: 1500,
      closable: false
    })
    return
  }
  if (form.password === undefined || form.password === '') {
    toast.add({
      summary: 'Warning',
      detail: '请输入密码',
      severity: 'warn',
      life: 1500,
      closable: false
    })
    return
  }
  if (form.password !== form.password2) {
    toast.add({
      summary: 'Warning',
      detail: '两次输入的密码不一致',
      severity: 'warn',
      life: 1500,
      closable: false
    })
    return
  }

  const data = JSON.stringify({
    "username": form.username,
    "password": form.password
  });

  const config = {
    method: 'post',
    url: '/register',
    data : data,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  axios(config)
      .then((response) => {
        toast.add({
          summary: 'Notification',
          detail: 'Register Successful, please log in using your username and password',
          severity: 'success',
          life: 2000,
          closable: false
        })
        emits('done')
      })
      .catch((error) => {
        if (error.response.status === 409) {
          toast.add({
            summary: 'Error',
            detail: 'Username \"' + form.username + '\" already exists, please pick another one',
            severity: 'error',
            life: 2000,
            closable: false
          })
        }
      });
}
</script>

<template>
  <div class="flex-column">
    <Toast />
    <div class="gap">
      Welcome to Container Cloud Desktop
    </div>
    <div class="gap flex" style="align-items: center">
      <div style="width: 10vw">
        <label class="inline-right">Username</label>
      </div>
      <InputText placeholder="Username" v-model="form.username"></InputText>
    </div>
    <div class="gap flex" style="align-items: center">
      <div style="width: 10vw">
        <label class="inline-right">Password</label>
      </div>
      <Password placeholder="Password" v-model="form.password">
        <template #footer>
          <div class="gap">
            Suggestions:
          </div>
          <ul style="line-height: 1.5">
            <li>At least one lowercase</li>
            <li>At least one uppercase</li>
            <li>At least one numeric</li>
          </ul>
        </template>
      </Password>
    </div>
    <div class="gap">
      <label class="inline-right">Repeat Password</label>
      <Password placeholder="Repeat Password" v-model="form.password2" :feedback="false" />
    </div>
    <div class="flex gap-1" style="justify-content: center">
      <Button label="Register" class="inline-right" @click="submit"></Button>
      <Button label="Cancel" severity="secondary" @click="emits('cancel')"></Button>
    </div>
  </div>
</template>

<style scoped>
.gap {
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.gap-1 {
  margin-top: 1rem;
}
</style>