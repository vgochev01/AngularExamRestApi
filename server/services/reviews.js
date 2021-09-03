const Review = require(`../models/Review`);

async function createReview(data) {
    const review = new Review(data);
    await review.save();
    return review;
}

module.exports = {
    createReview
}