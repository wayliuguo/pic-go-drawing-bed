<template>
    <div>
        This is About page
        <div>
            <router-link to="/about/a">about - a</router-link>
            <router-link to="/about/b">about - b</router-link>
        </div>
        <router-view />
    </div>
</template>

<script>
import { fetchTodos } from '@/api/index'
export default {
    mounted() {
        fetchTodos().then(res => {
            console.log('tokens:',this.$store?.state?.token?.tokens?.length)
        })
    }
}
</script>