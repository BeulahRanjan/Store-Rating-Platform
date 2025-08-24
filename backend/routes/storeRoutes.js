const express = require('express');
const router = express.Router();
const { addStore, getAllStores,getStoresCount, getStoreRatings, getAllStoresWithRatings,getStoreByOwner } = require('../controllers/storeController');

router.post('/addStore', addStore);
router.get('/getAllStores', getAllStores);
router.get('/getStoresCount', getStoresCount);
router.get('/getStoreRatings', getStoreRatings);
router.get('/getAllStoresWithRatings', getAllStoresWithRatings);
router.get('/getStoreByOwner/:ownerId', getStoreByOwner);

module.exports = router;
