const Card = require('../models/card');
const { Status } = require('../utils/status');

const BadRequestError = require('../Errors/BadRequest');
const NotFoundError = require('../Errors/NotFound');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.json(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link, owner } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.status(Status.CREATED).json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return next(new BadRequestError(`Переданы некорректные данные при создании карточки. ${errors.join(', ')}`));
    }
    return next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card) {
      return next(new NotFoundError('Карточка c указанным id не найдена'));
    }
    if (card.owner.toHexString() === req.user._id) {
      await Card.findByIdAndRemove(id);
      return res.json({ message: 'Карточка удалена' });
    }
    return next(new BadRequestError('Нельзя удалять карточки других пользователей'));
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Передан некорректный id карточки.'));
    }
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!query) {
      return next(new NotFoundError('Карточка c указанным id не найдена'));
    }
    return res.json({ message: 'Лайк установлен' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
    }
    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!query) {
      return next(new NotFoundError('Карточка c указанным id не найдена'));
    }
    return res.json({ message: 'Лайк удален' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
    }
    return next(err);
  }
};
module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
