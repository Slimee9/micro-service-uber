const captainModel = require('../models/captain.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');



module.exports.register = async (req, res) => {
    try {
        const {name, email, password} = req.body
        const captain = await captainModel.findOne({email});

        if(captain) {
            return res.status(400).json ({ message: 'captain already exists '})
        }

        const hash = await bcrypt.hash(password, 10);
        const newCaptain = new captainModel({ name, email, password: hash})

        await newCaptain.save();

        const token = jwt.sign({ id: newCaptain._id}, process.env.JWT_SECRET, {expiresIn: '1h'})

        res.cookie('token', token)



        res.send({ token, newCaptain})

    }catch(err) {
        res.status(500).json({ message: err.message})
    }
}

module.exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const captain = await captainModel
            .findOne({email})
            .select('+password');

        if(!captain){
            return res.status(400).json({ message: 'Invalid email or password'})
        }

        const isMatch = await bcrypt.compare(password, captain.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials'})
        }

        const token = jwt.sign({ id: captain._id}, process.env.JWT_SECRET, {expiresIn: '1h'})

        delete captain._doc.password

        res.cookie('token', token)

        res.send({token, captain})
    }catch(err){
        res.status(500).json({ message: err.message})
    }
}

module.exports.logout = async (req, res) => {
    try{

        const token = req.cookies.token;
        await blacklistTokenModel.create({ token });

        res.clearCookie('token');
        res.send({message: 'captain logged out successfully'})

    }catch(err){
        res.status(500).json({ message: err.message})
    }
}

module.exports.profile = async (req, res) => {
    try {
        res.send(req.captain)
    }catch(err){
        res.status(500).json({ message: err.message})
    }
}

module.exports.toggleAvailability = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.captain._id);
        captain.isAvailable = !captain.isAvailable;
        await captain.save();
        res.send(captain)
    }catch(err){
        res.status(500).json({message: err.message})
    
    }
}
