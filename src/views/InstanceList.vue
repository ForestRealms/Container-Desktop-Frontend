<script setup>
import Button from "primevue/button";
import InstancesListTable from "@/components/InstanceListTable.vue";
import router from "@/router/index.js";
</script>

<template>
  <div>
    <h2>Instance List</h2>
  </div>
  <div style="margin-bottom: 0.7rem">
    <Button label="Create" size="small" icon="pi pi-plus" @click="router.push({name: 'create-instance'})"/>
  </div>
  <div>
    After operating on the instance, <b>clicking refresh button</b>
    in the bottom-right corner is required.
  </div>
  <div>
    <InstancesListTable />
  </div>
</template>

<style scoped>

</style>