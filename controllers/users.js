const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

const getUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await res.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'Такого пользователя нет' });
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Передан некорректный id пользователя.' });
    }
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    });
    return res.status(200).json({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: `Переданы некорректные данные при создании пользователя. ${errors.join(', ')}` });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Такой email уже используется.' });
    }
    return next(err);
  }
};

const patchUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { name: req.body.name, about: req.body.about }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: `Переданы некорректные данные при обновлении профиля. ${errors.join(', ')}` });
    }
    return next(err);
  }
};

const patchUserAvatar = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { avatar: req.body.avatar }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: `Переданы некорректные данные при обновлении аватара. ${errors.join(', ')}` });
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Переданы некорректные почта или пароль!' });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(400).json({ message: 'Переданы некорректные почта или пароль!' });
    }
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Передан некорректный id пользователя.' });
    }
    return next(err);
  }
};

module.exports = {
  getUsers, getUserId, createUser, patchUser, patchUserAvatar, login, getUserInfo,
};
