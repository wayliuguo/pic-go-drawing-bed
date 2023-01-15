<template>
    <div>
        <!-- {{ $store.state.name }}<br>
        {{ $store.state.age }}<br>
        {{ $store.getters.myAge }}<br>
        <button @click="$store.commit('changeAge', 10)">加10(commit)</button>
        <button @click="$store.dispatch('changeAge', 10)">加10(dispatch)</button>
        <br/>
        a:{{ $store.state.a.age }}<br/>
        a：{{ $store.getters['a/aAge'] }}<br/>
        <button @click="$store.commit('a/changeAge', 50)">a加50（commit）</button>
        <br/>
        c:{{ $store.state.a.c.age }}<br/>
        c：{{ $store.getters['a/c/cAge'] }}<br/>
        <button @click="$store.commit('a/c/changeAge', 50)">c加50（commit）</button> -->
    </div>
</template>

<script>
export default {
    name: 'Store',
    mounted() {
        console.log(this.$store)
    }
}
</script>