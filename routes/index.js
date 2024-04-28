var express = require('express');
var router = express.Router();

const User = require('../models/user')

const multer = require('multer');
const user = require('../models/user');

// image upload

var storage = multer.diskStorage({
  destination: function(req, file,cb){
    cb(null, "./uploads/");
  },
  filename: function(req,file,cb){
    cb(null, file.fieldname + "_"+ Date.now()+"_"+file.originalname);
  }
})

var upload = multer({
  storage:storage,
}).single('image');


//Insert image

router.post('/add',upload, function(req, res, next) {
  const user = new User({
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    image:req.file.filename,
  });

  user.save()
  .then(() => {
    req.session.message ={
      type: 'success',
      message: 'user added successfully!'
    };
    res.redirect('/');
  })
  .catch(err => {
    res.json({ message: err.message, type: 'danger' });
  });

});


/* GET home page. */
router.get('/',  async function(req, res, next) {
  try {
    const users = await User.find().exec();
    res.render("index", {
        title: "Home Page",
        users: users
    });
} catch (err) {
    res.json({ message: err.message });
}
});

router.get('/add', function(req, res, next) {
  res.render('add_user', { title: 'Add Users' });
});



module.exports = router;
