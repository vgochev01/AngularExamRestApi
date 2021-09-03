const mongoose = require('mongoose');
const { DB_CONNECTION_STR } = require('.');

module.exports = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_CONNECTION_STR, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    
        const db = mongoose.connection;
    
        db.on('error', (err) => {
            console.error('Database Error!');
            reject(err);
        });

        db.once('open', () => {
            console.log('Database Connected!');
            resolve();
        });
    });
}