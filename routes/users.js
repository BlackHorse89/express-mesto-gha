const router = require('express').Router();
const {
  getUsers, getUserId, patchUser, patchUserAvatar, getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserId);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchUserAvatar);
router.get('/me', getUserInfo);

module.exports = router;
