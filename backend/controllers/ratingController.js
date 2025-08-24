const { Store, User, Rating } = require('../models');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');


exports.getRatingsCount = async (req, res) => {
  try {
    const count = await Rating.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.getAllRatings = async (req, res) => {
  const ratings = await Rating.findAll({
    include: [
      { model: Store, as: 'store', attributes: ['name'] },
      { model: User, as: 'user', attributes: ['name'] }
    ]
  });
  res.json(ratings);
};


exports.submitRating = async (req, res) => {
  try {
    const { userId, storeId, rating } = req.body;

    if (!userId || !storeId || !rating) {
      return res.status(400).json({ message: "userId, storeId, and rating are required." });
    }

    const existingRating = await Rating.findOne({ where: { user_id: userId, store_id: storeId } });

    if (existingRating) {

      existingRating.rating = rating;
      await existingRating.save();
      return res.json({ message: "Rating updated successfully.", rating: existingRating });
    } else {

      const newRating = await Rating.create({ user_id: userId, store_id: storeId, rating });
      return res.json({ message: "Rating submitted successfully.", rating: newRating });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.getRatingsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    });

    res.json({ ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getRatingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.findAll({
      where: { user_id: userId },
      include: [{ model: Store, as: 'store', attributes: ['id', 'name', 'address'] }],
    });

    res.json({ ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getStoreRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      attributes: [
        'store_id',
        [Rating.sequelize.fn('AVG', Rating.sequelize.col('rating')), 'averageRating'],
        [Rating.sequelize.fn('COUNT', Rating.sequelize.col('id')), 'ratingCount']
      ],
      group: ['store_id'],
      include: [{ model: Store, as: 'store', attributes: ['name', 'address'] }],
    });

    const formatted = ratings.map(r => ({
      storeId: r.store_id,
      storeName: r.store.name,
      address: r.store.address,
      averageRating: parseFloat(r.get('averageRating')).toFixed(1),
      ratingCount: parseInt(r.get('ratingCount')),
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




