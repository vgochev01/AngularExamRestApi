const express = require('express');
const { auth } = require('../middlewares/auth');
const cors = require('cors');
const storage = require('../middlewares/storage');

module.exports = (app) => {

    app.use(cors({
        allowedHeaders: ['Content-Type', 'X-Authorization']
    }));

    app.use(express.json());
    app.use(auth());
    app.use(storage());
}