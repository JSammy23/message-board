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

router.get('/login-failure', (req, res) => {
  res.send('Login failed!')
});

router.get('/login-success', (req, res) => {
  res.send('Login successful!')
});

module.exports = router;
