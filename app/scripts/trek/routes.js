'use strict';

var geotrekTreks = angular.module('geotrekTreks', ['pascalprecht.translate']);

geotrekTreks.config(function($stateProvider) {

    $stateProvider
    .state('home', {
        url: '',
        abstract: true,
        templateUrl: 'views/nav_trek_map.html',
        controller: 'TrekController',
        resolve: {
            treks: function(treksFactory) {
                return treksFactory.getTreks();
            },
            staticPages: function(staticPagesFactory) {
                return staticPagesFactory.getStaticPages();
            },
            // Resolve only to add "isDownloaded" property on each available trek
            // "isDownloaded = true" means that user has manually downloaded
            // precise map for this trek
            downloadedTreks: function($q, treks, mapFactory) {
                var promises = [],
                    treksList = treks.features;
                angular.forEach(treksList, function(trek) {
                    promises.push(mapFactory.hasTrekPreciseBackground(trek.id));
                });

                return $q.all(promises)
                .then(function(isDownloadedList) {
                    for(var i=0; i<isDownloadedList.length; i++) {
                        treksList[i]['tiles'] = {
                            isDownloaded: isDownloadedList[i]
                        };
                    }
                });
            }
        }
    })
    .state('home.trek', {
        url: '/trek',
        templateUrl : 'views/trek_list.html',
        controller: 'TrekListController'
    })
    .state('home.trek.detail', {
        url: '/trek-:trekId',
        controller: 'TrekDetailController',
        resolve: {
            trek: function(treksFactory, $stateParams) {
                return treksFactory.getTrek($stateParams.trekId);
            },
            pois: function(poisFactory, $stateParams) {
                return poisFactory.getPoisFromTrek($stateParams.trekId);
            },
            downloadedTrek: function($q, trek, mapFactory) {
                var promises = [];
                promises.push(mapFactory.hasTrekPreciseBackground(trek.id));

                return $q.all(promises)
                .then(function(isDownloadedList) {
                    for(var i=0; i<isDownloadedList.length; i++) {
                        trek['tiles'] = {
                            isDownloaded: isDownloadedList[i]
                        };
                    }
                });
            }
        }
    });
});
