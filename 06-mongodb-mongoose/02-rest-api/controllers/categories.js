const Category = require('../models/Category');
const mappersCategory = require('../mappers/category');


module.exports.categoryList = async function categoryList(ctx, next) {
  const list = await Category.find();
  ctx.body = {categories: list.map(el => mappersCategory(el))};
    
  
};
