const express = require('express');
const databaseConfig = require('./config/database');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes');

const { PORT } = require('./config');

start();

async function start(){
    const app = express();

    await databaseConfig();
    expressConfig(app);
    routesConfig(app);

    app.listen(PORT, () => console.log('REST API running on port ' + PORT));
}