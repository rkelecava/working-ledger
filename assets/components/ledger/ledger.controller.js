// Checking Controller
app.controller('MainCtrl', ['$scope', '$rootScope', 'LEDGER', 'CATEGORY', 'SAVINGS', function ($scope, $rootScope, LEDGER, CATEGORY, SAVINGS) {

    // Type options
    $scope.typeOptions = ['type', 'deposit', 'withdrawl'];

    // Alerts
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    // Check if dollar amount is positive or negative
    $scope.positiveBalance = function (amount) {
        if (amount <= 0) {
            return false;
        } else {
            return true;
        }
    };

    // Function to update existing entry
    $scope.updateEntry = function (entry) {
        LEDGER.UPDATE(entry).then(function successCallback(res) {
            init();
        }, function errorCallback(res) {
            console.log(res.data.status);
        });

    };

    // Function to delete an entry
    $scope.delete = function (entry) {
        LEDGER.DELETE(entry).then(function successCallback(res) {
            LEDGER.CURRENTBALANCE().then(function successCallback(res) {
                $rootScope.currentBalance = res.data.balance;
                if (entry.category === 'transfer to savings' || entry.category === 'transfer to checking') {
                    SAVINGS.DELETE2(entry).then(function (successCallback) {
                        init();
                    }, function (errorCallback) {
                        console.log(res.data.status);
                    });
                } else {
                    init();
                }
            }, function errorCallback(res) {
                console.log(res.data.status);
            });
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    };

    // Function to add a new entry
    $scope.add = function () {
        if (!$scope.newEntry.category || $scope.newEntry.category === '' || $scope.newEntry.category === 'category') {
            $scope.alerts.push({type: 'danger', msg: 'You must select a category for this entry'});
            return;
        }
        if (!$scope.newEntry.type || $scope.newEntry.type === '' || $scope.newEntry.type === 'type') {
            $scope.alerts.push({type: 'danger', msg: 'You must select a type for this entry'});
            return;
        }
        LEDGER.ADD($scope.newEntry).then(function successCallback(res) {
            $scope.newEntry.checkingId = res.data._id;
            LEDGER.CURRENTBALANCE().then(function successCallback(res) {
                $rootScope.currentBalance = res.data.balance;
                if ($scope.newEntry.category === 'transfer to savings') {
                    SAVINGS.ADD($scope.newEntry).then(function (successCallback) {
                        init();
                    }, function (errorCallback) {
                        console.log(res.data.status);
                    });
                } else if ($scope.newEntry.category === 'transfer to checking') {
                    SAVINGS.ADD($scope.newEntry).then(function (successCallback) {
                        init();
                    }, function (errorCallback) {
                        console.log(res.data.status);
                    });
                } else {
                    init();
                }
            }, function errorCallback(res) {
                console.log(res.data.status);
            });
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    };
    
    // Run on page load
    function init() {
        // Get all entries
        LEDGER.GETALL().then(function successCallback(res) {
            $scope.entries = res.data;
            if (res.data.length > 0) {
                $scope.entriesExist = true;
            } else {
                $scope.entriesExist = false;
            }
        }, function errorCallback(res) {
            console.log(res.data.status);
        });

        // Get all categories
        CATEGORY.GETALL().then(function successCallback(res) {
            // Category options
            $scope.categoryOptions = [];
            res.data.forEach(function(element) {
                $scope.categoryOptions.push(element.name);
            }, this);
            $scope.categoryOptions.push('category');
            $scope.categoryOptions.push('transfer to savings');
            $scope.categoryOptions.push('transfer to checking');
            // Sort category options
            $scope.categoryOptions = $scope.categoryOptions.sort();
        }, function errorCallback(res) {
            console.log(res.data.status);
        });

        // Initialize new entry fields
        $scope.newEntry = {
            category: 'category',
            type: 'type'
        };

        
    }

    init();
}]);


// Jumbotron Controller
app.controller('jumboCtrl', ['$scope', '$rootScope', 'LEDGER', function ($scope, $rootScope, LEDGER) {
    // Check if dollar amount is positive or negative
    $scope.positiveBalance = function (amount) {
        if (amount <= 0) {
            return false;
        } else {
            return true;
        }
    };
    function init() {
        // Get the current running balance
        LEDGER.CURRENTBALANCE().then(function successCallback(res) {
            $rootScope.currentBalance = res.data.balance;
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
        
    }

    init();
}]);


// Tabs Controller
app.controller('tabsCtrl', ['$scope', '$state', '$window', function ($scope, $state, $window) {
    $scope.changeState = function (state) {
        $state.go(state);
    };

    $scope.tabs = [
        { title:'Checking', state:'main'},
        { title:'Savings', state:'savings'},
        { title:'Categories', state:'categories'},
        { title:'Analysis', state:'analysis'}
    ];

}]);

// Category Controller
app.controller('CategoryCtrl', ['$scope', 'CATEGORY', 'LEDGER', function ($scope, CATEGORY, LEDGER) {
    // Update category
    $scope.updateCategory = function (category) {
        CATEGORY.GET(category).then(function successCallback(res) {
            LEDGER.RENAME_CATEGORY(res.data, category).then(function successCallback(res) {
                CATEGORY.UPDATE(category).then(function successCallback(res) {
                    init();
                }, function errorCallback(res) {
                    console.log(res.data.status);
                });
            }, function errorCallback(res) {
                console.log(res.data.status);
            });
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    };

    // Function to delete a category
    $scope.delete = function (entry) {
        CATEGORY.DELETE(entry).then(function successCallback(res) {
            init();
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    };

    // Function to add a new entry
    $scope.add = function () {
        if (!$scope.category.name || $scope.category.name === '') {
            $scope.alerts.push({type: 'danger', msg: 'You cannot add a blank category'});
            return;
        }

        CATEGORY.EXISTS($scope.category).then(function successCallback(res) {
            if (res.data.exists === true) {
                $scope.alerts.push({type: 'danger', msg: 'You cannot add duplicate category'});
                return;                
            } else {
                CATEGORY.ADD($scope.category).then(function successCallback(res) {
                    init();
                }, function errorCallback(res) {
                    console.log(res.data.status);
                });
            }
        }, function errorCallback(res) {    
            console.log(res.data.status);
        });

    };

    // Close alerts
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    function init() {
        // Get the current categories
        CATEGORY.GETALL().then(function successCallback(res) {
            $scope.categories = res.data;
            if (res.data.length > 0) {
                $scope.categoriesExist = true;
            } else {
                $scope.categoriesExist = false;
            }
        }, function errorCallback(res) {
            console.log(res.data.status);
        });

        $scope.alerts = [];

        $scope.category = {};
    }

    init();
}]);

// Analysis Controller
app.controller('AnalysisCtrl', ['$scope', 'CATEGORY', 'LEDGER', 'SAVINGS', function ($scope, CATEGORY, LEDGER, SAVINGS) {

    $scope.getTotal = function (transactions) {
        var total = 0;
        transactions.forEach(function(element) {
            total += element.amount;
        }, this);

        return total;
    };

    $scope.getSavingsTotal = function (transactions) {
        var total = 0;

        if (transactions) {
            transactions.forEach(function(element) {
                if (element.category !== 'initialize') {
                    if (element.type === 'deposit') {
                        total += element.amount;
                    } else {
                        total -= element.amount;
                    }
                }
            }, this);
        }

        return total;
    };

    $scope.getAvg = function (transactions) {
        if (transactions) {
            var total = $scope.getTotal(transactions);
            var length = transactions.length;
            var avg = total / length;
        }

        return avg;
    };


    function init() {
        CATEGORY.GETALL().then(function successCallback(res) {
            $scope.categories = res.data;
            $scope.completeCategories = [];
            $scope.today = new Date();
            $scope.lastYear = new Date();
            $scope.lastYear.setDate($scope.today.getDate() - 365);
            SAVINGS.GETALLDATERANGE($scope.lastYear, $scope.today).then(function successCallback(res) {
                $scope.savings = res.data;
            }, function errorCallback(res) {
                console.log(res.data.status);
            });
            $scope.categories.forEach(function(element) {
                var cat = element;
                LEDGER.GETTOTALS($scope.lastYear, $scope.today, element.name).then(function successCallback(res) {
                    console.log(res.data);
                    cat.transactions = res.data;
                    $scope.completeCategories.push(cat);
                    $scope.numberOfRows = $scope.completeCategories.length / 4;
                    $scope.numberOfRows = Math.ceil($scope.numberOfRows);
                    $scope.numberOfRows--;
                    $scope.rowsArray = [];
                    while ($scope.numberOfRows > -1) {
                        $scope.rowsArray.push($scope.numberOfRows);
                        $scope.numberOfRows--;
                    }
                    $scope.rowsArray.sort();
                }, function errorCallback(res) {
                    console.log(res.data.status);
                });
            }, this);
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    }

    init();
}]);

// Savings Controller
app.controller('SavingsCtrl', ['$scope', 'SAVINGS', function ($scope, SAVINGS) {

    // Alerts
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    // Check if dollar amount is positive or negative
    $scope.positiveBalance = function (amount) {
        if (amount <= 0) {
            return false;
        } else {
            return true;
        }
    };

    $scope.initialize = function () {
        SAVINGS.INITIALIZE($scope.initialize).then(function successCallback(res) {
            init();
        }, function (errorCallback) {
            console.log(res.data.status);
        });
    }

    // Add interest to savings
    $scope.addInterest = function () {
        SAVINGS.ADDINTEREST($scope.newEntry).then(function successCallback(res) {
            init();
        }, function (errorCallback) {
            console.log(res.data.status);
        });
    };

    // Function to delete a savings entry
    $scope.delete = function (entry) {
        SAVINGS.DELETE(entry).then(function successCallback(res) {
            init();
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
    };

    // Run on page load
    function init() {
        // Get all savings entries
        SAVINGS.GETALL().then(function successCallback(res) {
            $scope.savings = res.data;
            if (res.data.length > 0) {
                $scope.entriesExist = true;
            } else {
                $scope.entriesExist = false;
            }
        }, function errorCallback(res) {
            console.log(res.data.status);
        });
       
    }

    init();
}]);