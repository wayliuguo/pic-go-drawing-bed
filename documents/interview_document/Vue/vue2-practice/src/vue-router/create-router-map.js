export default function createRouteMap(routes, oldPathMap) {
    // 当第一次加载的时候没有 pathMap
    let pathMap = oldPathMap || Object.create(null)
    // 遍历路由配置
    routes.forEach(route => {
        // 添加到路由记录
        addRouteRecord(route, pathMap)
    });
    return {
        pathMap
    }
}

function addRouteRecord (route, pathMap, parent) {
    // 如果是子路由记录，需要增加前缀
    let path = parent ? `${parent.path}/${route.path}` : route.path
    // 需要提取的信息
    let record = {
        path,
        component: route.component,
        parent
    }
    if (!pathMap[path]) {
        pathMap[path] = record
    }
    // 递归添加子路由
    if (route.children) {
        route.children.forEach(childRoute => {
            // 这里需要标记父亲是谁
            addRouteRecord(childRoute, pathMap, route)
        })
    }
}