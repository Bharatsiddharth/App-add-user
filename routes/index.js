var express = require('express');
var router = express.Router();

const User = require('../models/user')

const fs = require('fs');
const path = require('path');

const multer = require('multer');
const user = require('../models/user');
const { error } = require('console');
const { type } = require('os');

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

router.get('/edit/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      res.redirect('/');
    } else {
      res.render("edit_user", {
        title: "Edit User",
        user: user
      });
    }
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});


router.post('/update/:id', upload, function(req, res, next) {
  let id = req.params.id;
  let new_image = '';
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync('./uploads' + req.body.old_image);
    } catch (error) {
      console.log(error)
    }
  } else {
    new_image = req.body.old_image;
  }

  user.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: new_image,
  }).then(result => {
    req.session.message = {
      type: 'success',
      message: 'User updated successfully'
    };
    res.redirect('/');
  }).catch(error => {
    res.message({ message: error.message, type: 'danger' });
  });
});




module.exports = router;
