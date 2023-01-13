<template>
    <div>
        {{ this.$store.state.name }}<br>
        {{ this.$store.state.age }}<br>
        {{ this.$store.getters.myAge }}<br>
        <button @click="$store.commit('changeAge', 10)">加10(commit)</button>
        <button @click="$store.dispatch('changeAge', 10)">加10(dispatch)</button>
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