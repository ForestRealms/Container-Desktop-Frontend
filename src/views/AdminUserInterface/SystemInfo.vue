<script setup>
import {getSystemInfo} from "@/libraries.js";
import {ref} from "vue";
const systemInfo = ref({})
getSystemInfo().then(res => {
  systemInfo.value = res
})
</script>

<template>
  <h2>System Information</h2>
  <div style="line-height: 200%">
    <div>
      Java Version: {{systemInfo["java-version"]}}
    </div>
    <div>
      Java Version Date: {{systemInfo["java-version-date"]}}
    </div>
    <div>
      Java Runtime Version : {{systemInfo["java-runtime-version"]}}
    </div>
    <div>
      Java Vendor Version : {{systemInfo["java-vendor-version"]}}
    </div>
    <div>
      JVM Vendor: {{systemInfo["jvm-vendor"]}}
    </div>
    <div>
      OS Name: {{systemInfo["os-name"]}}
    </div>
    <div>
      OS Version: {{systemInfo["os-version"]}}
    </div>
    <div>
      OS Architecture: {{systemInfo["os-arch"]}}
    </div>
    <div>
      Java Library Path: {{systemInfo["library-path"]}}
    </div>
    <div>
      CPU Count: {{systemInfo["cpu-count"]}}
    </div>
    <div>
      Total Memory Used: {{systemInfo["total-memory"]/(1024**2)}} MB
    </div>
    <div>
      Free Memory: {{systemInfo["free-memory"]/(1024**2)}} MB
    </div>
    <div>
      Max Memory: {{systemInfo["max-memory"]/(1024**2)}} MB
    </div>
  </div>

</template>

<style scoped>

</style>