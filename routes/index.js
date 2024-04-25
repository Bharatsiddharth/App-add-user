var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home Page' });
});

router.get('/add', function(req, res, next) {
  res.render('add_user', { title: 'Add Users' });
});



module.exports = router;
