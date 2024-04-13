<script setup>
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import {ref} from "vue";
import Toast from "primevue/toast";
import InputText from "primevue/inputtext";
import {useToast} from "primevue/usetoast";
import axios from "axios";
import Slider from "primevue/slider";
const create_visible = ref(false);
const custom_name = ref('')
const size = ref(1)
const toast = useToast()
const create = () => {
  if (custom_name.value === '' || custom_name.value.replaceAll(/\s/g, '') === '') {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please specify volume name',
      life: 2500
    })
    return
  }
  if (size.value <= 0) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'The volume size cannot be less than 1GB',
      life: 2500
    })
    return
  }

  const data = JSON.stringify({
    "size": size.value,
    "custom_name": custom_name.value
  });
  const config = {
    method: 'post',
    url: '/volumes/',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
      .then(response => {
        create_visible.value = false;
        toast.add({
          severity: 'success',
          summary: 'Notification',
          detail: 'Volume ' + custom_name.value + ' was successfully created',
          life: 2500
        })
      })
      .catch(error => {

      });

}
</script>

<template>
  <Toast />
  <Dialog v-model:visible="create_visible" header="Create Volume" modal>
    <div class="flex-row">
      <div>Name </div>
      <InputText style="margin-left: 0.5rem; width: 100%" v-model="custom_name"></InputText>
    </div>
    <div class="flex-row" style="margin-top: 0.7rem">
      <div style="margin-right: 0.5rem; width: 20%">Size </div>
      <Slider v-model="size" :min="1" :max="500" style="width: 45%"></Slider>
      <InputText v-model.value="size"
                 style="margin-left: 1rem; margin-right: 0.5rem; width: 20%"/>
      <div>GB</div>
    </div>
    <div class="flex-row-reverse" style="margin-top: 0.7rem">
      <Button label="Create" @click="create"/>
    </div>
  </Dialog>
  <div>
    <Button label="Create" icon="pi pi-plus" size="small" @click="create_visible=true"/>
  </div>
</template>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.flex-row-reverse {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
</style>