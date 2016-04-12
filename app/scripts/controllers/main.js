'use strict';

/**
 * @ngdoc function
 * @name xebiaLibraryFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xebiaLibraryFrontApp
 */
angular.module('xebiaLibraryFrontApp')
  .controller('MainCtrl', function ($scope, $http, $location, books) {
    $scope.books = [];
    $scope.selectedBooks = [];
    $scope.selected = {};
    $http({
      method: 'GET',
      url: 'http://henri-potier.xebia.fr/books'
    }).then(function successCallback(response) {
      console.log(response.data);
      $scope.books = response.data;
      books.setBooks($scope.books);
    }, function errorCallback(response) {

    });

    $scope.ShowSelected = function() {
      $scope.selectedBooks = [];
      angular.forEach($scope.selected, function(value, key) {
        $scope.selectedBooks.push(key);
      });
      books.setSelectedIsbns($scope.selectedBooks);
      $location.path("cart");
    };
  });
