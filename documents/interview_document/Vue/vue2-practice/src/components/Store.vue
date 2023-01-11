<template>
    <div>
        {{ this.$store.state.name }}<br>
        {{ this.$store.state.age }}<br>
        {{ this.$store.getters.myAge }}<br>
        <button @click="$store.state.age++">加1</button>
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