<template>
  <z-input
    v-model="userName"
    @blur="handleBlur"
    @focus="handleFocus"
    placeholder="请输入密码"
    :show-password="true"
    :clearable="true"
  >
    <template #prepend>密码</template>
    <template #prefixIcon>
      <z-icon>
        <AddCircle></AddCircle>
      </z-icon>
    </template>
  </z-input>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {  AddCircle } from '@vicons/ionicons5'

const userName = ref<string>('1234')

const handleBlur = (e: Event) => {
  console.log(e, 'blur')
}

const handleFocus = (e: Event) => {
  console.log(e, 'focus')
}

</script>

<style scoped></style>
