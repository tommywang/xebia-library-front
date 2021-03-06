'use strict';

/**
 * @ngdoc function
 * @name xebiaLibraryFrontApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the xebiaLibraryFrontApp
 */
angular.module('xebiaLibraryFrontApp')
  .controller('CartCtrl', function ($http, $location, books, socket) {
    var vm = this;
    vm.books = books.getBooks();
    angular.forEach(vm.books, function(value, key) {
      value.number = 1
    });
    vm.selectedIsbns = books.getSelectedIsbns();
    vm.selectedBooks = [];
    vm.showResult = false;
    vm.finalPrice = 0;

    //Get offers for selected books
    vm.getOffers = function (){
      var isbns = [];
      angular.forEach(vm.books, function(book, key) {
        if (vm.selectedIsbns.indexOf(book.isbn) !== -1){
          //We can buy the same book more than once
          for (var i = 0; i < book.number; i++){
            isbns.push(book.isbn);
          }
        }
      });
      var requestUrl = 'http://henri-potier.xebia.fr/books/'+isbns.join()+'/commercialOffers';
      $http({
        method: 'GET',
        url: requestUrl
      }).then(function successCallback(response) {
        vm.offers = response.data.offers;
        vm.getBestTotalPrice(vm.offers);
        vm.showResult = true;
      }, function errorCallback(response) {
        $location.path("main");
      });
    };

    //Get selected books to show
    vm.getSelectedBooks = function(){
      vm.selectedBooks = [];
      angular.forEach(vm.selectedIsbns, function(value, key) {
        var index = _.findIndex(vm.books, function(o) { return o.isbn == value; });
        vm.selectedBooks.push(vm.books[index]);
      });
    };

    //Get to total price before the reduction
    vm.getTotal = function(){
      var total = 0;
      angular.forEach(vm.selectedIsbns, function(value, key) {
        var index = _.findIndex(vm.books, function(o) { return o.isbn == value; });
        total +=  vm.books[index].price * vm.books[index].number;
      });
      return total;
    };

    vm.getBestTotalPrice = function(offers){
      var total = vm.getTotal();
      var prices = [];
      angular.forEach(offers, function(offer, key) {
        if (offer.type === 'percentage'){
          prices.push(total * (100 - offer.value) / 100);
        }
        else if (offer.type === 'minus'){
          prices.push(total - offer.value);
        }
        else if (offer.type === 'slice'){
          prices.push(total - offer.value * Math.floor(total / offer.sliceValue));
        }
      });
      vm.finalPrice = _.min(prices);
    };

    vm.updateCart = function(){
      vm.getOffers();
    };

    vm.init = function(){
      vm.getOffers();
      vm.getSelectedBooks();
    };

    //This function are there just for update the server
    vm.finishShopping = function(){
      vm.getSelectedBooks;
      socket.emit('selectedBooks', vm.selectedBooks);
      $location.path("main");
    };

    vm.init();

    return vm;
  });
