const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Store = require('../models/storeModel');
const Rating = require('../models/ratingModel');
const { Op } = require('sequelize');

const router = express.Router();
const rounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);


exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

   
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!['user', 'store_owner', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    
    const hashedPassword = await bcrypt.hash(password, rounds);

    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role
    });

    res.status(201).json({
      message: 'User added successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    let ratings = [];
    let averageRating = null;

    if (user.role === 'store_owner') {
     
      const stores = await Store.findAll({
        where: { owner_id: user.id },
        attributes: ['id', 'name']
      });

      const storeIds = stores.map(s => s.id);

      if (storeIds.length > 0) {
        
        ratings = await Rating.findAll({
          where: { store_id: { [Op.in]: storeIds } },
          include: [
            { model: Store, as: 'store', attributes: ['name'] },
            { model: User, as: 'user', attributes: ['name', 'email'] }
          ],
        });

        
        const total = ratings.reduce((sum, r) => sum + r.rating, 0);
        averageRating = ratings.length > 0 ? total / ratings.length : null;
      }
    }

    res.json({ user, ratings, averageRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUsersCount = async (req, res) => {
  try {
    const count = await User.count(); 
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


