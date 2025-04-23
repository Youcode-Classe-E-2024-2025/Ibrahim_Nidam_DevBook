const connection = require('../../config/db');


class Category {
    static getCategories(callback) {
        const sql = 'SELECT * FROM categories';
        connection.query(sql, callback);
    }
    
}

module.exports = Category;
