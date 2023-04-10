<script setup lang="ts">
  import { ref } from 'vue';
  const check = ref(true)
  const handleChange = (val:boolean) => {
    console.log(val)
  }
</script>

<template>
  {{ check }}
  <z-checkbox
    :model-value="true"
    :disabled="false"
    :indeterminate="false"
    label="节点"
    @change="handleChange"
  >
  节点2
  </z-checkbox>
</template>