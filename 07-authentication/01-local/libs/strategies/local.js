const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      //done(null, false, 'Стратегия подключена, но еще не настроена');
      try {
        const user = await User.findOne({email});
        if (!user) {
          return done(null, false, 'Нет такого пользователя');
        };

        const userPassword = await user.checkPassword(password);
        if (!userPassword) {
          return done(null, false, 'Неверный пароль');
        };

        return done(null, user);

      } catch(err) {
        return done(err);
      }
    },
);
