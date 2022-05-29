const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  //done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
  if(!email) {
    return done(null, false, 'email не указан');
  };

  try{
    const user = await User.findOne({ email });

    if(user) {
      return done(null, user);
    } else {
      await new User({email, displayName}).save();
    
      const user = await User.findOne({email});
      return done(null, user);  
    }

  } catch(err) {
    return done(err);
  };
};
