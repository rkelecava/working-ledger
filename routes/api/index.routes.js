// Define dependencies
var express = require('express'),
    router = express.Router()
    Ledger = require('../../models/ledger.model'),
    Savings = require('../../models/savings.model'),
    Category = require('../../models/category.model');

// Get all ledger entries
router.get('/ledger', function (req, res, next) {
    Ledger.find(function (err, entries) {
        res.json(entries);
    });
});

// Add a new entry to the ledger
router.post('/ledger', function (req, res, next) {
    var balance = 0;
        console.log('balance beginning: ' + balance + '\n');
    Ledger.find(function (err, entries) {
        entries.forEach(function(element) {
            if (element.type === 'deposit') {
                balance += element.amount;
            } else {
                balance -= element.amount;
            }
        }, this);
        console.log('balance after total: ' + balance + '\n');
        var ledger = new Ledger(req.body);
        if (req.body.type === 'deposit') {
            ledger.balanceAsOfThisEntry = balance + ledger.amount;
        }
        if (req.body.type === 'withdrawl') {
            ledger.balanceAsOfThisEntry = balance - ledger.amount;
        }

        ledger.save(function (err, entry) {
            if (err) { return next(err); }
            res.json(entry);
        });
    });
});

// Returns the current running balance
router.get('/ledger/balance', function (req, res, next) {
    var balance = 0;
    Ledger.find(function (err, entries) {
        entries.forEach(function(element) {
            if (element.type === 'deposit') {
                balance += element.amount;
            } else {
                balance -= element.amount;
            }
        }, this);

        res.json({balance: balance});
    });
});

// Define entry parameter
router.param('entry', function (req, res, next, id) {
    Ledger.findById(id).exec(function (err, entry) {
        if (err) { return next(err); }
        if (!entry) { return next(new Error('can\'t find entry')); }
        req.entry = entry;
        return next();
    });
});

// Delete an entry from the ledger
router.delete('/ledger/:entry', function (req, res, next) {
    var amount = req.entry.amount;
    var type = req.entry.type;
    var date = req.entry.date;
    req.entry.remove(function (err) {
        if (err) { return next(err); }
        Ledger.find().sort({date: -1}).exec(function (err, entries) {
            if (err) { return next(err); }
            entries.forEach(function(element) {
                if (element.date >= date) {
                    if (type === 'deposit') {
                        element.balanceAsOfThisEntry -= amount;
                    } else {
                        element.balanceAsOfThisEntry += amount;
                    }
                    element.save(function (err) {
                        if (err) { return next(err); }
                    });
                }
            }, this);
            res.json(entries);
        });
    });
});

// Update an entry in the ledger
router.put('/ledger/:entry', function (req, res, next) {
    var diff = 0;
    req.entry.description = req.body.description;
    req.entry.category = req.body.category;
    req.entry.checkNo = req.body.checkNo;
    req.entry.save(function (err, entry) {
        res.json(entry);
    });
});

// Update categories
router.post('/ledger/updateCategories', function (req, res, next) {
    Ledger.find({category: req.body.name}).exec(function (err, entries) {
        if (err) { return next(err); }
        entries.forEach(function(element) {
            element.category = req.body.newName;
            element.save(function (err, data) {
                if (err) { return next(err); }
            });
        }, this);
        res.json(entries);
    });
});

// Get totals
router.post('/ledger/totals', function (req, res, next) {
    Ledger.find({
        $and:[
            {category: req.body.name},
            {date:{$gte: req.body.start}},
            {date:{$lte: req.body.end}}
            ]
        }).exec(function (err, entries) {
        if (err) { return next(err); }
        res.json(entries);
    });
});


///////////////////////
/*
    Category Routes
                    */
/////////////////////

// Get all categories
router.get('/category', function (req, res, next) {
    Category.find(function (err, categories) {
        if (err) { return next(err); }
        res.json(categories);
    });
});

// Add a new category
router.post('/category', function (req, res, next) {
    var category = new Category(req.body);
    category.save(function (err, element) {
        if (err) { return next(err); }
        res.json(element);
    });
});

// Define category parameter
router.param('category', function (req, res, next, id) {
    Category.findById(id).exec(function (err, element) {
        if (err) { return next(err); }
        if (!element) { return next(new Error('can\'t find category')); }

        req.category = element;
        next();
    });
});

// Get an individual category by ID
router.get('/category/:category', function (req, res, next) {
    res.json(req.category);
});

// Update a category
router.put('/category/:category', function (req, res, next) {
    req.category.name = req.body.name;
    req.category.save(function (err, element) {
        if (err) { return next(err); }
        res.json(element);
    });
});

// Delete a category
router.delete('/category/:category', function (req, res, next) {
    req.category.remove(function (err) {
        if (err) { return next(err); }
        Category.find(function (err, categories) {
            if (err) { return next(err); }
            res.json(categories);
        });
    });
});

// Check if category already exists
router.post('/category/exists', function (req, res, next) {
    Category.findOne({name: req.body.name}).exec(function (err, element) {
        if (element) { res.json({exists: true}); } else { res.json({exists: false}); }
    });
});

router.post('/category/findById', function (req, res, next) {
    Category.findById(req.body._id).exec(function (err, element) {
        if (element) { res.json(element); } else { res.status(400).json({message: 'Can\'t find that category'}); }
    });
});


//////////////////////////
/*
    Savings Routes
                    *////
/////////////////////////
// Get all savings entries
router.get('/savings', function (req, res, next) {
    Savings.find(function (err, entries) {
        if (err) { return next(err); }
        res.json(entries);
    });
});

// Get all savings date range
router.post('/savings/dateRange', function (req, res, next) {
   Savings.find({date: {$gte: req.body.start}, date: {$lte: req.body.end}}).exec(function (err, entries) {
       if (err) { next(err); }
       res.json(entries);
   });
});

// Add a new entry to the savings ledger
router.post('/savings', function (req, res, next) {
    var balance = 0;
    Savings.find(function (err, entries) {
        entries.forEach(function(element) {
            if (element.type === 'deposit') {
                balance += element.amount;
            } else {
                balance -= element.amount;
            }
        }, this);
        var savings = new Savings(req.body);
        if (req.body.type === 'deposit') {
            savings.balanceAsOfThisEntry = balance + savings.amount;
        }
        if (req.body.type === 'withdrawl') {
            savings.balanceAsOfThisEntry = balance - savings.amount;
        }

        savings.save(function (err, entry) {
            if (err) { return next(err); }
            res.json(entry);
        });
    });
});

// Delete 2
router.post('/savings/delete2', function (req, res, next) {
    var type = req.body.type;
    var amount = req.body.amount;
    Savings.findOne({checkingId: req.body.id}).exec(function (err, entry) {
        if (err) { return next(err); }
        if (!entry) { return next(new Error('No entry exists')); }
        var date = entry.date;
        entry.remove(function (err) {
            if (err) { return next(err); }
            Savings.find().sort({date: -1}).exec(function (err, entries) {
                if (err) { return next(err); }
                entries.forEach(function(element) {
                    if (element.date >= date) {
                        if (type === 'deposit') {
                            element.balanceAsOfThisEntry -= amount;
                        } else {
                            element.balanceAsOfThisEntry += amount;
                        }
                        element.save(function (err) {
                            if (err) { return next(err); }
                        });
                    }
                }, this);
                res.json(entries);
            });
        });
    });
});

// Returns the current running savings balance
router.get('/savings/balance', function (req, res, next) {
    var balance = 0;
    Savings.find(function (err, entries) {
        entries.forEach(function(element) {
            if (element.type === 'deposit') {
                balance += element.amount;
            } else {
                balance -= element.amount;
            }
        }, this);

        res.json({balance: balance});
    });
});

// Define entry parameter
router.param('savings_entry', function (req, res, next, id) {
    Savings.findById(id).exec(function (err, entry) {
        if (err) { return next(err); }
        if (!entry) { return next(new Error('can\'t find savings entry')); }
        req.entry = entry;
        return next();
    });
});

// Delete an entry from the savings ledger
router.delete('/savings/:savings_entry', function (req, res, next) {
    var amount = req.entry.amount;
    var type = req.entry.type;
    var date = req.entry.date;
    req.entry.remove(function (err) {
        if (err) { return next(err); }
        Savings.find().sort({date: -1}).exec(function (err, entries) {
            if (err) { return next(err); }
            entries.forEach(function(element) {
                if (element.date >= date) {
                    if (type === 'deposit') {
                        element.balanceAsOfThisEntry -= amount;
                    } else {
                        element.balanceAsOfThisEntry += amount;
                    }
                    element.save(function (err) {
                        if (err) { return next(err); }
                    });
                }
            }, this);
            res.json(entries);
        });
    });
});

// Update an entry in the savings ledger
router.put('/savings/:savings_entry', function (req, res, next) {
    var diff = 0;
    req.entry.description = req.body.description;
    req.entry.category = req.body.category;
    req.entry.save(function (err, entry) {
        res.json(entry);
    });
});


// Export api to router
module.exports = router;