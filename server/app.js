var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();
var ejs= require('ejs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//制作一个登录拦截器,当用户登录的时候可以加入购物车,否则提示请登录后再加入(app.use直接加函数会优先执行,这个函数位置不可以写太靠前,否则会没效果)
app.use(function(req,res,next){
  if(req.cookies.userId){
    next();
  }else{
    console.log(`${req.path} ~~~~${req.originalUrl}`);
    //req.path:goods/list     req.originalUrl:goods/list?page=1&pageSize=8&sortFlag=1&priceLevel=all
    //在这里可以用req.path=="/goods/list" 或者 req.originalUrl.indexOf('/goods/list')>-1
    //满足下列条件的地址可以继续执行
    if(req.originalUrl =='/users/login'||req.originalUrl=='users/logout'||req.path=="/goods/list"){
      next();
    }else{
      res.json({
        status:'10001',
        msg:"当前未登录",
        result:''
      })
    }
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
