//利用node.js访问第三方接口,此时node.js相当于客户端,第三方接口相当于服务端,
//注意https开头的网址要引入https,http开头的网址要引入http,
let http = require('https');
let util = require('util');
http.get('https://www.imooc.com/u/loading',function(res){
  let data='';
  res.on("data",function(chunk){
    data+=chunk;
  });
  res.on("end",function(){
    let result = JSON.parse(data);
    console.log("result:"+util.inspect(result));
  })
})
