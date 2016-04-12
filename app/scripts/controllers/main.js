'use strict';

/**
 * @ngdoc function
 * @name xebiaLibraryFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xebiaLibraryFrontApp
 */
angular.module('xebiaLibraryFrontApp')
  .controller('MainCtrl', function ($http, $location, books) {
    var vm = this;
    vm.books = [];
    vm.selectedBooks = [];
    vm.selected = {};
    $http({
      method: 'GET',
      url: 'http://henri-potier.xebia.fr/books'
    }).then(function successCallback(response) {
      vm.books = response.data;
      books.setBooks(vm.books);
    }, function errorCallback(response) {

    });

    vm.ShowSelected = function() {
      vm.selectedBooks = [];
      angular.forEach(vm.selected, function(value, key) {
        vm.selectedBooks.push(key);
      });
      books.setSelectedIsbns(vm.selectedBooks);
      $location.path("cart");
    };

    return vm;
  });
