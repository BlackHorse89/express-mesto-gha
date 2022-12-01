const Card = require('../models/card');

const getCards = async (req, res) => {
  try{
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Что-то пошло не так'});
  }
}

const createCard = async (req, res) => {
  try{
    const {name, link} = req.body;
    const card = await Card.create({name, link});
    return res.status(201).json(card);
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Что-то пошло не так'});
  }
}

const deleteCard =async (req, res) => {
  try{
    const { id } = req.params;
    await res.delete(Card[id])
    return res.status(200).json({message: 'Карточка удалена'});
  } catch(err) {
    return res.status(500).json({message: 'Не получилось удалить карточку'});
  }
}
module.exports = {getCards, createCard, deleteCard};