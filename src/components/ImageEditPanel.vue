<script setup>
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import Button from "primevue/button";
import Toast from "primevue/toast";
import {ref} from "vue";
import {useToast} from "primevue/usetoast";
import axios from "axios";
const emit = defineEmits(['close', 'updated'])
const params = defineProps({
  'id': {
    type: String
  },
  'remoteDesktopPort': {
    type: Number
  },
  'minVcpus': {
    type: Number
  },
  'minRam': {
    type: Number
  },
  'minRootDisk': {
    type: Number
  },
  'public0': {
    type: Boolean
  },
  'available': {
    type: Boolean
  },
  'description': {
    type: String
  }
})
const toast = useToast()
const edit_remote_desktop_port = ref(params.remoteDesktopPort)
const edit_min_vcpus = ref(params.minVcpus)
const edit_min_ram = ref(params.minRam)
const edit_min_root_disk = ref(params.minRootDisk)
const edit_public = ref(params.public0)
const edit_available = ref(params.available)
const edit_description = ref(params.description)
const update = () => {
  if (edit_available.value && (edit_remote_desktop_port.value === undefined || edit_remote_desktop_port.value === null)) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'A mirror without a remote desktop port cannot be set to available!',
      life: 2500
    })
    return
  }
  const data = JSON.stringify({
    "available": edit_available.value,
    "public": edit_public.value,
    "remote_desktop_port": edit_remote_desktop_port.value,
    "description": edit_description.value,
    "min_vcpus": edit_min_vcpus.value,
    "min_ram": edit_min_ram.value,
    "min_root_disk": edit_min_root_disk.value
  });
  const config = {
    method: 'put',
    url: '/admin/images/' + params.id,
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
          detail: 'Image ' + params.id + ' was successfully updated!',
          life: 2500
        })
        emit("updated")
      })
      .catch(error => {
        console.log(error);
      });
}
</script>

<template>
  <Toast />
  <div>
    <div class="gap flex-row">
      <p style="margin-right: 0.5rem; width:100%">Remote Desktop Port: </p>
      <InputNumber v-model="edit_remote_desktop_port"
                   :use-grouping="false" :min="1" :max="65535"/>
    </div>
    <div class="gap flex-row">
      <p style="margin-right: 0.5rem; width:100%">Minimum vCPUs Required: </p>
      <InputNumber v-model="edit_min_vcpus"
                   :use-grouping="false" :min="1"/>
    </div>
    <div class="gap flex-row">
      <p style="margin-right: 0.5rem; width:100%">Minimum RAM Required (MB): </p>
      <InputNumber v-model="edit_min_ram"
                   :use-grouping="false" :min="0" />
    </div>
    <div class="gap flex-row">
      <p style="margin-right: 0.5rem; width:100%">Minimum Root Disk Required (GB): </p>
      <InputNumber v-model="edit_min_root_disk"
                   :use-grouping="false" :min="0" />
    </div>
    <div class="gap flex-row">
      <p style="margin-right: 0.5rem; width:15%">Public: </p>
      <InputSwitch v-model="edit_public"/>
    </div>
    <div class="gap flex-row">
      <p style="margin-right: 0.5rem; width:15%">Available: </p>
      <InputSwitch v-model="edit_available"/>
    </div>
    <div class="gap flex-row">
      <p style="margin-right: 0.5rem; width:20%">Description: </p>
      <InputText style="width: 100%" v-model="edit_description"/>
    </div>
    <div style="display: flex; flex-direction: row-reverse">
      <div>
        <Button label="Update" @click="update"/>
      </div>
      <div>
        <Button label="Close" severity="secondary" @click="emit('close')"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gap {
  margin-bottom: 0.5rem;
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>