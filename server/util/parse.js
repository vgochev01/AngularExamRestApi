function parseMongooseError(err){
    console.log(Object.values(err.errors));
    return Object.values(err.errors).map(e => e.properties.message);
}

module.exports = {
    parseMongooseError
}