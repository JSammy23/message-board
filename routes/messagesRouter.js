var express = require('express');
var router = express.Router();

const messageController = require('../controllers/messageController');

router.get('/compose', messageController.create_get);

router.post('/compose', messageController.create_post);

router.get('/:id/delete', messageController.delete_get);

router.post('/:id/delete', messageController.delete_post);

module.exports = router;