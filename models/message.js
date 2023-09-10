const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, maxLength: 200, required: true },
    body: { type: String, maxLength: 12000, required: true },
    timestamp: { type: Date, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Message', MessageSchema);