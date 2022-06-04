const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const messageList = await Message.find();

  ctx.body = {messages: messageList.map(el => mapMessage(el))};
};
