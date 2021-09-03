const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'Name of the hotel is required!']
    },
    description: {
        type: String,
        required: [true, 'Description of the hotel is required!']
    },
    destination: {
        type: String,
        required: [true, 'Hotel destination is required!']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required!'],
        match: [/^http[s]?:\/\//, 'Please enter a valid image URL!']
    },
    price: {
        type: Number,
        required: [true, 'Price per night is required!'],
        min: [10, 'Price per night must be at least 10$']
    },
    freeRooms: {
        type: Number,
        min: [0, 'Free rooms should be between 1 and 100 inclusive'],
        max: [100, 'Free rooms should be between 1 and 100 inclusive']
    },
    reviews: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
        default: []
    },
    usersBooked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('Hotel', schema);