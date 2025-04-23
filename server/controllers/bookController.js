const Book = require('../models/Book');

exports.getAllBooks = (req, res) => {
    const userId = req.userId;
    Book.getAll(userId, (err, results) => {
        if (err) return res.status(500).json({ error: 'Data error' });
        res.json(results);
    });
};

exports.addBook = (req, res) => {
    const { title, author,category_id } = req.body;
    const userId = req.userId;
    
    Book.add(title, author, userId, category_id, (err, results) => {
        if (err) return res.status(500).json({ error: 'Could not add book' });
        res.json({ message: 'book added' });
    });
};

exports.loanBook = (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    Book.isloaned(id, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error during loan check' });
        
        if (result.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
        }
        
        if (result[0].is_loaned) {
        return res.status(400).json({ message: 'Book already loaned' });
        }
        
        Book.loan(id, userId, (err, results) => {
        if (err) {
            if (err.message === 'You cannot loan your own book') {
            return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Error during loan phase' });
        }
        
        res.json({ message: 'Book loaned with success' });
        });
    });
};

exports.returnBook = (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    
    Book.return(id, userId, (err, result) => {
        if (err) return res.status(500).json({ error: 'error during return' });
        
        if (result.affectedRows === 0) {
        return res.status(403).json({ error: 'you can\'t return the book' });
        }

        Book.deletePivot(id, (err,results) => {
            if(err) return res.status(500).json({error: 'error during pivot deletion'});
            
            res.json({ message: 'Book returned with success' });
        })
    });
};

exports.LoanedBooks = (req, res) => {
    const userId = req.userId;
    
    Book.getLoanedBooks(userId, (err, results) => {
        if (err) return res.status(500).json({ error: 'error during getting loaned books' });
        res.json(results);
    });
};