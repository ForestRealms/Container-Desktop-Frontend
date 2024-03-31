<script setup>
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Panel from "primevue/panel";
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
</script>

<template>
  <div>
    <h2>Create an Instance</h2>
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
                   step="0.25"/>
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
                   step="1"/>
      <div>
        GB
      </div>
    </div>
    <div class="flex" style="flex-direction: row-reverse">
      <Button @click="" label="Start Now"></Button>
    </div>


  </div>
</template>

<style scoped>
.gap {
  margin-bottom: 1rem;
}
.inline {
  margin-right: var(--inline-spacing)
}
</style>