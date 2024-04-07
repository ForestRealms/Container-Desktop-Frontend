<script setup>
import Fieldset from "primevue/fieldset";
import {getComputingResource, getInstanceList, getStorageResource, getVolumeList} from "@/libraries.js";
import {ref} from "vue";
const instanceList = ref([])
const volumeList = ref([])
getInstanceList().then(res => {
  instanceList.value = res
})
getVolumeList().then(res => {
  volumeList.value = res
})
const computingResource = ref({})
getComputingResource().then(res => {
  computingResource.value = res
})
const storageResource = ref(0)
getStorageResource().then(res => {
  storageResource.value = res
})
</script>

<template>
  <h2>Overview</h2>
  <div style="max-height: 100%" class="three-columns">
    <Fieldset toggleable legend="Instances" style="margin-right: 1rem">
      <li v-for="i in instanceList" style="margin-bottom: 0.5rem">{{i.custom_name}}</li>
    </Fieldset>
    <Fieldset toggleable legend="Volumes" style="margin-right: 1rem">
      <li v-for="i in volumeList" style="margin-bottom: 0.5rem">{{i.custom_name}} ({{i.id.substring(0, 6)}}...), {{i.size + " GB"}}</li>
    </Fieldset>
    <Fieldset toggleable legend="Owned Computing Resource">
      <div style="margin-left: 0; margin-bottom: 0.5rem">
        CPU: {{computingResource.cpu}}
      </div>
      <div style="margin-left: 0; margin-bottom: 0.5rem">
        RAM: {{computingResource.ram/1024}} GB
      </div>
      <div style="margin-left: 0">
        Data Volumes Size: {{storageResource}} GB
      </div>
    </Fieldset>
  </div>
</template>

<style scoped>
.three-columns {
  display: grid;
  grid-template-columns: 33% 34% 33%;
}
</style>