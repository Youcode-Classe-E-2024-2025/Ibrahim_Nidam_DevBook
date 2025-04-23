const connection = require('../../config/db');

class Book {
    static getAll(user_id, callback) {
        const sql = `
            SELECT b.*, 
                    EXISTS (
                        SELECT 1 FROM user_loans ul 
                        WHERE ul.book_id = b.id AND ul.user_id = ?
                    ) AS loaned_by_user
            FROM books b
        `;
        connection.query(sql, [user_id], callback);
    }
    

    static add(title, author, user_id, category_id, callback) {
        const sql = 'INSERT INTO books (title, author, user_id, category_id) VALUE (?,?,?,?)';
        connection.query(sql, [title, author, user_id, category_id], callback);
    }
    
    
    static delete(id, callback){
        const sql = 'DELETE FROM books where id = ?';
        connection.query(sql, [id], callback);
    }

    static deletePivot(id, callback){
        const sql = 'DELETE FROM user_loans WHERE book_id = ?';
        connection.query(sql, [id], callback);
    }

    static loan(id, user_id, callback) {
        const checkOwnerSQL = 'SELECT user_id FROM books WHERE id = ?';
        connection.query(checkOwnerSQL, [id], (err, results) => {
        if (err) return callback(err);
        
        if (results.length === 0) {
            return callback(new Error('Book not found'));
        }
        
        if (results[0].user_id === user_id) {
            return callback(new Error('You cannot loan your own book'));
        }
        
        const sql = 'UPDATE books SET is_loaned = TRUE WHERE id = ?';
        connection.query(sql, [id], (err, result) => {
            if (err) return callback(err);
            
            const loanSQL = 'INSERT INTO user_loans (user_id, book_id) VALUE (?,?)';
            connection.query(loanSQL, [user_id, id], callback);
        });
        });
    }

    static isloaned(id, callback) {
        const sql = 'SELECT is_loaned FROM books where id = ?';
        connection.query(sql, [id], callback);
    }

    static return(id, user_id, callback) {
        const sql = 'UPDATE books SET is_loaned = FALSE WHERE id = ? AND id IN (SELECT book_id FROM user_loans WHERE user_id = ?)';
        connection.query(sql, [id, user_id], callback);
    }

    static getLoanedBooks(user_id, callback) {
        const sql = `SELECT *, ul.loaned_at FROM books b
                    JOIN user_loans ul on b.id = ul.book_id
                    WHERE ul.user_id = ?`;
        connection.query(sql, [user_id], callback);
    }
}

module.exports = Book;