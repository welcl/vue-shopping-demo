//利用fs模块访问index.html文件,并且把内容输出到客户端,(定义路由的方式)
//引入http模块
let  http = require('http');
//引入url网址模块
let  url = require ('url');
//引入实用工具
let util = require ('util');
//引入系统文件模块
let fs = require ('fs');
let  server = http.createServer((req,res)=>{
 let pathname=url.parse(req.url).pathname;
 console.log(pathname.substring(1));
 fs.readFile(pathname.substring(1),function(err,data){
   if(err){
     res.writeHead(404,{
       'Context-Type':'text/html'
     });
   }else{
     res.writeHead(200,{
       'Context-Type':'text/html'
     })
     res.write(data.toString());
   }
   res.end();
 })
})
server.listen(3000,'127.0.0.1',()=>{
  console.log("服务器已经运行,请打开浏览器,输入http://127.0.0.1:3000 访问" );
})
