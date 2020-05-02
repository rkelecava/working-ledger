// Define required packages
var restful = require('node-restful'),
    mongoose = restful.mongoose;

// Define our schema
var schema = new mongoose.Schema({
    name: {type: String, lowercase: true, unique: true}
});

// Return category model
module.exports = restful.model('category', schema);