<script setup>
import Button from "primevue/button";
import ButtonGroup from "primevue/buttongroup";
import ConfirmDialog from "primevue/confirmdialog";
import axios from "axios";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";

const toast = useToast()
const confirm = useConfirm()
const params = defineProps({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  powerStatus: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update', 'remove'])
const getPrefix = (s) => {
  return s === 'ACTIVE'? 'Start': 'Stop'
}

/**
 * 更新实例状态
 * @param status 状态，只能为ACTIVE（运行中）或POWER_OFF（关机）
 * @param notify 是否需要提示
 */
const updateInstance = (status, notify=true) => {
  const data = JSON.stringify({
    "power_status": status
  });
  const base = params.admin? '/containers/': '/admin/containers/'
  const config = {
    method: 'put',
    url: base + params.id,
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
      .then(function (response) {
        if (notify) {
          toast.add({
            summary: 'Notification',
            detail: getPrefix(status) + ' Instance Successfully',
            severity: "success",
            life: 2000
          })
          emits('update')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
}
const startInstance = () => {
  updateInstance('ACTIVE')
}

const stopInstance = () => {
  updateInstance('POWER_OFF')
}

const removeInstance = () => {
  const base = params.admin? '/containers/': '/admin/containers/'
  const config = {
    method: 'delete',
    url: base + params.id,
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  };

  axios(config)
      .then((response) => {
        toast.add({
          summary: 'Notification',
          detail: 'Removed Instance Successfully',
          severity: "success",
          life: 2000
        })
        emits('remove')
      })
      .catch(function (error) {
        toast.add({
          summary: 'Error',
          detail: error.response,
          severity: "error",
          life: 2000
        })
      });
}

const confirmRemoveInstance = () => {
  confirm.require({
    group: 'delete',
    header: 'Confirmation',
    message: 'Are you confirm to remove instance ' + params.name + ' ?',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Confirm',
    rejectLabel: 'Cancel',
    accept: () => {
      removeInstance()
    },
    reject: () => {}
  })
}


</script>

<template>
  <div>
    <ConfirmDialog group="delete">
      <template #message="slot">
        <div>
          <div class="gap">
            {{ slot.message.message }}
          </div>
          <div>
            <b>This operation is NOT irreversible!</b>
          </div>
        </div>
      </template>
    </ConfirmDialog>
    <ButtonGroup>
      <Button size="small" text severity="success" label="Start"
              :disabled="params.powerStatus === 'ACTIVE'"
              :outlined="params.powerStatus === 'POWER_OFF'"
              @click="startInstance"/>
      <Button size="small" text severity="warning" label="Stop"
              :disabled="params.powerStatus === 'POWER_OFF'"
              :outlined="params.powerStatus === 'ACTIVE'"
              @click="stopInstance"/>
      <Button size="small" text severity="danger" label="Remove" outlined
              @click="confirmRemoveInstance"/>
    </ButtonGroup>

  </div>
</template>

<style scoped>
.gap {
  margin-bottom: 0.5rem
}
</style>