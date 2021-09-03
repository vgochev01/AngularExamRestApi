const Hotel = require('../models/Hotel');

async function create(data){
    const hotel = new Hotel(data);
    await hotel.save();
    return hotel;
}

async function getAll(searchedDest, ownerId){
    let query = {};
    if(ownerId){
        query = { owner: ownerId };
    }
    if(searchedDest){
        query = { destination: { $regex: searchedDest, $options: 'i' } }
    }
    return Hotel.find(query).lean();
}

async function getById(id){
    try {
        const data = await Hotel.findById(id).populate('owner').populate({ path: 'reviews', populate: 'owner'}).populate('usersBooked');
        return data;
    } catch (err) {
        throw new Error('Database Error');
    }
}

async function edit(existing, updated) {
    Object.assign(existing, updated);
    await existing.save();
    return existing;
}

async function deleteItem(id){
    try {
        await Hotel.findByIdAndDelete(id);
    } catch (err) {
        throw new Error('No such id in database!');
    }
}

async function postReview(hotel, review) {
    try {
        hotel.reviews.push(review);
        await hotel.save();
        return await getById(hotel._id); // return hotel with populated reviews and their owners
    } catch (err) { 
        throw new Error('Error posting the review!');
    }
}

async function bookRoom(hotel, userId) {

    if(hotel.usersBooked.includes(userId)){
        throw new Error('You have already booked a room in this hotel!')
    }

    if(hotel.freeRooms < 1){
        throw new Error('No free rooms in this hotel!');
    }

    try {
        hotel.usersBooked.push(userId);
        hotel.freeRooms--;
        await hotel.save();
        return await getById(hotel._id); 
    } catch (err) {
        throw new Error('Error booking a room!');
    }
}

module.exports = {
    create,
    getAll,
    getById,
    edit,
    deleteItem,
    postReview,
    bookRoom
}