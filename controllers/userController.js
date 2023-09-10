const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Routes needed:
// Create User
// Update User
// Delete User
// User Detail
// Sign up
// Login
// Logout
// membership status

exports.user_create_get = asyncHandler(async (req, res, next) => {
    res.render('sign-up', {
        title: 'Sign-Up',
        user: null,
        errors: []
    });
});

exports.user_create_post = [
    body('firstName', 'First name required.')
        .trim()
        .isLength({min: 1, max: 100})
        .isAlpha()
        .escape(),
    body('lastName', 'Last name is required.')
        .trim()
        .isLength({min: 1, max: 100})
        .isAlpha()
        .escape(),
    body('username', 'Username is required')
        .trim()
        .isAlphanumeric()
        .isLength({min: 1, max: 100})
        .escape()
        .custom(value => {
            return User.findOne({ username: value }).then(user => {
                if (user) {
                    return Promise.reject('Username already exists.');
                }
            });
        }),
    body('password', 'Password is required.')
        .isLength({min: 1, max: 100})
        .custom((value, {req}) => {
            if (value != req.body.confirm_password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        }),
    body('confirm_password', 'Confirm password is required.')
        .isLength({min: 1, max: 100}),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: hashedPassword,
            date_joined: new Date(),
            membership_status: 'user'
        });

        if (!errors.isEmpty()) {
            res.render('sign-up', {
                title: 'Sign up',
                user: user,
                errors: errors.array()
            });
        } else {
            await user.save();
            res.redirect('/');
        }  
    })
];

exports.login_get = asyncHandler(async (req, res, next) => {
    res.render('login', {
        title: "Login"
    });
});

exports.login_post = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
});

exports.membership_get = asyncHandler(async (req, res, next) => {
    res.render('membership_form', {
        title: 'Join the Club',
        errors: []
    });
});

exports.membership_post = [
    body('password', 'Password Required')
        .isLength({min: 1, max: 100}),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Re-render the form with validation error messages
            return res.render('membership_form', {
                title: 'Join the Club',
                errors: errors.array()
            });
        }

        if (req.body.password !== 'Bananapudding') {
            return res.render('membership_form', {
                title: 'Join the Club',
                errors: ['Incorrect Password!']
            });
        }

        await User.findByIdAndUpdate(req.user._id, { membership_status: 'member' });

        res.render('success', {
            membership: 'Member'
        });
    })
]

