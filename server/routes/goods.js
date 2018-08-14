var express = require('express');
var  router = express.Router();
var mongoose = require('mongoose');
//导入模型(js文件)
var Goods = require('../models/goods.js');
//连接mongoose数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');
//连接成功
mongoose.connection.on("connected",function(){
  console.log('Mongodb connected sucess');
});
//连接失败
mongoose.connection.on("error",function(){
  console.log('Mongodb connected fail');
});
//连接断开
mongoose.connection.on("disconnected",function(){
  console.log('Mongodb connected disconnected');
});
//查询数据库数据
router.get("/list",function(req,res,next){
  //设置第几页
  let page = parseInt(req.query.page);
  //设置一页有几条数据
  let pageSize = parseInt(req.query.pageSize);
  //设置是升序还是降序,1升序,-1降序
  let sort = req.query.sortFlag;
  //设置跳过多少条数据
  let skip = (page-1)*pageSize;
  let priceLevel =req.query.priceLevel;
  let priceGt =''; let priceLt = '';
  let params={};
  if(priceLevel != "all"){
    switch(priceLevel){
      case '0': priceGt=0; priceLt=100;break;
      case '1': priceGt=101; priceLt=500;break;
      case '2': priceGt=501; priceLt=1000;break;
      case '3': priceGt=1001; priceLt=5000;break;
    }
    params={
      salePrice:{
        $gte:priceGt,
        $lte:priceLt
      }
    }
  }else {
    params={};
  }
  //mongodb条件操作符，"$lt", "$lte", "$gt", "$gte", "$ne"就是全部的比较操作符，对应于"<", "<=", ">", ">=","!="
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  // res.send('hello goods list');这个时候运行node bin/www就可以访问到hello goods list
  goodsModel.exec(function(err,doc){
    if(err){
      res.json({
        status:1,
        msg:err.message
      })
    }else{
      res.json({
        status:0,
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
});
//加入购物车(提交数据post安全)
router.post("/addCart",function(req,res,next){

  //假设已经登录,根据用户id查询数据
    let userId='100000077';
    //获取商品id,post请求获取的方法是req.body,这时不能把前端上的所有商品数据传过来保存,这样是不科学和危险的,
  // 我们应该根据商品id去数据库中拿到数据,修改数据库中的数据
    let productId = req.body.productId;
    //导入模型
    let User = require('../models/user.js');
    //在用户表中查找userId=userId(100000077)的用户,第一个userId是模型中定义的,和数据库中的名称相同,第二个userId是用户id
    User.findOne({userId:userId},function(err,userDoc){
        if(err){
            res.json({
              status:"1",
              msg:err.message
            })
        }else{
            console.log(`userDoc:${userDoc}`);
            //确认用户id存在后查找商品是否存在
            if(userDoc){
              //判断购物车中商品是否已经存在,如果存在则商品数量++,不存在保存商品所以信息
              let goodsItem = '';
              userDoc.cartList.forEach(function(item){
                if(item.productId ==productId){
                  goodsItem = item;
                  item.productNum++;
                }
              });
              if(goodsItem){
                userDoc.save(function(err2,doc2){
                  if(err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    })
                  }
                });
              }else{
                Goods.findOne({productId:productId},function(err1,doc1){
                  if(err1){
                    res.json({
                      status:"1",
                      msg:err1.message
                    })
                  }else{
                    //确认商品存在后,由于,数据库中的字段没有productNum(数量)和checked(是否被选中),所以我们要加进去保存
                    if(doc1){
                      doc1.productNum=1;
                      doc1.checked=1;//1选中,0 未选中
                      //把商品中的数据和新加的数据加到User.carList中并保存
                      userDoc.cartList.push(doc1);
                      userDoc.save(function(err2,doc2){
                        if(err2){
                          res.json({
                            status:"1",
                            msg:err2.message
                          })
                        }else{
                          res.json({
                            status:'0',
                            msg:'',
                            result:'success'
                          })
                        }
                      });
                    }
                  }
                })
              }


            }
        }
    })
});
module.exports = router;
