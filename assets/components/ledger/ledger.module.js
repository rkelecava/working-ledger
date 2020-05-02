var app = angular.module('ledger', ['ui.router', 'ui.bootstrap', 'xeditable']);

// Bootstrap theme for x-editable
app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});