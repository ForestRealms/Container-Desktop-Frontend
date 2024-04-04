<script setup>

import VolumeListTable from "@/components/volume/VolumeListTable.vue";
import VolumeCreator from "@/components/volume/VolumeCreator.vue";
</script>

<template>
  <div>
    <h2>Volume List</h2>
    <div style="margin-bottom: 0.7rem">
      The resize and remove operations can be performed only
      <b>when the number of containers using the volume is 0</b>
    </div>
    <VolumeCreator />
    <VolumeListTable />
  </div>
</template>

<style scoped>

</style>