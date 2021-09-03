const hotelsService = require('../services/hotels');
const reviewsService = require('../services/reviews');

module.exports = () => (req, res, next) => {
    req.storage = Object.assign({}, hotelsService, reviewsService);
    next();
}