module.exports = async (req, res, next) => {
    try {
        const data = await req.storage.getById(req.params.id);
        if(data) {
            req.data = data;
            next();
        } else {
            const err = new Error('No such ID in database!');
            err.status = 404;
            throw err;
        }
    } catch (err) {
        res.status(err.status || 400).json({ message: err.message });
    }

};