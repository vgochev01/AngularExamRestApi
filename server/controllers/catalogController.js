const router = require('express').Router();
const { isAuth, isOwner, notOwner } = require('../middlewares/guards');
const preload = require('../middlewares/preload');
const { addHotelToList, addBookedHotel } = require('../services/user');
const { parseMongooseError } = require('../util/parse');

router.post('/', isAuth(), async(req, res) => {
    const data = {
        name: req.body.name,
        description: req.body.description,
        destination: req.body.destination,
        imageUrl: req.body.imageUrl,
        price: Number(req.body.price || 0),
        freeRooms: Number(req.body.freeRooms || 0),
        reviews: [],
        usersBooked: [],
        owner: req.user._id
    }
    try {
        const hotel = await req.storage.create(data);
        await addHotelToList(req.user._id, hotel._id);
        res.json(hotel);
    } catch (err) {
        let message = err.message;
        if(err.name == 'ValidationError'){
            message = parseMongooseError(err)[0];
        }
        res.status(err.status || 400).json({ message });
    }
});

router.get('/', async(req, res) => {
    let searchedDest = req.query.dest;
    let ownerId = req.query.owner;
    const data = await req.storage.getAll(searchedDest, ownerId);
    res.json(data);
});

router.get('/:id', preload, async(req, res) => {
    const data = req.data.toObject();
    delete data.owner.hashedPassword;
    data.reviews = data.reviews.map(review => { 
        delete review.owner.hashedPassword;
        return review;
    });
    data.usersBooked = data.usersBooked.map(user => { 
        delete user.hashedPassword;
        return user;
    });
    data._ownerId = data.owner._id;
    res.json(data);
});

router.put('/:id', isAuth(), preload, isOwner(), async(req, res) => {
    const data = {
        name: req.body.name,
        description: req.body.description,
        destination: req.body.destination,
        imageUrl: req.body.imageUrl,
        price: Number(req.body.price || 0),
        freeRooms: Number(req.body.freeRooms || 0)
    }

    try {
        const result = await req.storage.edit(req.data, data);
        res.json(result);
    } catch (err) {
        let message = err.message;
        if(err.name == 'ValidationError'){
            message = parseMongooseError(err)[0];
        }
        res.status(err.status || 400).json({ message });
    }
});

router.delete('/:id', isAuth(), preload, isOwner(), async(req, res) => {
    try {
        await req.storage.deleteItem(req.params.id);
        res.json({});
    } catch (err) {
        res.status(err.status || 400).json({ message: err.message });
    }
});

router.post('/:id/reviews', isAuth(), preload, async(req, res) => {
    try {
        const hotel = req.data;
        const reviewData = {
            title: req.body.title,
            content: req.body.content,
            hotelId: hotel._id,
            owner: req.user._id
        }
        const review = await req.storage.createReview(reviewData);
        const updatedHotel = await req.storage.postReview(hotel, review);
        res.json(updatedHotel);
    } catch (err) {
        let message = err.message;
        if(err.name == 'ValidationError'){
            message = parseMongooseError(err)[0];
        }
        res.status(err.status || 400).json({ message });
    }
});

router.post('/:id/book', isAuth(), preload, notOwner(), async(req, res) => {
    try {
        const hotel = req.data;
        const updatedHotel = await req.storage.bookRoom(hotel, req.user._id);
        await addBookedHotel(req.user._id, updatedHotel._id);
        res.json(updatedHotel);
    } catch (err) {
        let message = err.message;
        if(err.name == 'ValidationError'){
            message = parseMongooseError(err)[0];
        }
        res.status(err.status || 400).json({ message });
    }
});

module.exports = router;