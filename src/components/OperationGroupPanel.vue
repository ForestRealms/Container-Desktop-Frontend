<script setup>

import ButtonGroup from "primevue/buttongroup";
import Button from "primevue/button";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import axios from "axios";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";

const confirm = useConfirm()
const toast = useToast()

const params = defineProps({
  // 对象
  selected: {
    type: Array
  }
})
const getPrefix = (s) => {
  if (s === 'ACTIVE') return 'Start'
  if (s === 'POWER_OFF') return 'Stop'
  if (s === 'DELETE') return 'Remove'
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
  for (const instance of params.selected) {
    const config = {
      method: 'put',
      url: '/containers/' + instance.id,
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
          }
        })
        .catch(function (error) {
          console.log(error);
        });
  }

}
const startInstance = () => {
  updateInstance('ACTIVE')
}

const stopInstance = () => {
  updateInstance('POWER_OFF')
}

const removeInstance = () => {
  for (const instance of params.selected) {
    const config = {
      method: 'delete',
      url: '/containers/' + instance.id,
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

}

const confirmInstanceOperation = (status) => {
  confirm.require({
    group: 'update',
    header: 'Confirmation',
    warn: status === 'DELETE',
    message: 'Are you confirm to ' + getPrefix(status).toLowerCase() + ' following instance?',
    ids: params.selected.map(i => i.custom_name),
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Confirm',
    rejectLabel: 'Cancel',
    accept: () => {
      switch (status) {
        case 'ACTIVE': startInstance(); break;
        case 'POWER_OFF': stopInstance(); break;
        case 'DELETE': removeInstance(); break;
      }
    },
    reject: () => {}
  })
}
</script>

<template>
  <div>
    <Toast />
    <ConfirmDialog group="update">
      <template #message="slot">
        <div>
          <div class="gap">
            {{ slot.message.message }}
          </div>
          <div class="gap">
            <li v-for="id in slot.message.ids" class="gap">{{id}}</li>
          </div>
          <div>
            <b v-if="slot.message.warn">This operation is NOT irreversible!</b>
          </div>
        </div>

      </template>
    </ConfirmDialog>
    <ButtonGroup style="margin-left: var(--inline-spacing)">
      <Button :disabled="selected.length === 0" label="Start" severity="success" @click="confirmInstanceOperation('ACTIVE')"></Button>
      <Button :disabled="selected.length === 0" label="Stop" severity="warning" @click="confirmInstanceOperation('POWER_OFF')"></Button>
      <Button :disabled="selected.length === 0" label="Remove" severity="danger" @click="confirmInstanceOperation('DELETE')"></Button>
    </ButtonGroup>
  </div>
</template>

<style scoped>
.gap {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem
}
</style>