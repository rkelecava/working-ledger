// Checking service
app.factory('LEDGER', ['$http', function ($http) {
    var o = {};

    o.GETALL = function () {
        return $http.get('/api/ledger');
    };

    o.CURRENTBALANCE = function () {
        return $http.get('/api/ledger/balance');
    };

    o.UPDATE = function (entry) {
        return $http.put('/api/ledger/' + entry._id, entry);
    };

    o.DELETE = function (entry) {
        return $http.delete('/api/ledger/' + entry._id);
    };

    o.ADD = function (entry) {
        return $http.post('/api/ledger', entry);
    };

    o.RENAME_CATEGORY = function (category, newCategory) {
        var completeCategory = category;
        completeCategory.newName = newCategory.name;
        return $http.post('/api/ledger/updateCategories', completeCategory);
    };

    o.GETTOTALS = function (start, end, name) {
        var payload = {
            start: start,
            end: end,
            name: name
        };
        return $http.post('/api/ledger/totals', payload);
    };

    return o;
}]);

// Savings service
app.factory('SAVINGS', ['$http', function ($http) {
    var o = {};

    o.GETALL = function () {
        return $http.get('/api/savings');
    };

    o.GETALLDATERANGE = function (start, end) {
        var payload = {};
        payload.start = start;
        payload.end = end;
        return $http.post('/api/savings/dateRange', payload);
    };

    o.ADD = function (entry) {
        var payload = {};
        payload.description = entry.description;
        payload.category = entry.category;
        if (entry.category === 'transfer to savings') {
            payload.type = 'deposit';
        }
        if (entry.category === 'transfer to checking') {
            payload.type = 'withdrawl';
        }
        payload.checkingId = entry.checkingId;
        payload.amount = entry.amount;
        return $http.post('/api/savings', payload);
    };

    o.ADDINTEREST = function (entry) {
        var payload = {};
        payload.description = 'Interest paid';
        payload.category = 'interest (savings)';
        payload.type = 'deposit';
        payload.amount = entry.amount;
        return $http.post('/api/savings', payload);
    };

    o.DELETE = function (entry) {
        return $http.delete('/api/savings/' + entry._id);
    };

    o.DELETE2 = function (entry) {
        var payload = {};
        payload.id = entry._id;
        payload.amount = entry.amount;
        payload.date = entry.date;
        if (entry.type === 'deposit') {
            payload.type = 'withdrawl';
        }
        if (entry.type === 'withdrawl') {
            payload.type = 'deposit';
        }
        return $http.post('/api/savings/delete2', payload);
    };

    o.INITIALIZE = function (entry) {
        var payload = {};
        payload.description = 'Set start amount';
        payload.category = 'initialize';
        payload.amount = entry.amount;
        payload.type = 'deposit';
        return $http.post('/api/savings', payload);
    };

    return o;
}]);

// Category service
app.factory('CATEGORY', ['$http', function ($http) {
    var o = {};

    o.GETALL = function () {
        return $http.get('/api/category');
    };

    o.GET = function (category) {
        return $http.post('/api/category/findById', category);
    };

    o.EXISTS = function (category) {
        //console.log(name);
        return $http.post('/api/category/exists', category);
    };

    o.ADD = function (category) {
        return $http.post('/api/category', category);
    };

    o.DELETE = function (category) {
        return $http.delete('/api/category/' + category._id);
    };

    o.UPDATE = function (category) {
        return $http.put('/api/category/' + category._id, category);
    };

    return o;
}]);