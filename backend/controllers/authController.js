
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const rounds = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password,address,role } = req.body || {};
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ error: 'name, email, password, address and role are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, rounds);
    const user = await User.create({ name, email, password: hash, address, role });

    const token = signToken({ id: user.id, email: user.email });
    return res.status(201).json({
      message: 'Signup successful',
      user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role },
      token,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: 'Server error', details: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user.id, email: user.email });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, 
      },
      role: user.role, 
      token,
    });
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: e.message });
  }
};


exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user?.id; 
    const { oldPassword, newPassword } = req.body || {};
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'oldPassword and newPassword are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'newPassword must be at least 8 characters' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(401).json({ error: 'Old password is incorrect' });

    const newHash = await bcrypt.hash(newPassword, rounds);
    await user.update({ password: newHash });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: e.message });
  }
};
