const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');

const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const serverError = require('./middlewares/serverError');
const { urlRegExp } = require('./utils/status');
const NotFoundError = require('./Errors/NotFound');

const { PORT = 3000 } = process.env;

const app = express();

const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Привышен лимит запросов.',
});

app.use(helmet());
app.use(limit);
app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegExp),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use(errors());
app.use((req, res, next) => next(new NotFoundError('Ошибка: роута не существует')));
app.use(serverError);

app.listen(PORT, () => {
  console.log(`Подключился к порту ${PORT}`);
});

mongoose.connect(
  'mongodb://127.0.0.1:27017/mestodb',
  {
    useNewUrlParser: true,
  },
);
