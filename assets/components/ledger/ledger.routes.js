app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('main');

    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: '/components/ledger/html/ledger.main.html',
            controller: 'MainCtrl'
        })
        .state('savings', {
            url: '/savings',
            templateUrl: '/components/ledger/html/ledger.savings.html',
            controller: 'SavingsCtrl'
        })        
        .state('categories', {
            url: '/categories',
            templateUrl: '/components/ledger/html/ledger.categories.html',
            controller: 'CategoryCtrl'
        })
        .state('analysis', {
            url: '/analysis',
            templateUrl: '/components/ledger/html/ledger.analysis.html',
            controller: 'AnalysisCtrl'
        });
}]);