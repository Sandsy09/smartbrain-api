if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
};

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.DB_URL  || 'mongodb://localhost:27017/smart-brain' 

const User = require('./models/user')

const userRoutes = require('./routes/users');

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log("Database connected")
});

const app = express();

app.use(bodyParser.json());
app.use(cors());
// app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'milkchocolatechip',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use('/', userRoutes);

app.get('/', (req, res) => {
    const session = req.session;
    const user = req.user;
    const request = {
        session,
        user
    }
    res.send(request);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("App is running on port 3000");
});

