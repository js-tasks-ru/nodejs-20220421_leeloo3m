const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Product = require('../models/Product');


module.exports.checkout = async function checkout(ctx, next) {
    const product = await Product.findOne({_id: ctx.request.body.product});
    
    const order = await Order.create({
        user: ctx.user,
        product: product,
        phone: ctx.request.body.phone,
        address: ctx.request.body.address
    });

    await sendMail({
        template: 'order-confirmation',
        locals: {id: order._id, product: product},
        to: ctx.user.email,
        subject: 'Подтверждение заказа',
    });

    ctx.body = {order: order._id}
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const orders = await Order.find({user: ctx.user}).populate('product');
    ctx.status = 200;
    ctx.body = {orders: orders};

};
