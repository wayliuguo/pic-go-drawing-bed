<template>
  <div id="app">
    <!-- <ClickOutSide /> -->
    <!-- <LazyLoadVue /> -->
    <!-- <Store /> -->
    <router-link to="/">首页</router-link>
    <router-link to="/about">关于页面</router-link>
    <router-view />
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
