<template>
  <div id="app">
    <!-- <ClickOutSide /> -->
    <LazyLoadVue />
  </div>
</template>

<script>
import ClickOutSide from './components/ClickOutSide.vue'
import LazyLoadVue from './components/LazyLoad.vue';

export default {
  name: 'App',
  components: {
    ClickOutSide,
    LazyLoadVue
  }
}
</script>

<style>
</style>
