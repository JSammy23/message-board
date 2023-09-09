const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, maxLength: 100, required: true },
    password: { type: String, maxLength: 100, required: true },
    firstName: { type: String, maxLength: 100, required: true },
    lastName: { type: String, maxLength: 100, required: true },
    date_joined: { type: Date, required: true },
    membership_status: { type: String, enum: ['user', 'club_member', 'admin'], required: true }
});

UserSchema.virtual('url').get(function () {
    return `/users/${this._id}`;
});

UserSchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', UserSchema);