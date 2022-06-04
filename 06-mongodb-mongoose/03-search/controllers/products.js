const Product = require('../models/Product');
const mappersProduct = require('../mappers/product');
// Первый этап задачи – это расширение текущей схемы модели товара. Необходимо объявить создание текстового индекса со следующими характеристиками:

// текстовый индекс модели models/Product.js должен включать поля title и description
// веса должны быть указаны следующим образом: вес title должен быть 10, description – 5
// язык по умолчанию должен быть русский
// имя индекса – TextSearchIndex

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;

  if (!query) {
    ctx.status = 404;
    ctx.body = [];
    return;
  }

  const productArr = await Product
  .find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } })
  .sort({ score: { $meta: "textScore" } });
  if(!productArr){
    ctx.body = [];
    return;
  };
  ctx.body = {products: productArr.map(el => mappersProduct(el))};
};
