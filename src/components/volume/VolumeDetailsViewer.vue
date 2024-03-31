<script setup>
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import {ref} from "vue";
import axios from "axios";
const params = defineProps({
  name: {
    type: String
  },
  id: {
    type: String
  },
  size: {
    type: Number,
    default: 0
  },
  containerIds: {
    type: Array,
    default: []
  }

})
const containerNames = ref([])
const get = () => {
  containerNames.value = []
  for (const containerId of params.containerIds) {
    const config = {
      method: 'get',
      url: '/containers/' + containerId,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    };

    axios(config)
        .then(function (response) {
          containerNames.value.push(response.data.details.custom_name)
        })
        .catch(function (error) {
          console.log(error);
        });
  }

}
console.log(params.id)
const visible = ref(false)
</script>

<template>
  <div>
    <Dialog v-model:visible="visible" header="Volume Details" modal>
      <div class="gap">
        Name: {{params.name}}
      </div>
      <div class="gap">
        ID: {{params.id}}
      </div>
      <div class="gap">
        Size: {{params.size + " GB"}}
      </div>
      <div class="gap" >
        The following containers are using the volume:
        <div v-for="name in containerNames" class="gap">
          <li>{{name}}</li>
        </div>
      </div>
    </Dialog>
    <Button label="Details"
            size="small"
            severity="secondary"
            @click="visible=!visible; get()"/>
  </div>
</template>

<style scoped>
.gap {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>