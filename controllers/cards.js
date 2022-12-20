const Card = require('../models/card');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link, owner } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.status(201).json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: `Переданы некорректные данные при создании карточки. ${errors.join(', ')}` });
    }
    return next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ message: 'Карточка c указанным id не найдена' });
    }
    if (card.owner.toHexString() === req.user._id) {
      await Card.findByIdAndRemove(id);
      return res.status(200).json({ message: 'Карточка удалена' });
    }
    return res.status(400).json({ message: 'Нельзя удалять карточки других пользователей' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Передан некорректный id карточки.' });
    }
    return next(err);
  }
};

// eslint-disable-next-line consistent-return
const likeCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!query) {
      return res.status(404).json({ message: 'Карточка c указанным id не найдена' });
    }
    return res.status(200).json({ message: 'Лайк установлен' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Переданы некорректные данные для постановки лайка.' });
    }
    return next(err);
  }
};

// eslint-disable-next-line consistent-return
const dislikeCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!query) {
      return res.status(404).json({ message: 'Карточка c указанным id не найдена' });
    }
    return res.status(200).json({ message: 'Лайк удален' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Переданы некорректные данные для снятия лайка.' });
    }
    return next(err);
  }
};
module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
