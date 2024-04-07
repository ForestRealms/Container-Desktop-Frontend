<script setup>
import {ref} from "vue";
import Button from "primevue/button";
import {application} from "../../public/config.js";
const params = defineProps({
  id: {
    type: String
  },
  customName: {
    type: String
  },
  vcpus: {
    type: Number
  },
  ram: {
    type: Number
  },
  rootDisk: {
    type: Number
  },
  remotePort: {
    type: Number,
    default: 0
  },
  omitLongId: {
    type: Boolean,
    default: true
  }
})
const omit = ref(params.omitLongId)
const id = ref()
const getId = () => {
  console.log(omit.value)
  if (omit.value) {
    id.value = params.id.slice(0, 7) + " ...... " + params.id.slice(params.id.length - 7, params.id.length)
  } else {
    id.value = params.id
  }
}

getId(params.id)

const connect = () => {
  window.open(application.remoteBaseURL + ':' + params.remotePort, '_blank')
}
</script>

<template>
  <div class="flex-column">
    <div class="gap">
      <b>Instance ID</b>: {{id}}
        <Button :label="omit? 'Show Full ID': 'Show Omitted ID'"
                severity="secondary"
                size="small"
                text
                outlined
                @click="omit = !omit; getId()"
                style="margin-left: var(--inline-spacing)"></Button>
    </div>
    <div class="gap">
      <b>Name</b>: {{params.customName}}
    </div>
    <div class="gap">
        <b>Virtual CPU count</b>: {{params.vcpus}}
    </div>
    <div class="gap">
        <b>Memory</b>: {{params.ram + " GB"}}
    </div>
    <div class="gap">
        <b>Root Disk: </b> {{params.rootDisk + " GB"}}
    </div>
    <div class="gap">
      <b>Remote Port: </b> {{params.remotePort}}
    </div>
    <div class="gap" style="display: flex; align-items: center">
      <b>Connect to Desktop: </b>
      <Button label="Connect"
              size="small"
              outlined
              @click="connect"
              style="margin-left: 0.5rem"></Button>
    </div>
  </div>
</template>

<style scoped>
.gap {
  margin-bottom: 0.7rem;
}
</style>