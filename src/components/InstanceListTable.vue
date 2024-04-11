<script setup>
import axios from "axios";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Button from "primevue/button";
import ButtonGroup from "primevue/buttongroup";
import Dialog from "primevue/dialog";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {ref} from "vue";
import DetailsViewer from "@/components/DetailsViewer.vue";
import OperationPanel from "@/components/OperationPanel.vue";
import OperationGroupPanel from "@/components/OperationGroupPanel.vue";
import {getInstanceList} from "@/libraries.js";

const data = ref([]);
const toast = useToast();
const router = useRouter();
const params = defineProps({
  'admin': {
    type: Boolean,
    default: false
  }
})

const renderText = (text) => {
  if (text === 'POWER_OFF') return "Stopped"
  if (text === 'ACTIVE') return "Running"
  if (text === 'STOPPING') return "Stopping"
  if (text === 'STARTING') return "Starting"
}
const getSeverity = (text) => {
  if (text === 'POWER_OFF') return 'danger'
  if (text === 'ACTIVE') return 'success'
  if (text === 'STOPPING') return 'warning'
  if (text === 'STARTING') return 'warning'
}
getInstanceList(params.admin).then(res => {
  data.value = res
})

let selectedInstance = ref([])
const detail_visible = ref(false)
const details = ref()
const onClickDetailsButton = (details_text) => {
  detail_visible.value = !detail_visible.value
  details.value = details_text
}

const refresh = (notify=true) => {
  getInstanceList(params.admin).then(res => {
    data.value = res
  })
  selectedInstance = ref([])
  if (notify) {
    toast.add({
      detail: "Refresh Successful",
      summary: "Notification",
      life: 2000,
      severity: "success"
    })
  }
}

</script>

<template>
  <div>
    <template>
      <Dialog v-model:visible="detail_visible"
              modal
              :close-on-escape="true"
              :closable="true"
              maximizable
              header="Instance Details">
        <div style="margin-bottom: 1rem">Your Cloud Desktop Instance Details are as follow:</div>
        <div>
          <DetailsViewer :id="details.id"
                         :custom-name="details.custom_name"
                         :ram="details.ram/1024"
                         :root-disk="details.root_disk"
                         :vcpus="details.vcpus"
                         :remote-port="details.port"/>
        </div>
        <div class="flex" style="flex-direction: row-reverse">
          <Button label="Close" @click="detail_visible = false"></Button>
        </div>
      </Dialog>
    </template>

    <DataTable :value="data"
               :scrollable="true"
               scroll-height="65vh"
               striped-rows
               data-key="id"
               v-model:selection="selectedInstance"
               table-style="min-width: 50rem"
               selection-mode="multiple">
<!--      <Column selectionMode="multiple"></Column>-->
      <Column field="custom_name" header="名称"></Column>
      <Column field="owner_id" header="Owner ID" v-if="params.admin">
      </Column>
      <Column field="vcpus" header="CPU" style="width: 10%"></Column>
      <Column field="ram" header="RAM" style="width: 10%">
        <template #body="line">
         {{ line.data.ram / 1024 }} GB
        </template>
      </Column>
      <Column field="root_disk" header="Root Disk" style="width: 15%">
        <template #body="line">
          {{line.data.root_disk}} GB
        </template>
      </Column>
      <Column field="power_status" header="Power Status" style="width: 10%">
        <template #body="line">
          <Tag :value="renderText(line.data.power_status)"
               :severity="getSeverity(line.data.power_status)" />
        </template>
      </Column>
      <Column header="Operation">
        <template #body="line">
          <div class="flex">
            <Button label="Details"
                    size="small"
                    severity="secondary"
                    @click="onClickDetailsButton(line.data)"></Button>
            <OperationPanel :id="line.data.id"
                            :admin="params.admin"
                            :name="line.data.custom_name"
                            :power-status="line.data.power_status"
                            @update="refresh(false)"
                            @remove="refresh(false)"/>
          </div>

        </template>
      </Column>
    </DataTable>
    <div class="flex" style="margin-top: 1.5rem; flex-direction: row-reverse; align-items: center">
      <Button icon="pi pi-refresh"
              style="margin-left: var(--inline-spacing)"
              text
              label="Refresh"
              rounded
              outlined
              severity="help"
              @click="refresh"></Button>
      <OperationGroupPanel :selected="selectedInstance"/>
      <div>
        {{selectedInstance.length === 0? "No": selectedInstance.length}} {{ selectedInstance.length > 1? "instances": "instance" }} selected, operation:
      </div>
      <ButtonGroup style="margin-right: 2rem">
        <Button label="Select All" severity="secondary" @click="selectedInstance=data" />
        <Button label="Select None" severity="secondary" @click="selectedInstance = []" />
      </ButtonGroup>


    </div>
  </div>
</template>

<style scoped>

</style>