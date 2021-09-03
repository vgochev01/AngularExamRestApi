function isAuth() {
    return (req, res, next) => {
        if(req.user != undefined){
            next();
        } else {
            res.status(401).json({ message: 'Please sign-in!' });
        }
    }
}

function isGuest() {
    return (req, res, next) => {
        if(req.user == undefined){
            next();
        } else {
            res.status(403).json({ message: 'Logged-in users cannot access this page!' });
        }
    }
}

function isOwner(){
    return (req, res, next) => {
        const isOwner = req.user?._id == req.data.owner._id;
        if(isOwner) {
            next();
        } else {
            res.status(403).json({ message: 'You are not allowed to modify this record!'});
        }
    }
}

function notOwner(){
    return (req, res, next) => {
        const isOwner = req.user?._id == req.data.owner._id;
        if(!isOwner) {
            next();
        } else {
            res.status(403).json({ message: 'You are not allowed to modify this record!'});
        }
    }
}

module.exports = {
    isAuth,
    isGuest,
    isOwner,
    notOwner
}