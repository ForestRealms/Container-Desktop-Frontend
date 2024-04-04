<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import axios from "axios";
import {ref} from "vue";
import UserDetailsViewer from "@/components/UserDetailsViewer.vue";
const data = ref([])
const details_visible = ref(false);
const getData = () => {
  const config = {
    method: 'get',
    url: '/admin/users/',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  };
  axios(config)
      .then(response => {
        data.value = response.data.details
      })
      .catch(error => {
        console.log(error);
      });
}
getData()
const getSeverity = (role) => {
  if (role === 'ADMIN') return 'danger'
  if (role === 'USER') return 'success'
}
const username = ref('')
const getUsername = () => {
  const config = {
    method: 'get',
    url: '/test',
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
getUsername()
// const detailDa
</script>

<template>
  <div>
    <Dialog v-model:visible="details_visible" header="User Details" modal>
      <UserDetailsViewer :username="detailData.username"
                         :roles="detailData.roles"
                         :container-ids="detailData.container_ids"
                         :volume-ids="detailData.volume_ids"/>
    </Dialog>
    <h2>Users</h2>
    <DataTable :value="data">
      <Column field="id" header="ID"></Column>
      <Column field="username" header="Username"></Column>
      <Column header="Roles">
        <template #body="line">
          <div>
            <Tag v-for="role in line.data.roles"
                 :value="role"
                 :severity="getSeverity(role)"
                 style="margin-left: 0.3rem"></Tag>
          </div>
        </template>
      </Column>
      <Column header="Containers">
        <template #body="line">
          {{line.data.container_ids.length}}
        </template>
      </Column>
      <Column header="Data Volumes">
        <template #body="line">
          {{line.data.owned_volume_ids.length}}
        </template>
      </Column>
      <Column header="Operation">
        <template #body="line">
          <Button label="Details"
                  size="small"
                  severity="secondary"
                  @click="details_visible = true; detailData = line.data"></Button>
          <Button label="Delete"
                  size="small"
                  severity="danger"
                  :disabled="username === line.data.username" style="margin-left: 0.4rem"></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>

</style>