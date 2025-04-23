const Category = require('../models/Category');

exports.getAllCategories = (req, res) => {
    Category.getCategories((err, results) => {
        if (err) return res.status(500).json({ error: 'Data category error' });
        res.json(results);
    });
};
