<script setup>
import {computed, ref} from "vue";
import PanelMenu from "primevue/panelmenu";
import Button from "primevue/button";
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import {defaultTheme} from "../../public/config.js";
import {usePrimeVue} from "primevue/config";
import {useCssVar} from "@vueuse/core";
const toast = useToast();
const router = useRouter()
const params = defineProps({
  admin: {
    type: Boolean
  }
})
const items = ref([
  {
    label: "Cloud Desktop",
    icon: 'pi pi-desktop',
    items: [
      {
        label: 'Overview',
        icon: 'pi pi-chart-bar',
        command: () => {
          router.push({name: 'overview'})
        }
      },
      {
        label: 'Instance List',
        icon: 'pi pi-server',
        command: () => {
          router.push({name: 'instances'})
        }
      },
      {
        label: 'Volume List',
        icon: "pi pi-database",
        command: () => {
          router.push({name: 'volumes'})
        }
      },
      {
        label: 'Create Instance',
        icon: 'pi pi-plus',
        command: () => {
          router.push({name: 'create-instance'})
        }
      }
    ]
  },
  {
    label: "User Center",
    icon: 'pi pi-user',
    items: [
      {
        label: "Edit Profile",
        icon: 'pi pi-user-edit',
        command: () => {
          router.push({name: 'profile'})
        }
      },
      {
        label: "Sign out",
        icon: 'pi pi-sign-out',
        command: () => {
          signOut()
        }
      }
    ]
  },
  {
    label: "Admin Center",
    visible: params.admin,
    icon: 'pi pi-star',
    items: [
      {
        label: 'Users',
        icon: 'pi pi-user',
        command: () => {
          router.push({name: 'users'})
        }
      },
      {
        label: 'Instances',
        icon: 'pi pi-server',
        command: () => {
          router.push({name: 'instance-management'})
        }
      },
      {
        label: 'Images',
        icon: 'pi pi-th-large',
        command: () => {
          router.push({name: 'images'})
        }
      },
      {
        label: 'Volumes',
        icon: "pi pi-database",
        command: () => {
          router.push({name: 'volumes-management'})
        }
      },
      {
        label: 'Networks',
        icon: 'pi pi-sitemap',
        command: () => {
          router.push({name: 'networks'})
        }
      }

    ]
  }
])

const signOut = () => {
  toast.add({
    severity: 'success',
    summary: 'Notification',
    detail: 'Sign Out Successfully',
    life: 1200
  })
  setTimeout(() => {
    localStorage.removeItem('admin')
    localStorage.removeItem('token')
    router.push({name: 'login'})
  }, 1500)

}

const getIconName = () => {
  const current = localStorage.getItem('theme')
  if (current.includes('light')) {
    localStorage.setItem('theme', defaultTheme)
    return 'pi pi-moon'
  } else {
    return 'pi pi-sun'
  }
}
const themeIcon = ref('')
themeIcon.value = getIconName()

const PrimeVue = usePrimeVue()
const opacity = useCssVar('--opacity')
const changeTheme = () => {
  opacity.value = 1-opacity.value
  const current = localStorage.getItem('theme')
  let next = ''
  if (current.includes('light')) next = current.replace('light', 'dark')
  if (current.includes('dark')) next = current.replace('dark', 'light')
  localStorage.setItem('theme', next)
  PrimeVue.changeTheme(current, next, 'switch', () => {

  });
}
</script>

<template>
  <div>
    <PanelMenu :model="items" multiple />
    <div class="flex" style="justify-content: center">
      <Button label="Sign out"
              rounded
              outlined
              severity="danger"
              @click="signOut"></Button>
      <Button :icon="themeIcon" style="margin-left: var(--inline-spacing)"
              @click="changeTheme(); themeIcon = getIconName()"
              rounded
              text
              outlined severity="secondary"></Button>
    </div>
  </div>
</template>

<style scoped>
</style>