<script setup>
import Button from "primevue/button";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import DataTable from "primevue/datatable";
import {ref} from "vue";
import axios from "axios";
import NetworkEditPanel from "@/components/network/NetworkEditPanel.vue";

const networks = ref([])
const getData = () => {
  const config = {
    method: 'get',
    url: '/network/?all=true',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  };

  axios(config)
      .then(response => {
        networks.value = response.data.details
      })
      .catch(error => {
        console.log(error);
      });
}
getData()
const edit_visible = ref(false)
const detail = ref({})
const onClickEditButton = (data) => {
  detail.value = data
  edit_visible.value = true
}

</script>

<template>
  <Dialog header="Edit Network" v-model:visible="edit_visible" modal>
    <NetworkEditPanel :id="detail.id"
                      :name="detail.name"
                      :available="detail.available"
                      :shown="detail.shown"
                      @close="edit_visible = false"
                      @updated="edit_visible=false; getData()"/>
  </Dialog>
  <div>
    <DataTable :value="networks">
      <Column header="ID" field="id">
        <template #body="row">
          {{row.data.id.substring(0, 12)}}
        </template>
      </Column>
      <Column header="Name" field="name">
      </Column>

      <Column header="Address" field="address">
        <template #body="row">
          {{row.data.address ? row.data.address: '-'}}
        </template>
      </Column>
      <Column header="Attachable" field="attachable">
        <template #body="row">
          <div style="display: flex; flex-direction: row; justify-content: center">
            <i :class="row.data.attachable ? 'pi pi-check': 'pi pi-times'"></i>
          </div>
        </template>
      </Column>
      <Column header="Available" field="available">
        <template #body="row">
          <div style="display: flex; flex-direction: row; justify-content: center">
            <i :class="row.data.available ? 'pi pi-check': 'pi pi-times'"></i>
          </div>
        </template>
      </Column>
      <Column header="Shown" field="shown">
        <template #body="row">
          <div style="display: flex; flex-direction: row; justify-content: center">
            <i :class="row.data.shown ? 'pi pi-check': 'pi pi-times'"></i>
          </div>
        </template>
      </Column>
      <Column header="Action">
        <template #body="row">
          <Button severity="success"
                  size="small"
                  label="Edit" @click="onClickEditButton(row.data)"></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>

</style>