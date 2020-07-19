const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa-cors')
const path = require('path')
const static = require('koa-static')
const bodyparser = require('koa-bodyparser')
// const koaBody = require('koa-body');
const app = new Koa()
const router = new Router();
const resourceRouter = require('./api/resource');

app.use(cors());
app.use(bodyparser());
// app.use(koaBody({
//     multipart: true,
//     formidable: {
//         maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
//     }
// }));

async function start(host, port) {

    app.use(static(
        path.join(__dirname, '../static')
    ))

    app.use(router.routes(), router.allowedMethods())
    app.use(resourceRouter.routes(), resourceRouter.allowedMethods())

    app.listen(port, host)

    console.log(`Server listening on http://${host}:${port}`)
}

function getIPAddress(){
	const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
	let IPAddress = '127.0.0.1';
	for(var devName in interfaces){  
	  var iface = interfaces[devName];  
	  for(var i = 0; i < iface.length; i++){  
			var alias = iface[i];  
			if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
				IPAddress = alias.address;  
			}  
	  }  
	} 
	return IPAddress;
}


start("127.0.0.1", 8090)