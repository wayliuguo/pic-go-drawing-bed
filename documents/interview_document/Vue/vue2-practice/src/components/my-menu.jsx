import elMenu from '@/components/el-menu.vue'
import elSubmenu from '@/components/el-submenu.vue'
import elMenuItem from '@/components/el-menu-item.vue'

export default {
    props: {
        data: {}
    },
    components: {
        elMenu,
        elSubmenu,
        elMenuItem,
    },
    render() {
        let renderChildren = (data) => {
            return data.map(child => (
                child.children ?
                <el-submenu>
                    <div slot="title">{child.title}</div>
                    {renderChildren(child.children)}
                </el-submenu> :
                <el-menu-item>{child.title}</el-menu-item>
            ))
        }
        return (
            <el-menu>
                {renderChildren(this.data)}
            </el-menu>
        )
    }
}