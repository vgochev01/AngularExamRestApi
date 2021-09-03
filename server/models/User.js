const { Schema, model } = require('mongoose');

const schema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    hotelsCreated: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
    hotelsBooked: [{ type: Schema.Types.ObjectId, ref: 'Hotel'}]
});

module.exports = model('User', schema);