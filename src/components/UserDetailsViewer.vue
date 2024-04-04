<script setup>
import Tag from "primevue/tag";
const params = defineProps({
  username: {
    type: String,
  },
  roles: {
    type: Array
  },
  containerIds: {
    type: Array
  },
  volumeIds: {
    type: Array
  },
})
const getSeverity = (role) => {
  if (role === 'ADMIN') return 'danger'
  if (role === 'USER') return 'success'
}
</script>

<template>
  <div>
    <div class="gap">
      Username: {{params.username}}
    </div>
    <div class="gap">
      Roles:
      <Tag v-for="role in params.roles"
           :value="role"
           :severity="getSeverity(role)"
           style="margin-left: 0.4rem"></Tag>
    </div>
    <div class="gap">
      Containers: {{params.containerIds.length === 0 ? 'No Container': ''}}
      <li v-for="volume in params.containerIds" class="gap">{{volume}}</li>
    </div>
    <div class="gap">
      Volumes:
      <li v-for="volume in params.volumeIds" class="gap">{{volume}}</li>
    </div>
  </div>
</template>

<style scoped>
.gap {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>