<script setup>

import VolumeListTable from "@/components/volume/VolumeListTable.vue";
</script>

<template>
  <h2>All Volumes in System</h2>
  <VolumeListTable :admin="true" />
</template>

<style scoped>

</style>