const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: {
        type: String,
        required: [true, 'Review title is required!'],
        // minLength: [5, 'Review title must be at least 5 characters!']
    },
    content: {
        type: String,
        required: [true, 'Review content is required!'],
        // minLength: [15, 'Review must be at least 15 characters!']
    },
    hotelId: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('Review', schema);