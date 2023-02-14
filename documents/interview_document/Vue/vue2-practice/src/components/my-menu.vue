<template>
    <el-menu>
        <template v-for="item in data">
            <resub :data="item" :key="item.title"></resub>
        </template>
    </el-menu>
</template>

<script>
import elMenu from '@/components/el-menu.vue'
import resub from '@/components/resub.vue'
export default {
    components: {
        elMenu,
        resub
    },
    props: {
        data: {
            type: Array,
            default: () => {
                return []
            }
        }
    }
}
</script>