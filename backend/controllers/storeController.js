const { Store, User, Rating } = require('../models');
const { Sequelize } = require('sequelize');
const { Op } = Sequelize;

exports.addStore = async (req, res) => {
  try {
    const { name, email, address, ownerName, rating } = req.body;
    

    const owner = await User.findOne({ where: { name: ownerName } });
    if (!owner) return res.status(400).json({ message: 'Owner not found' });


    const newStore = await Store.create({
      name,
      email,
      address,
      owner_id: owner.id,
    });


    if (rating) {
      await Rating.create({
        store_id: newStore.id,
        user_id: owner.id,  
        rating,
      });
    }

    res.status(201).json({ message: 'Store and rating added successfully', store: newStore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding store' });
  }
};





exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'address',
        'owner_id',
        [Sequelize.fn('AVG', Sequelize.col('ratings.rating')), 'averageRating'],
      ],
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: [], 
        },
        {
          model: User,
          as: 'owner', 
          attributes: ['id', 'name', 'email'], 
        },
      ],
      group: ['Store.id', 'owner.id'], 
    });

    res.json({ stores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};





exports.getStoresCount = async (req, res) => {
  try {
    const count = await Store.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};





exports.getStoreRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      attributes: [
        'store_id',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'ratingCount'],
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
      ],
      group: ['store_id', 'store.id'],
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name'],
        },
      ],
      order: [[Sequelize.literal('ratingCount'), 'DESC']],
      limit: 5,
    });

    const formatted = ratings.map(r => ({
      store: r.store.name,
      ratings: parseInt(r.get('ratingCount')),
      averageRating: parseFloat(r.get('averageRating')).toFixed(2),
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.getAllStoresWithRatings = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: [],
        },
      ],
      attributes: [
        'id', 'name', 'address',
        [Sequelize.fn('AVG', Sequelize.col('ratings.rating')), 'averageRating'],
        [Sequelize.fn('COUNT', Sequelize.col('ratings.id')), 'ratingCount']
      ],
      group: ['Store.id'],
    });

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




exports.getStoreByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    const stores = await Store.findAll({
      where: { owner_id: ownerId },
      attributes: ['id', 'name', 'address'],
    });

    if (!stores || stores.length === 0) {
      return res.status(404).json({ message: 'No stores found for this owner' });
    }

    res.json({ stores }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



Store.findAll({
  include: [
    { model: User, as: 'owner' },
    { model: Rating, as: 'ratings', include: [{ model: User, as: 'user' }] }
  ]
});
