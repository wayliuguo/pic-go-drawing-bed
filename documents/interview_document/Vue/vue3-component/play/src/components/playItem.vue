<template>
  <div class="item" :data-index="source.index" :style="{ height: '80px' }">
    <!-- <div class="head" :style="{ color: 'red', fontWeight: 'bold', fontSize: '20px' }"> -->
    <div class="head">
      <span>
        {{ source.index }}
      </span>
      <span>
        {{ source.name }}
      </span>
    </div>
    <!-- <div class="body" :style="{ fontSize: '18px' }"> -->
    <div class="body">
      <span>{{ source.desc }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  source: {
    type: Object,
    default: () => { }
  }
})
</script>