const userController = require('../controllers/userController');
const catalogController = require('../controllers/catalogController');

module.exports = (app) => {
    app.use('/users', userController);
    app.use('/data/catalog', catalogController);
}