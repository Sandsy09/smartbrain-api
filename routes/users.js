const express = require('express');
const router = express.Router();
const passport = require('passport');

const users = require('../controllers/users');


router.route('/signin')
    .post(passport.authenticate('local'),
        users.signin
    );

router.route('/register',)
    .post(users.register);

router.route('/logout')
    .get(users.logout);

router.route('/profile/:id')
    .get(users.userProfile)

router.route('/image')
    .put(users.putImage)
    .post(users.imageSubmission)

module.exports = router;

