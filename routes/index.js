var express = require('express');
var router = express.Router();
const Message = require('../models/message');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/messages');
});

module.exports = router;
