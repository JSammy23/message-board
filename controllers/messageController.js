const Message = require('../models/message');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

/// Message route functions
// list all message
// create message
// update message
// delete message
// message detail?

exports.index = asyncHandler(async (req, res, next) => {
    const allMessages = await Message.find({}).populate('author').exec()
    res.render('index', {
    title: 'The Hub',
    messages: allMessages
  });
})

exports.create_get = asyncHandler(async (req, res, next) => {
    res.render('message_form', {
        title: 'Compose Message',
        message: null,
        errors: []
    })
});

exports.create_post = [
    body('title', "Title is required")
        .trim()
        .isLength({min: 1, max: 200})
        .escape(),
    body('body', 'Message body is required')
        .trim()
        .isLength({min: 8, max: 12000})
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const message = new Message({
            title: req.body.title,
            body: req.body.body,
            timestamp: new Date(),
            author: req.user._id
        });

        if (!errors.isEmpty()) {
            // Re-render the form with validation error messages
            return res.render('membership_form', {
                title: 'Compose Message',
                message: message,
                errors: errors.array()
            });
        }

        await message.save();
        res.redirect('/');
    })
];

exports.delete_get = asyncHandler(async (req, res, next) => {
    res.send('Not Implemented: Delete Message GET');
});

exports.delete_post = asyncHandler(async (req, res, next) => {
    res.send('Not Implemented: Delete Message POST');
});