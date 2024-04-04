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
import Password from "primevue/password";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import {ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
const toast = useToast()
const maxVCPUs = ref(0)
const customName = ref('')
const images = ref([])
const selectedImage = ref({})
const vCPUS = ref(1)
const RAM = ref(1)
const rootDisk = ref(1);
const connectedNetwork = ref('')
const password = ref('')
const password2 = ref('')
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
const networks = ref([])
const getNetworks = () => {
  const config = {
    method: 'get',
    url: '/network/',
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
getNetworks()
const mounted_volumes = ref([])
const editingRows = ref([]);
const addVolumeRow = () => {
  if (volumes.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'You owned no volume',
      life: 2500
    })
    return
  }
  mounted_volumes.value.push({
    "id": volumes.value[0].id,
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

const next = {
  "step1": () => {
    if (customName.value.replaceAll(/\s/g, '') === '') {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Specify Instance Name',
        life: 2500
      })
      return false
    }
    if (Object.keys(selectedImage.value).length === 0) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Specify Image',
        life: 2500
      })
      return false
    }
    if (password.value === '' || password2.value === '') {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Specify the password!',
        life: 2500
      })
      return false
    }
    if (password.value !== password2.value) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The two passwords are different',
        life: 2500
      })
      return false
    }
    return true
  },
  "step2": () => {
    for (const mountedVolume of mounted_volumes.value) {
      if (mountedVolume.path.replaceAll(/\s/g, '') === '') {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please Specify the mount point of volume ' + mountedVolume.id,
          life: 2500
        })
        return false
      }
    }
    return true
  }
}

const create = () => {
  const data = JSON.stringify({
    "vcpus": vCPUS.value,
    "ram": RAM.value*1024,
    "root_disk": rootDisk.value,
    "image_id": selectedImage.value.id,
    "network_id": connectedNetwork.value.id,
    "volumes": mounted_volumes.value,
    "custom_name": customName.value,
    "env": {
      "VNC_PASSWD": password.value
    }
  });
  console.log("创建！")
  const config = {
    method: 'post',
    url: '/containers/',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
      .then(response => {
        start_button_disabled.value = true
        toast.add({
          severity: 'success',
          summary: 'Notification',
          detail: 'Instance ' + response.data.details.custom_name + ' was successfully created!',
          life: 2500
        })
        setInterval(() => {
          router.push({name: 'instances'})
        }, 1000)

      })
      .catch(error => {
        console.log(error);
        start_button_disabled.value = false
      });

}
const start_button_disabled = ref(false)
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
                       :invalid="customName.replaceAll(/\s/g, '') === ''"
                       placeholder="Name of your Cloud Desktop Instance"
                       style="width: 50vw"></InputText>
          </div>
          <div class="flex gap" style="align-items: center">
            <div style="width: 7.5vw">
              <label class="inline">Image</label>
            </div>
            <Dropdown style="width: 50vw"
                      :invalid="Object.keys(selectedImage).length === 0"
                      v-model="selectedImage"
                      :options="images.filter(image => image.available)"
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
          <div style="display: flex; align-items: center" class="gap">
            <div>
              <label>Instance Password</label>
            </div>
            <Password v-model="password" :feedback="false"/>
          </div>
          <div style="display: flex; align-items: center" class="gap">
            <div>
              <label>Repeat Instance Password</label>
            </div>
            <Password v-model="password2" :feedback="false" :invalid="password2 !== password"/>
          </div>

          <div style="display: flex; justify-content: end">
            <Button label="Next"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    @click="next.step1() && nextCallback($event)" />
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
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="next.step2() && nextCallback($event)" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Network Configuration">
        <template #content="{prevCallback, nextCallback}">
          <div class="flex-row" style="margin-bottom: 0.7rem; align-items: center">
            <div>
              Connect to Network
            </div>
            <Dropdown :options="networks"
                      option-label="name"
                      placeholder="Select a network to connect"
                      v-model="connectedNetwork"/>
          </div>
          <div class="flex" style="justify-content: space-between">
            <Button severity="secondary" label="Back" icon="pi pi-arrow-left" iconPos="left" @click="prevCallback" />
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Confirmation">
        <template #content="{prevCallback}">
          <div class="flex-row" style="align-items: center; margin-bottom: 0.7rem">
            <div style="margin-right: 0.5rem">Instance Name:</div>
            <div>{{customName}}</div>
          </div>
          <div class="flex-row" style="align-items: center; margin-bottom: 0.7rem" >
            <div style="margin-right: 0.5rem">Image:</div>
            <div>{{selectedImage.name}}</div>
          </div>
          <div class="flex-row" style="align-items: center; margin-bottom: 0.7rem">
            <div style="margin-right: 0.5rem">CPU Count:</div>
            <div>{{vCPUS}}</div>
          </div>
          <div class="flex-row" style="align-items: center; margin-bottom: 0.7rem">
            <div style="margin-right: 0.5rem">RAM:</div>
            <div>{{RAM}} GB</div>
          </div>
          <div class="flex-row" style="align-items: center; margin-bottom: 0.7rem">
            <div style="margin-right: 0.5rem">Root Disk:</div>
            <div>{{rootDisk}} GB</div>
          </div>
          <div class="flex-row" style="align-items: center; margin-bottom: 0.7rem">
            <div style="margin-right: 0.7rem">
              Mounted Volumes: {{mounted_volumes.length === 0? 'No Mounted Volume': ''}}
            </div>
            <DataTable :value="mounted_volumes" style="width: 100%" v-if="mounted_volumes.length !== 0">
              <Column field="id" header="ID">
                <template #body="row">
                  {{row.data.id.substring(0, 12)}}
                </template>
              </Column>
              <Column field="path" header="Mount Point"></Column>
            </DataTable>
          </div>
          <div class="flex-row" style="align-items: center; margin-bottom: 0.7rem">
            <div style="margin-right: 0.7rem">
              Connected Network:
            </div>
            <div>
              {{connectedNetwork.name}}
            </div>
          </div>
          <div class="flex" style="justify-content: space-between">
            <Button severity="secondary" label="Back" icon="pi pi-arrow-left" iconPos="left" @click="prevCallback" />
            <Button label="Start Now"
                    icon="pi pi-arrow-right"
                    icon-pos="right"
                    severity="success"
                    :disabled="start_button_disabled"
                    @click="create" />
          </div>
        </template>

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
.flex-row {
  display: flex;
  flex-direction: row
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
</style>