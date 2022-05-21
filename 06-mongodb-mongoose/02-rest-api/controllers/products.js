const Product = require('../models/Product');
const mappersProduct = require('../mappers/product');
const mongoose = require('mongoose');

//запрос делается по ObjectID.
//ObjectId должен быть валидным, если не валидный то 400
//если товара с таким ObjectID нет то 404

//1. пишем функцию для получения массива сабкатегорий и массива продуктов
function list(arr) {
  return arr ? arr.map(el => mappersProduct(el)) : [];
}

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const subcategoryList = await Product.find({subcategory});
  ctx.body = {products: list(subcategoryList)};
};

module.exports.productList = async function productList(ctx, next) {
  const productsList = await Product.find();
  ctx.body = {products: list(productsList)};
};

module.exports.productById = async function productById(ctx, next) {
  if(!mongoose.isValidObjectId(ctx.params.id)){
    ctx.status = 400;
    ctx.body = 'invalid id';
    return;
  };
  const prod = await Product.findById(ctx.params.id);
  if(!prod){
    ctx.status = 404;
    ctx.body = 'product not found';
  } else {
    ctx.body = {products: mappersProduct(prod)};
  }
  
};

