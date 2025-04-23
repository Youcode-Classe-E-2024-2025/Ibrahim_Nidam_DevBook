const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, bookController.getAllBooks);
router.post('/add', verifyToken, bookController.addBook);
router.put('/loan/:id', verifyToken, bookController.loanBook);
router.put('/return/:id', verifyToken, bookController.returnBook);
router.get('/getloans', verifyToken, bookController.LoanedBooks);

module.exports = router;