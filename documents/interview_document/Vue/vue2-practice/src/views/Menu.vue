<template>
    <div>
        <my-menu :data="tree"></my-menu>
    </div>
</template>

<script>
// import myMenu from '@/components/my-menu.vue'
import myMenu from '@/components/my-menu.jsx'
export default {
    name: 'Menu',
    components: {
        myMenu
    },
    data() {
        return {
            tree: [
                {
                    title: '菜单1',
                    children: [
                        {
                            title: '菜单1-1',
                            children: [
                                {
                                    title: '菜单1-1-1',
                                    children: [
                                    {
                                        title: '菜单1-1-1-1',
                                    }
                                ]
                                },
                                {
                                    title: '菜单1-1-2'
                                },
                            ]
                        }
                    ]
                },
                {
                    title: '菜单2',
                    children: [
                        {
                            title: '菜单2-1'
                        }
                    ]
                },
                {
                    title: '菜单3'
                }
            ]
        }
    }
}
</script>