const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/', async (req, res) => {
  const local = {
    title: 'Embedded js',
    description: 'simple nodejs App with ejs',
  };
  try {
    let perPage = 4;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('app', {
      local,
      data,
      currentPage: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

// router.get('/', async (req, res) => {
//   const local = {
//     title: 'Embedded js',
//     description: 'simple nodejs App with ejs',
//   };
//   const data = await Post.find();
//   res.render('app', { local, data });
// });

// router.get('/about', (req, res) => {
//   res.render('about');
// });

// GET POSTS from :ID
router.get('/post:id', async (req, res) => {
  try {
    const local = {
      title: 'Embedded js',
      description: 'simple nodejs App with ejs',
    };
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });
    res.render('post', { local, data });
  } catch (err) {
    console.log(err);
  }
});

//POST SEARCH TERM
router.post('/search', async (req, res) => {
  try {
    const local = {
      title: 'Search',
      description: 'simple nodejs App with ejs',
    };
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9]/g, '');
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
      ],
    });
    res.render('search', {
      data,
      local,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
