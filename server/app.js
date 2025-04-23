const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('../config/db');
const path = require('path');

const app = express();
const PORT = 3000;

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');


app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended : true }));

app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/books', bookRoutes);
app.use('/categories', categoryRoutes);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req,res)=>{
    res.send('connected in app');
});

app.listen(PORT, () => {
    console.log('server running');
});