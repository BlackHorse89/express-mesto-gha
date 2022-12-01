const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(404).send({message: 'Пользователи не найдены'}))
}

const getUserId = async (req, res) => {
  try{
    const { id } = req.params;
    const user = await res.findById(id);
    if(!user) {
      return res.status(404).send({message: 'Такого пользователя нет'});
    }
    return res.status(200).json(user);
  } catch(err) {
    console.error(err)
    return res.status(500).send({message:'Что-то пошло не так'});
  }
}

const createUser = (req, res) => {
  const { name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(() => res.status(500).send({message: 'Пользователь не создан'}))
}
module.exports = {getUsers, getUserId, createUser};