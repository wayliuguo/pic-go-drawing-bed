import createRouteMap from "./create-router-map"

export default function createMatcher(routes) {
    // 收集所有的路由路径，收集路径的对应渲染关系
    // pathMap = {'/': '/的记录', '/about':'/about的记录',... }
    let { pathMap } = createRouteMap(routes)
    console.log(pathMap)

    // 这个方法是动态加载路由的方法
    function addRoutes(routes) {
        // 将新增的路由追加到 pathMap 中
        createRouteMap(routes, pathMap)
    }

    // 根据路径找到对应的记录
    function match(path) {
        return pathMap[path]
    }

    return {
        addRoutes,
        match
    }
}