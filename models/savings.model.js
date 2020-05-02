// Define required packages
var restful = require('node-restful'),
    mongoose = restful.mongoose;

// Define our schema
var schema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    description: String,
    category: String,
    type: String,
    amount: Number,
    checkingId: mongoose.Schema.Types.ObjectId,
    balanceAsOfThisEntry: Number
});

// Return savings model
module.exports = restful.model('savings', schema);