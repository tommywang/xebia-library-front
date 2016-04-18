'use strict';

/**
 * @ngdoc function
 * @name xebiaLibraryFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xebiaLibraryFrontApp
 */
angular.module('xebiaLibraryFrontApp')
  .controller('MainCtrl', function ($http, $location, books, socket) {
    var vm = this;
    vm.books = [];
    vm.selectedBooks = [];
    vm.selected = {};
    vm.booksLoaded = false;
    vm.showWarningText = false;

    //Get all books to show
    $http({
      method: 'GET',
      url: 'http://henri-potier.xebia.fr/books'
    }).then(function successCallback(response) {
      vm.books = response.data;
      books.setBooks(vm.books);
      vm.booksLoaded = true;
    }, function errorCallback(response) {
       console.log(response);
    });

    vm.saveSelectedBooks = function() {
      vm.selectedBooks = [];
      if (angular.element(".selected").length > 0){
        angular.forEach(angular.element(".selected"), function(value, key) {
          vm.selectedBooks.push(angular.element(value).data('isbn'));
        });
        books.setSelectedIsbns(vm.selectedBooks);
        $location.path("cart");
      }
      else{
        vm.showWarningText = true;
      }
    };

    vm.checkBook = function(book){
      book.selected = !book.selected;
      if (book.selected == true){
        vm.showWarningText = false;
      }
    };

    return vm;
  });
