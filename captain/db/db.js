const mongoose = require('mongoose');


function connect() {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('Captain service connected to mongoDB');
    }).catch(err => {
        console.log(err)
    });

}

module.exports =  connect;