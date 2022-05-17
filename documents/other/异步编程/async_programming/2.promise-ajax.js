function ajax(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.responseType = 'json'
        xhr.onload = function () {
            if (this.status === 200) {
                resolve(this.response)
            } else {
                reject(new Error(this.statusText))
            }
        }
        xhr.send()
    })
}

ajax('a.json').then(function(res) {
    console.log(res)
    return ajax(res.next)
}).then(function(res) {
    console.log(res)
    return ajax(res.next)
}).then(function(res) {
    console.log(res)
})