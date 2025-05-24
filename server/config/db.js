require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    todos: [{
        title: String,
        description: String,
        completed: {
            type: String,
            default: false
        }
    }]
})

const User = mongoose.model('User', UserSchema);

module.exports = {User};