const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    try {
        const {email, displayName, password} = ctx.request.body;
        const token = uuid();

        const user = new User({
            email,
            displayName,
            verificationToken: token,
        });

        await user.setPassword(password);
        await user.save();

        await sendMail({
            template: 'confirmation',
            locals: {token},
            to: email,
            subject: 'Подтвердите почту',
        });

        ctx.body = { 
            status: 'ok',
           // message: 'User register successfully'
         };

    } catch(err) {
        throw err;
    };

};

module.exports.confirm = async (ctx, next) => {
    const {verificationToken} = ctx.request.body;
    const user = await User.findOne({verificationToken});

    if (!user) {
        ctx.status = 400;
        ctx.body = {
           // status: error,
            error: 'Ссылка подтверждения недействительна или устарела'
        };
        return;
      };

    user.verificationToken = undefined; 
    await user.save();
    const token = uuid();
    ctx.body = {
        token,
       // status: 200,
        message: 'User login successfully'
    };
};
