<script setup>
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Panel from "primevue/panel";
import Stepper from "primevue/stepper";
import StepperPanel from "primevue/stepperpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {ref} from "vue";
import axios from "axios";
const maxVCPUs = ref(0)
const customName = ref('')
const images = ref([])
const selectedImage = ref({})
const vCPUS = ref(1)
const RAM = ref(1)
const rootDisk = ref(1);
const getMaxVCPUs = () => {
  const config = {
    method: 'get',
    url: '/containers/maxVCPUs',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  };
  axios(config)
      .then((response) => {
        maxVCPUs.value = response.data.details.maxVCPUs
      })
      .catch((error) => {
        console.log(error);
      });
}

getMaxVCPUs()

const getImages = () => {
  const config = {
    method: 'get',
    url: '/images/',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  };

  axios(config)
      .then((response) => {
        images.value = response.data.details
      })
      .catch((error) => {
        console.log(error);
      });
}
getImages()
const volumes = ref([])
const getVolumes = () => {
  const config = {
    method: 'get',
    url: '/volumes/',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
  };
  axios(config)
      .then((response) => {
        volumes.value = response.data.details
      })
      .catch(error => {
        console.log(error);
      });
}
getVolumes()
const mounted_volumes = ref([])
const editingRows = ref([]);
const addVolumeRow = () => {
  mounted_volumes.value.push({
    "id": "",
    "path": ""
  })
  console.log(mounted_volumes.value)
}
const onRowEditSave = (event) => {
  let {newData, index} = event
  mounted_volumes.value[index] = newData
}
const removeMountedVolumes = (index) => {
  mounted_volumes.value.splice(index, 1)
}
</script>

<template>
  <div style="margin-right: 2rem">
    <h2>Create an Instance</h2>
    <Stepper>
      <StepperPanel header="Basic Information">
        <template #content="{ nextCallback }">
          <div class="flex gap" style="align-items: center">
            <div style="width: 8vw">
              <label for="customName" class="inline gap">Name</label>
            </div>
            <InputText id="customName"
                       v-model="customName"
                       placeholder="Name of your Cloud Desktop Instance"
                       style="width: 50vw"></InputText>
          </div>
          <div class="flex gap" style="align-items: center">
            <div style="width: 7.5vw">
              <label class="inline">Image</label>
            </div>
            <Dropdown style="width: 50vw"
                      v-model="selectedImage"
                      :options="images"
                      option-label="name" placeholder="Select an Image"/>
          </div>
          <div class="flex gap" v-if="selectedImage.id">
            <div class="flex" style="justify-content: center">
              <Panel header="Image Information">
                <li class="gap">
                  <i>
                    Image Description:
                  </i>
                  {{selectedImage.description ? selectedImage.description: 'No Description'}}
                </li>
                <li class="gap">
                  <i>
                    Minimum vCPU Count Requirement:
                  </i>
                  {{selectedImage.min_vcpus}}
                </li>
                <li>
                  <i>
                    Minimum RAM Requirement:
                  </i>
                  {{selectedImage.min_ram / 1024}} GB
                </li>
              </Panel>
            </div>
          </div>
          <div class="flex gap" style="align-items: center">
            <div style="width: 8vw">
              <label for="vcpus" class="inline">CPU Count</label>
            </div>
            <InputNumber v-model="vCPUS" inputId="minmax-buttons"
                         mode="decimal" show-buttons :min="selectedImage.min_vcpus" :max="maxVCPUs" />
            <div style="margin-left: var(--inline-spacing)">
              Max: {{maxVCPUs}}
            </div>
          </div>
          <div class="flex gap" style="align-items: center">
            <div style="width: 8vw">
              <label>RAM</label>
            </div>
            <InputNumber v-model="RAM"
                         :min="selectedImage.min_ram / 1024"
                         :maxFractionDigits="2"
                         show-buttons
                         :step="0.25"/>
            <div>
              GB
            </div>
          </div>

          <div class="flex gap" style="align-items: center">
            <div style="width: 8vw">
              <label>Root Disk</label>
            </div>
            <InputNumber v-model="rootDisk"
                         :min="selectedImage.min_root_disk"
                         show-buttons
                         :step="1"/>
            <div>
              GB
            </div>
          </div>
          <div style="display: flex; justify-content: end">
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Mount Data Volumes">
        <template #content="{prevCallback, nextCallback}">
          <div style="margin-bottom: 1.5rem">


            <DataTable edit-mode="row"
                       @row-edit-save="onRowEditSave"
                       v-model:editing-rows="editingRows"
                       :value="mounted_volumes">
              <Column header="Volume ID" field="id">
                <template #body="{data}">
                  {{data.id.substring(0, 12)}}
                </template>
                <template #editor="{data, field}">
                  <Dropdown v-model="data[field]"
                            :options="volumes"
                            option-value="id"
                            option-label="custom_name">
                    <template #option="slotProps">
                      <div>
                        {{slotProps.option.custom_name}}
                      </div>
                      <label style="margin-left: 0.5rem">
                        {{slotProps.option.id.substring(0, 12)}}
                      </label>
                    </template>
                  </Dropdown>
                </template>
              </Column>
              <Column header="Mount Point" field="path">
                <template #editor="{data, field}">
                  <InputText v-model="data[field]"></InputText>
                </template>
              </Column>
              <Column header="Edit" :row-editor="true" headerStyle="width:8rem" bodyStyle="text-align:center" />
              <Column header="Delete">
                <template #body="{index}">
                  <Button size="small" label="Delete" severity="danger" @click="removeMountedVolumes(index)"/>
                </template>
              </Column>

            </DataTable>
            <div style="margin-top: 1rem">
              <Button size="small"
                      severity="success"
                      label="Add Volume"
                      icon="pi pi-plus" @click="addVolumeRow"/>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between">
            <Button severity="secondary" label="Back" icon="pi pi-arrow-left" iconPos="left" @click="prevCallback" />
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Network Configuration">
        <template #content="{prevCallback, nextCallback}">

          <div class="flex" style="justify-content: space-between">
            <Button severity="secondary" label="Back" icon="pi pi-arrow-left" iconPos="left" @click="prevCallback" />
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Confirmation">

      </StepperPanel>
    </Stepper>


  </div>
</template>

<style scoped>
.gap {
  margin-bottom: 1rem;
}
.inline {
  margin-right: var(--inline-spacing)
}
.form-items {
  display: flex;
  flex-direction: row;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}
.p-stepper {
  flex-basis: 50rem;
}
</style