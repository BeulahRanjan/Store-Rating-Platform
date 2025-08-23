const express = require('express');
const router = express.Router();
const { getRatingsCount, getAllRatings, getRatingsByStore, getRatingsByUser, getStoreRatings, submitRating }= require('../controllers/ratingController');

router.get('/getRatingsCount', getRatingsCount);
router.get('/getAllRatings', getAllRatings);
router.post('/submitRating', submitRating);
router.get('/getStoreRatings', getStoreRatings);
router.get('/getRatingsByStore/:storeId', getRatingsByStore);
router.get('/getRatingsByUser/:userId', getRatingsByUser);

module.exports = router;
