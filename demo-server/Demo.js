let user = require ('./User.js');
console.log(`i am ${user.useName}, i say ${user.say()}`);
//引入http模块
let  http = require('http');
//引入url网址模块
let  url = require ('url');
//引入实用工具
let util = require ('util');
//新建一个服务器,设置请求参数,监听端口
 let  server = http.createServer((req,res)=>{
   res.statusCode =200;
   res.setHeader("Content-Type","text/plain; charset=utf-8");
   console.log("url:"+req.url);// /heoll.html?a=123
   //url.parse()把url网址转成对象
   console.log("url.parse:"+url.parse(req.url));//[object Object]
   //util.inspect把url网址转成字符串形式,主要用于调试,实际开发没啥用
   console.log("url.inspect:"+util.inspect(url.parse(req.url)));
   // Url {
   // protocol: null,
   //   slashes: null,
   //   auth: null,
   //   host: null,
   //   port: null,
   //   hostname: null,
   //   hash: null,
   //   search: '?a=123',
   //   query: 'a=123',
   //   pathname: '/heoll.html',
   //   path: '/heoll.html?a=123',
   //   href: '/heoll.html?a=123' }
res.end(util.inspect(url.parse('http://127.0.0.1:3000/heoll.html?a=123')));
 })
server.listen(3000,'127.0.0.1',()=>{
  console.log("服务器已经运行,请打开浏览器,输入http://127.0.0.1:3000 访问" );
})
