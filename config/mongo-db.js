const mongoose = require('mongoose');
const config = require('./config');

const connection = () => {
    mongoose.connect(config.MONGODB + config.MONGODB_DATABASE);

    mongoose.connection.on('error' , (err) => {
         console.log('Mongoose default connection error: ' + err);
     });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose default connection disconnected');
    });

    mongoose.connection.on('open', () => {
        console.log('Mongoose default connection is open');
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose default connection disconnected through coe termination');
            process.exit(0);
        });
    });
}

module.exports = connection;