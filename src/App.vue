<script setup>
import {usePrimeVue} from "primevue/config";
import {useCssVar} from "@vueuse/core";
import {defaultTheme} from "../public/config.js";
const PrimeVue = usePrimeVue()
console.log(defaultTheme.split('-')[2])
if (localStorage.getItem('theme') === null || localStorage.getItem('theme') === '' || localStorage.getItem('theme').split('-')[2] !== defaultTheme.split('-')[2]) {
  localStorage.setItem('theme', defaultTheme)
}
const current = localStorage.getItem('theme')
const opacity = useCssVar('--opacity')
if (current.includes('dark')) opacity.value = 1 - opacity.value
PrimeVue.changeTheme('aura-light-green', current, 'switch', () => {})
</script>

<template>
  <router-view />
</template>

<style scoped>

</style>
