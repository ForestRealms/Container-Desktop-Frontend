<script setup>

import Introduction from "@/components/Introduction.vue";
import AuthenticationForm from "@/components/AuthenticationForm.vue";
import axios from "axios";
import router from "@/router/index.js";
const opacity = 0.9
const test = () => {
  const config = {
    method: 'get',
    url: '/test',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  };

  axios(config)
      .then((response) => {
        const condition = response.status === 401 && response.data.message === 'Unauthorized Access'
        if (!condition) {
          console.log("已经登录过了")
          router.push({name: "overview"})
        }
      })
      .catch(() => {

      });
}
test()
</script>

<template>
  <div class="flex-row background-modified">
    <div class="left-column center-top-bottom">
      <Introduction />
    </div>
    <div class="right-column center-top-bottom">
      <AuthenticationForm />
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
  width: 50%; /* 左侧栏宽度 */
  /* 其他样式 */
}

.right-column {
  margin-left: 1rem;
  flex: 1 1 auto; /* 伸缩以填充剩余空间 */
  /* 其他样式 */
}

.center-top-bottom {
  display: flex;
  align-items: center;
  min-height: 100vh;
}

.center-left-right {
  display: flex;
  justify-content: center;
  min-height: 100vh
}

.baseline {
  display: flex;
  align-items: baseline;
  min-height: 100vh
}

.background-modified {
  background: linear-gradient(rgba(255, 255, 255, var(--opacity)),
  rgba(255, 255, 255, var(--opacity))),
  url('../assets/background3.jpg') no-repeat center center fixed;
  //-webkit-background-size: cover;
  //-moz-background-size: cover;
  //-o-background-size: cover;
  background-size: cover;
}

</style>