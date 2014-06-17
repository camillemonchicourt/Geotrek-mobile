'use strict';


angular.module('geotrekMobileControllers', ['leaflet-directive', 'angular-loading-bar'])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}])
.controller('AssetsController', function ($rootScope, $scope, $state, $window, $q, treksFilters, treksFactory, staticPagesFactory, cfpLoadingBar) {
    // Load everything in a promise
    $q.all([treksFactory.getTreks(), staticPagesFactory.getStaticPages()]).then(function(data) {
        // Save data to rootScope for later use
        console.log(data);

        $rootScope.treks = data[0];
        $rootScope.staticPages = data[1];

        cfpLoadingBar.complete();

        // Move on
        $state.go('home.trek');
    });
});
