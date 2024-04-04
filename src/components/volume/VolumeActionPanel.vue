<script setup>
import Button from "primevue/button";
import ButtonGroup from "primevue/buttongroup";
import Dialog from "primevue/dialog";
import Slider from "primevue/slider";
import InputText from "primevue/inputtext";
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import Toast from "primevue/toast";
import {ref} from "vue";
import axios from "axios";
const toast = useToast();
const confirm = useConfirm();
const params = defineProps({
  'id': {
    type: String
  },
  'size': {
    type: Number
  }
})
const resizeDialog = ref(false)
const newSize = ref(params.size)
const resize = () => {
  const data = JSON.stringify({
    "size": newSize.value
  });
  const config = {
    method: 'put',
    url: '/volumes/' + params.id,
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
          detail: 'Volume ' + params.id + ' was successfully resized!',
          life: 2500
        })
      })
      .catch(error => {
        console.log(error);
      });
}

const remove = () => {
  const config = {
    method: 'delete',
    url: '/volumes/' + params.id,
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  };
  axios(config)
      .then(response => {
        toast.add({
          severity: 'success',
          summary: 'Notification',
          detail: 'Volume ' + params.id + ' was successfully removed!',
          life: 2500
        })
      })
      .catch(error => {
        console.log(error);
      });
}


const confirm_remove = () => {
  confirm.require({
    group: 'delete',
    message: 'Do you want to remove this volume?',
    header: 'Remove Volume',
    // icon: 'pi pi-info-circle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    // acceptClass: 'p-button-danger',
    rejectLabel: 'Cancel',
    acceptLabel: 'Remove',
    accept: remove,
    reject: () => {

    }
  });
};
</script>

<template>
  <Toast />
  <ConfirmDialog group="delete" />
  <Dialog header="Resize Volume" v-model:visible="resizeDialog" modal>
    <div style="margin-top: 0.7rem">
      ID: {{params.id}}
    </div>
    <div style="margin-top: 0.7rem">
      Current Size: {{ params.size }} GB
    </div>
    <div class="flex" style="margin-top: 0.7rem">
        New Size:
    </div>
    <div class="flex-row" style="margin-top: 0.7rem">
      <Slider v-model="newSize" :min="params.size" :max="500" style="width: 100%"></Slider>
      <InputText v-model.value="newSize"
                 style="margin-left: 1rem; margin-right: 0.5rem; width: 15%"/>
      GB
    </div>
    <div style="margin-top: 0.7rem">
      <b>
        Note: The size of the new data volume cannot be smaller than the original one.
      </b>
    </div>
    <div class="flex" style="flex-direction: row-reverse; margin-top:0.7rem">
      <Button severity="secondary" label="Close" @click="resizeDialog=false" style="margin-left: 0.5rem"/>
      <Button label="Resize" @click="resize"/>
    </div>

  </Dialog>
  <div>
    <ButtonGroup>
      <Button label="Resize"
              size="small"
              severity="success"
              @click="resizeDialog=true"/>
      <Button label="Remove" size="small" severity="danger" @click="confirm_remove"/>
    </ButtonGroup>

  </div>
</template>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>