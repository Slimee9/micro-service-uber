const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blacklistTokenModel = require('../models/blacklistToken.model')

module.exports.userAuth = async (req, res, next) => {
    try {

        const token = req.cookies.token || 
                    req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json ({ message: 'Unauthorized'})
        }

        const isblackListed = await blacklistTokenModel.find({token});

        if(isblackListed.length){
            return res.status(401).json({ message: 'Unauthorized '})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decode.id);

        if(!user) {
            return res.status(401).json({ message: 'Unauthorized'})

        }

        req.user = user;

        next();
    } catch (err) {

    }
}