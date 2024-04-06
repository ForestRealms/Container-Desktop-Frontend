<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import axios from "axios";
import {ref} from "vue";
import {useToast} from "primevue/usetoast";
import ImageEditPanel from "@/components/ImageEditPanel.vue";
const images = ref([])
const editingRows = ref([]);
const toast = useToast()
const edit_panel = ref(false)
const getData = () => {
  const config = {
    method: 'get',
    url: '/images/',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  };

  axios(config)
      .then(response => {
        images.value = response.data.details
      })
      .catch(error => {
        console.log(error);
      });
}
getData()
const onClickEditButton = (details) => {
  selectedImage.value = details
  edit_panel.value = true
  console.log(selectedImage.value)
}
const selectedImage = ref({})
</script>

<template>
  <Dialog v-model:visible="edit_panel"
          header="Edit Image" modal>
    <ImageEditPanel :remote-desktop-port="selectedImage.remote_desktop_port"
                    :id="selectedImage.id"
                    :min-ram="selectedImage.min_ram"
                    :min-vcpus="selectedImage.min_vcpus"
                    :min-root-disk="selectedImage.min_root_disk"
                    :public0="selectedImage.public"
                    :available="selectedImage.available"
                    :description="selectedImage.description"
                    @updated="edit_panel=false; getData()"
                    @close="edit_panel=false"/>
  </Dialog>
  <div>
    <DataTable :value="images"
               scrollable
               v-model:editing-rows="editingRows">
      <Column header="Name" field="name" style="width: 10%" frozen>
      </Column>
      <Column header="Public" field="public" style="width: 5%">
        <template #body="row">
          <div style="display: flex; justify-content: center">
           <i :class="row.data.public? 'pi pi-check': 'pi pi-times'" />
          </div>
        </template>
      </Column>
      <Column header="Available" field="available" style="width: 5%">>
        <template #body="row">
          <div style="display: flex; justify-content: center">
            <i :class="row.data.available? 'pi pi-check': 'pi pi-times'" />
          </div>
        </template>
      </Column>
<!--      远程桌面端口-->
      <Column header="Port" field="remote_desktop_port" style="width: 5%">>
        <template #body="row">
          {{row.data.remote_desktop_port ? row.data.remote_desktop_port: 'Not Specified'}}
        </template>
      </Column>
      <Column header="Min CPUs" field="min_vcpus" >
      </Column>
      <Column header="Min RAM" field="min_ram">
      </Column>
      <Column header="Min Root Disk" field="min_root_disk">
      </Column>
<!--      镜像描述-->
      <Column header="Description" field="description" style="max-width: 30%">
      </Column>
      <Column header="Action">
        <template #body="row">
          <Button size="small" severity="success" label="Edit" @click="onClickEditButton(row.data)"></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>

</style>