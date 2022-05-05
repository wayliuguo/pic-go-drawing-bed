const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const md5 = require('md5');

app.get('/', (req, res) => {
	res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <title>Document</title>
  </head>
  <body>
      Http Cache Demo
      <script src="/demo.js"></script>
  </body>
  </html>`)
})


// Expires
/* app.get('/demo.js', (req, res) => {
	let jsPath = path.resolve(__dirname, './static/js/demo.js');
	let cont = fs.readFileSync(jsPath);
	res.setHeader('Expires', getGLNZ()) //1分钟
	res.end(cont)
})
function getGLNZ() {
	return moment().utc().add(1, 'm').format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT';
} */

// Cache-Control
/* app.get('/demo.js', (req, res) => {
	let jsPath = path.resolve(__dirname, './static/js/demo.js');
	let cont = fs.readFileSync(jsPath);
	res.setHeader('Cache-Control', 'public,max-age=60') //1分钟
	res.end(cont)
}) */

// Last-Modified和If-Modified-Since
/* app.get('/demo.js', (req, res) => {
	let jsPath = path.resolve(__dirname, './static/js/demo.js')
	let cont = fs.readFileSync(jsPath);
	let status = fs.statSync(jsPath)

	let lastModified = status.mtime.toUTCString() // 指示最后一次修改此文件的时间戳
	// 如果上次修改时间没有改变 —— 走缓存
	if (lastModified === req.headers['if-modified-since']) {
		res.writeHead(304, 'Not Modified')
		res.end()
	} else { // 更新上次修改时间
		res.setHeader('Cache-Control', 'public,max-age=5')
		res.setHeader('Last-Modified', lastModified)
		res.writeHead(200, 'OK')
		res.end(cont)
	}
}) */

// ETag和If-None-Match
app.get('/demo.js',(req, res)=>{
    let jsPath = path.resolve(__dirname,'./static/js/demo.js');
    let cont = fs.readFileSync(jsPath);
    let etag = md5(cont); // 生成唯一标识

	// 如果没有变更
    if(req.headers['if-none-match'] === etag){
        res.writeHead(304, 'Not Modified');
        res.end();
    } else { // 如果变更了，重新刷新唯一标识
        res.setHeader('ETag', etag);
        res.writeHead(200, 'OK');
        res.end(cont);
    }
})


app.listen(port, () => {
	console.log(`listen on ${port}`)
})