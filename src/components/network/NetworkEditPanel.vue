<script setup>
import InputSwitch from "primevue/inputswitch";
import Button from "primevue/button";
import Toast from "primevue/toast";
import {ref} from "vue";
import {useToast} from "primevue/usetoast";
import axios from "axios";
const params = defineProps({
  'id': {
    type: String
  },
  'name': {
    type: String,
  },
  'available': {
    type: Boolean,
  },
  'shown': {
    type: Boolean
  }
})

const emits = defineEmits(['close', 'updated'])
const edit_available = ref(params.available)
const edit_shown = ref(params.shown)
const toast = useToast()

const update = () => {
  const data = JSON.stringify({
    "available": edit_available.value,
    "shown": edit_shown.value
  });

  const config = {
    method: 'put',
    url: '/admin/networks/' + params.id,
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
          detail: 'Network ' + params.id + ' was successfully updated!',
          life: 2500
        })
        emits('updated')
      })
      .catch(error => {
        console.log(error);
      });
}
</script>

<template>
  <Toast />
  <div class="form-items">
    Network Name: {{params.name}}
  </div>
  <div class="form-items">
    Network ID: {{params.id}}
  </div>
  <div class="form-items">
    Available:
    <InputSwitch v-model="edit_available" />
  </div>
  <div class="form-items">
    Shown:
    <InputSwitch v-model="edit_shown" />
  </div>
  <div style="display: flex; flex-direction: row-reverse">
    <Button label="Update" style="margin-left: 0.5rem" @click="update"></Button>
    <Button label="Cancel" severity="secondary" @click="emits('close')"></Button>
  </div>
</template>

<style scoped>
.form-items {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.7rem
}
</style>