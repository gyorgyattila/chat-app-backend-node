const environment = require('./environment');
//Import the mongoose module
var mongoose = require('mongoose');

var MONGO_DB;
var dockerDB = environment.DB_CONNECTION;
if ( dockerDB !== undefined ) {
  MONGO_DB = dockerDB.replace( 'tcp', 'mongodb' ) + '/chatapp';
}else {
  MONGO_DB = 'mongodb://172.31.46.21:27017/chat-app';
}

mongoose.connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose;