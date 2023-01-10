<template>
  <div id="app">
    <!-- <ClickOutSide /> -->
    <!-- <LazyLoadVue /> -->
    <Store />
  </div>
</template>

<script>
import ClickOutSide from './components/ClickOutSide.vue'
import LazyLoadVue from './components/LazyLoad.vue';
import Store from './components/Store.vue';

export default {
  name: 'App',
  components: {
    ClickOutSide,
    LazyLoadVue,
    Store
  }
}
</script>

<style>
</style>
