'use strict';

/**
 * @ngdoc function
 * @name xebiaLibraryFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the xebiaLibraryFrontApp
 */
angular.module('xebiaLibraryFrontApp')
  .controller('CartCtrl', function ($scope, $http, $location, getSelectedBooks) {
    $scope.selectedIsbns = getSelectedBooks.getIsbns();
    $scope.requestUrl = 'http://henri-potier.xebia.fr/books/'+$scope.selectedIsbns.join()+'/commercialOffers';
    console.log($scope.requestUrl);

    $http({
      method: 'GET',
      url: $scope.requestUrl
    }).then(function successCallback(response) {
      console.log(response.data);
      $scope.books = response.data;
    }, function errorCallback(response) {

    });

  });
