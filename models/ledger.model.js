// Define required packages
var restful = require('node-restful'),
    mongoose = restful.mongoose;

// Define our schema
var schema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    description: String,
    category: String,
    checkNo: String,
    type: String,
    amount: Number,
    balanceAsOfThisEntry: Number
});

// Return ledger model
module.exports = restful.model('ledger', schema);