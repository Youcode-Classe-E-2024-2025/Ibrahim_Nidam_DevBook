const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = 'duazidgSAHIH6576';

exports.register = (req, res) => {
    const {name, email, password} = req.body;

    bcrypt.hash(password,12,(err,hashedPass) => {
        if(err) return res.status(500).json({error: 'error hash pass'});

        User.create(name, email, hashedPass,(err,result) => {
            if(err) return res.status(500).json({error: 'user creation failed'});

            res.json({message: 'user registered'});
        });
    });
};

exports.login = (req, res) => {
    const {email, password} = req.body;

    User.findByemail(email, (err,result) => {
        if(err || result.length === 0){
            return res.status(401).json({error: 'invalid pass or email method'});
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err || !isMatch) {
                return res.status(401).json({error : 'invalid pass or email other', user,isMatch});
            }

            const token = jwt.sign({userId: user.id}, secretKey, {expiresIn: '1h'});

            res.json({message : 'logged in',user,token} , token);
        });
    });
};