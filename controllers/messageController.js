const Message = require('../models/message');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');


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
        .isLength({min: 8, max: 12000}),

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
    const message = await Message.findById(req.params.id).populate('author');
    res.render('message_delete', {
        title: 'Delete Message',
        message: message,
        errors: []
    })
});

exports.delete_post = asyncHandler(async (req, res, next) => {
    const message = await Message.findById(req.params.id).populate('author');
    if (req.user.membership_status !== 'admin'){
        return res.render('message_delete', {
            title: 'Delete Message',
            message: message,
            errors: ['Only admins have the right to delete messages']
        });
    }

    await Message.findByIdAndRemove(req.body.messageid);
    res.redirect('/');
});