const jwt = require('jsonwebtoken');
const captainModel = require('../models/captain.model');
const blacklistTokenModel = require('../models/blacklistToken.model')

module.exports.captainAuth = async (req, res, next) => {
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

        const captain = await captainModel.findById(decode.id);

        if(!captain) {
            return res.status(401).json({ message: 'Unauthorized'})

        }

        req.captain = captain;

        next();
    } catch (err) {

    }
}