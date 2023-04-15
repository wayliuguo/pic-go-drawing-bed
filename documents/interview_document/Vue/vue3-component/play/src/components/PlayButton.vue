<template>
  <z-button
    size="medium"
    type="danger"
    :round="true"
    :loading="false"
    :disabled="false"
    icon-placement="left"
  > 13246
    <template #icon>
      <z-icon>
        <AddCircle></AddCircle>
      </z-icon>
    </template>
  </z-button>
</template>

<script setup lang="ts">
import {  AddCircle } from '@vicons/ionicons5'
</script>