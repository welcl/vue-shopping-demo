var express = require('express');
var router = express.Router();
//引入日期格式化工具类
require('./../util/util.js');
var User = require('./../models/user.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//登录路由
router.post('/login',function(req,res,next){
  var param ={
    userName:req.body.userName,
    userPwd:req.body.userPwd
  };
  console.log(param);
  //根据账号密码查询数据库
  User.findOne(param,function(err,doc){
    if(err){
      //没用符合查询条件的时候报错
      res.json({
        status:"1",
        msg:err.message
      });
    }else{
      if(doc){
        //保存到cookie,app.js中已经有引入 cookie-Parser了(做cookie处理)
        //path:保存到根路径,maxAge:存储的周期时长
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
        res.json({
          status:"0",
          msg:"",
          result:{
            userName:doc.userName
          }
        })
      }else{
        //查询到用户名或者密码错误时执行
        res.json({
          status:"1",
          msg:"用户名或者密码错误"
        });
      }
    }
  })
})
//登出路由(通过清除cookie的userid退出登录)
router.post('/logout',function(req,res,next){
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:"",
    result:''
  })
})
//页面刷新判断是否登录,如果登录则保持登录
router.get("/checkLogin",function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName
    })
  }else{
      res.json({
        status:'1',
        msg:'未登录',
        result:''
      })
  }
})
//查询当前用户的购物车数据
router.get('/cartList',function(req,res,next){
   let userId=req.cookies.userId;
   User.findOne({userId:userId},function(err,doc){
     if(err){
       res.json({
         status:"1",
         msg:err.message,
         result:''
       });
     }else{
       if(doc){
         res.json({
           status:'0',
           msg:'',
           result:doc.cartList
         })
       }
     }
   })
})

//购物车删除
router.post('/cartDel',function(req,res,next){
  let productId=req.body.productId;
  let userId=req.cookies.userId;
  User.update({userId:userId},{$pull:{'cartList':{'productId':productId}}},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  })
})
//商品数量加减
router.post('/cartEdit',function(req,res,next){
  let userId=req.cookies.userId,productId=req.body.productId,
    productNum=req.body.productNum,checked=req.body.checked;
  console.log(checked);
  //操作单个商品的属性
  User.update(
      {"userId":userId,"cartList.productId":productId},
      {"cartList.$.productNum":productNum,"cartList.$.checked":checked},
    function(err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:'suc'
        })
      }
    })
})
//商品全选和取消全选
router.post('/editCheckAll',function(req,res,next){
  let userId=req.cookies.userId,checked=req.body.checked?"1":"0";
  //操作购物车里所有商品的属性
  User.findOne({userId:userId},function(err,user){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(user){
        user.cartList.forEach((item)=>{
          item.checked=checked;
        });
        user.save(function(err1,doc){
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'suc'
            })
          }
        })
      }

    }
  })
})
//查询用户地址接口
router.get('/addressList',function(req,res,next){
  let userId=req.cookies.userId;
    User.findOne({userId:userId},function(err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:'0',
          msg:"",
          result:doc.addressList
        })
      }
    })
})
//设置默认地址
router.post('/setDefault',function(req,res,next){
  var userId=req.cookies.userId,addressId=req.body.addressId;
  if(!addressId){
    res.json({
      status:"10003",
      msg:"addressId is null",
      result:""
    })
  };
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      var addressList=doc.addressList;
      addressList.forEach((item)=>{
          if(item.addressId==addressId){
            item.isDefault=true;
          }else{
            item.isDefault=false;
          }
        })
        doc.save(function(err1,doc1){
          if(err1){
            res.json({
              status:"1",
              msg:err.message,
              result:""
            })
          }else{
            res.json({
              status:"0",
              msg:"",
              result:""
            })
          }
        })
    }
  })
})
//删除地址接口
router.post("/delAddress",function(req,res,next){
  var userId=req.cookies.userId,addressId=req.body.addressId;
  User.update({userId:userId},{$pull:{"addressList":{"addressId":addressId}}},function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:"0",
        msg:'',
        result:''
      })
    }
  })
});
//订单提交接口
router.post("/payMent",function(req,res,next){
  var userId=req.cookies.userId,
    orderTotal=req.body.orderTotal,
    addressId=req.body.addressId;
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else{
      var address='',goodList=[];
      //获取用户地址信息
      doc.addressList.forEach((item)=>{
        if(item.addressId==addressId){
            address=item;
        }
      });
      //获取用户购物车的购买信息
      doc.cartList.forEach((item)=>{
        if(item.checked=='1'){
          goodList.push(item);
        }
      });
      var platform='622';
      var r1=Math.floor(Math.random()*10);
      var r2=Math.floor(Math.random()*10);
      var sysDate=new Date().Format('yyyyMMddhhmmss');
      var createDate=new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId=platform+r1+sysDate+r2;
      var order={
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodList,
        orderStatus:'1',
        createDate:createDate
      };
      doc.orderList.push(order);
      doc.save(function(err1,doc1){
        if(err){
          res.json({
            status:"1",
            msg:err.message,
            result:''
          })
        }else{
          res.json({
            status:"0",
            msg:'',
            result:''
          })
        }
      });
      res.json({
        status:"0",
        msg:'',
        result:{
          orderId:order.orderId,
          orderTotal:order.orderTotal
        }
      })
    }
  })
});
//订单成功页面
router.get('/orderDetail',function(req,res,next){
  var userId=req.cookies.userId,orderId=req.query.orderId;
  console.log(orderId);
    User.findOne({userId:userId},function(err,userDoc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        var orderList=userDoc.orderList;
        if(orderList.length>0){
          orderList.forEach((item)=>{
            if(item.orderId==orderId){
              var orderTotal=item.orderTotal;
              console.log(orderTotal);
              if(orderTotal>0){
                res.json({
                  status:'0',
                  msg:"",
                  result:{
                    orderId:orderId,
                    orderTotal:orderTotal
                  }
                })
              }else{
                res.json({
                  status:'120002',
                  msg:"此订单无效",
                  result:""
                })
              }
            }
          })
        }else{
          res.json({
            status:'120001',
            msg:"当前用户未创建订单",
            result:''
          })
        }

      }
  })
});
//获取购物车商品总数
router.get('/getCartCount',function(req,res,next){
  var userId=req.cookies.userId;
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      var cartList=doc.cartList;
      let cartCount=0;
      cartList.map((item)=>{
        cartCount+=parseInt(item.productNum);
      });
      res.json({
        status:'0',
        msg:'',
        result:cartCount
      })
    }
  })
})
module.exports = router;
