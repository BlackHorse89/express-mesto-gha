const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi } = require('celebrate');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const serverError = require('./middlewares/serverError');

const { PORT = 3000 } = process.env;

const app = express();

const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Привышен лимит запросов.',
});

app.use(helmet());
app.use(limit);
app.use(bodyParser.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
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

app.use(serverError);
app.use('*', (req, res) => res.status(404).json({ message: 'Ошибка: роута не существует' }));

app.listen(PORT, () => {
  console.log(`Подключился к порту ${PORT}`);
});

mongoose.connect(
  'mongodb://127.0.0.1:27017/mestodb',
  {
    useNewUrlParser: true,
  },
);
