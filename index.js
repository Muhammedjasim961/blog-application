require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const Router = require('./server/routes/main');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./server/config/db');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// CONNECT TO MONGO_DB
connectDB();

//check connection
if (!process.env.MONGODB_URL) {
  throw new Error('MONGODB_URI environment variable is not set.');
} else {
  // console.log(process.env.MONGODB_URL);
}

//middleware
// app.use(
//   '/edit-post',
//   express.static(path.join(__dirname, './views/admin/edit-post.ejs'))
// );

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'keyboard cat', // Corrected typo
    resave: false,
    saveUninitialized: true, // Corrected typo
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
    //cookie: { maxAge: 3600000 }, // Uncommented and simplified to just the duration
  })
);

app.use(express.static('public'));

//ROUTES
app.use('/', Router);
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
  console.log(`Port is running on ${PORT}`);
});
