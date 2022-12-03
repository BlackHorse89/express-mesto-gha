const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
};

const getUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await res.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'Такого пользователя нет' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Передан некорректный id пользователя.' });
    }
    return res.status(500).send({ message: 'Что-то пошло не так' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: `Переданы некорректные данные при создании пользователя. ${errors.join(', ')}` });
    }
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
};

const patchUser = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { name: req.body.name, about: req.body.about }, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: `Переданы некорректные данные при обновлении профиля. ${errors.join(', ')}` });
    }
    return res.status(500).send({ message: 'Что-то пошло не так' });
  }
};

const patchUserAvatar = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { avatar: req.body.avatar }, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: `Переданы некорректные данные при обновлении аватара. ${errors.join(', ')}` });
    }
    return res.status(500).send({ message: 'Что-то пошло не так' });
  }
};
module.exports = {
  getUsers, getUserId, createUser, patchUser, patchUserAvatar,
};
