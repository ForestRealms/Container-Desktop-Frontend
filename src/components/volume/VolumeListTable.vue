<script setup>
import DataTable from "primevue/datatable";
import Column from 'primevue/column';
import axios from "axios";
import {ref} from "vue";
import VolumeDetailsViewer from "@/components/volume/VolumeDetailsViewer.vue";
const data = ref([])

const getData = () => {
  const config = {
    method: 'get',
    url: '/volumes/',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  };

  axios(config)
      .then(function (response) {
        data.value = response.data.details
      })
      .catch(function (error) {
        console.log(error);
      });
}
getData()

</script>

<template>
  <div>
    <DataTable :value="data">
      <Column field="custom_name" header="Name"></Column>
      <Column field="size" header="Size">
        <template #body="row">
          {{row.data.size + " GB"}}
        </template>
      </Column>
      <Column header="Active Container Instances">
        <template #body="row">
          {{ row.data.container_ids.length }}
        </template>
      </Column>
      <Column field="" header="Operation">
        <template #body="row">
          <VolumeDetailsViewer :name="row.data.custom_name"
                               :size="row.data.size"
                               :id="row.data.id"
                               :container-ids="row.data.container_ids"/>

        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>

</style>