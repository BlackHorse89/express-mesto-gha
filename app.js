const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8255',
  };

  next();
});

app.use('/users', routerUser);

app.use('/cards', routerCard);

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
