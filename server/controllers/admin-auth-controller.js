const ADMIN = require('../models/admin-model');
const jwt = require('jsonwebtoken');

exports.adminRegister = async (req, res) => {
    try {
        const { password, username } = req.body;

        let admin = await ADMIN.findOne({ username });
        if (admin) {
            return res.status(400).json({ message: 'Admin with this code already exists' });
        }
        admin = new ADMIN({ password, username });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { password, username } = req.body;
        let admin = await ADMIN.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'There is no user with this username exists' });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        await admin.save();

        const token = jwt.sign(
            { id: admin._id, username: admin.username, isAdmin: admin.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
