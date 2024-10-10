const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

// check Login

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};

//ADMIN LOGIN PAGE
router.get('/admin', async (req, res) => {
  try {
    const local = {
      title: 'Admin Page',
      description: 'simple nodejs App with ejs',
    };
    res.render('admin/index', { local, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Invalid User Format' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Password Format' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

//ADMIN CHECK LOGIN
router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(req.body);

    if (req.body.username === 'admin' && req.body === 'password') {
      res.send('You are logged in.!');
    } else {
      res.send('wrong username and password');
    }

    // res.redirect('/admin');
  } catch (error) {
    console.log(error);
  }
});

//GET ADMIN DASHBOARD
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const local = {
      title: 'Embedded js',
      description: 'simple nodejs App with ejs',
    };

    const data = await Post.find();
    res.render('admin/dashboard', {
      local,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// ADMIN CREATE NEW POST
router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const local = {
      title: 'Add Post',
      description: 'simple nodejs App with ejs',
    };

    res.render('admin/add-post', {
      local,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//GET ADMIN DASHBOARD
router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    console.log(req.body);

    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });
      await Post.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

//Editing posts using PUT method
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    await Post.findIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updateAt: Date.now(),
    });
    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

//Calling Get method to edit
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const local = {
      title: 'Add Post',
      description: 'simple nodejs App with ejs',
    };
    const data = await Post.find({ _id: req.params.id });
    res.render('admin/edit-post', {
      layout: adminLayout,
      local,
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

// delete post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

// ADMIN REGISTER
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     try {
//       const user = await User.create({ username, password: hashedPassword });
//       res.status(201).json({ message: 'User created ', user });
//     } catch (error) {
//       if (error.code === 11000) {
//         res.status(409).json({ message: 'Use already in use' });
//       }
//       res.status(500).json({ message: 'internal Server error' });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// });

module.exports = router;
