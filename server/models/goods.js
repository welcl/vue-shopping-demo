//引入mongoose插件
var mongoose  = require('mongoose');
//schema:
//Schema主要用于定义MongoDB中集合Collection里文档document的结构
var Schema = mongoose.Schema;
var productSchema = new Schema({
      "productId":String,
      "productName":String,
      "salePrice":Number,
      "productImage":String,
      "checked":String,
      "productNum":Number
});
//导出模型(productSchema)到Good中
//model:
//模型Model是根据Schema编译出的构造器，或者称为类，通过Model可以实例化出文档对象document文档,document的创建和检索都需要通过模型Model来处理
//mongoose.model()
//使用model()方法，将Schema编译为Model。model()方法的第一个参数是模型名称
//Mongoose会将集合名称设置为模型名称的小写版。如果名称的最后一个字符是字母，则会变成复数；如果名称的最后一个字符是数字，则不变；如果模型名称为"MyModel"，则集合名称为"mymodels"；如果模型名称为"Model1"，则集合名称为"model1"
module.exports=mongoose.model('Good',productSchema);
