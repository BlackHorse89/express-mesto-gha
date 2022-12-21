const mongoose = require('mongoose');
const isEmail = require('validator');
const { urlRegExp } = require('../utils/status');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'Жак-Ив Кусто',
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: false,
    default: 'Исследователь',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator(url) {
        return urlRegExp.test(url);
      },
      message: 'Укажите корректный адрес url',
    },
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(String) {
        return isEmail(String);
      },
      message: 'Некоректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

const user = mongoose.model('user', userSchema);

module.exports = user;
