const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link, owner } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.status(201).json(card);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: `Переданы некорректные данные при создании карточки. ${errors.join(', ')}` });
    }
    return res.status(500).json({ message: 'Что-то пошло не так' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Card.findByIdAndDelete(id);
    if (!query) {
      return res.status(404).json({ message: 'Карточка c указанным id не найдена' });
    }
    return res.status(200).json({ message: 'Карточка удалена' });
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Передан некорректный id карточки.' });
    }
    return res.status(500).json({ message: 'Не получилось удалить карточку' });
  }
};

// eslint-disable-next-line consistent-return
const likeCard = async (req, res) => {
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
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Переданы некорректные данные для постановки лайка.' });
    }
    return res.status(500).json({ message: 'Не устанавливается лайк' });
  }
};

// eslint-disable-next-line consistent-return
const dislikeCard = async (req, res) => {
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
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Переданы некорректные данные для снятия лайка.' });
    }
    return res.status(500).json({ message: 'Не устанавливается лайк' });
  }
};
module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
