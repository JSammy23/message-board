var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Sign Up GET
router.get('/sign-up', userController.user_create_get);

// Sign up POST
router.post('/sign-up', userController.user_create_post);

// Login GET
router.get('/login', userController.login_get)

// POST Login
router.post('/login', userController.login_post);

// Membership routes
router.get('/:id/membership', userController.membership_get);

router.post('/:id/membership', userController.membership_post);

module.exports = router;
