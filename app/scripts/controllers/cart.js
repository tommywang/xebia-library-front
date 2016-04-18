'use strict';

/**
 * @ngdoc function
 * @name xebiaLibraryFrontApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the xebiaLibraryFrontApp
 */
angular.module('xebiaLibraryFrontApp')
  .controller('CartCtrl', function ($http, $location, books) {
    var vm = this;
    vm.books = books.getBooks();
    angular.forEach(vm.books, function(value, key) {
      value.number = 1
    });
    vm.selectedIsbns = books.getSelectedIsbns();
    vm.selectedBooks = [];
    vm.showResult = false;
    vm.finalPrice = 0;

    vm.getOffers = function (){
      var isbns = [];
      angular.forEach(vm.books, function(book, key) {
        if (vm.selectedIsbns.indexOf(book.isbn) !== -1){
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
        console.log(response.data);
        vm.offers = response.data.offers;
        vm.getBestTotalPrice(vm.offers);
        vm.showResult = true;
      }, function errorCallback(response) {
        $location.path("main");
      });
    };

    vm.getSelectedBooks = function(){
      angular.forEach(vm.selectedIsbns, function(value, key) {
        var index = _.findIndex(vm.books, function(o) { return o.isbn == value; });
        vm.selectedBooks.push(vm.books[index]);
      });
    };

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
      console.log('The price is ' + total);
      console.log('offer is ', offers);
      angular.forEach(offers, function(offer, key) {
        if (offer.type === 'percentage'){
          prices.push(total * (100 - offer.value) / 100);
          console.log('price1: ' , total * (100 - offer.value) / 100);
        }
        else if (offer.type === 'minus'){
          prices.push(total - offer.value);
          console.log('price2: ' , total - offer.value);
        }
        else if (offer.type === 'slice'){
          prices.push(total - offer.value * Math.floor(total / offer.sliceValue));
          console.log('price3: ' , total - offer.value * Math.floor(total / offer.sliceValue));
        }
      });
      vm.finalPrice = _.min(prices);
      console.log('final price: ', vm.finalPrice);
    };

    vm.updateCart = function(){
      vm.getOffers();
    };

    vm.init = function(){
      vm.getOffers();
      vm.getSelectedBooks();
    };

    vm.init();

    return vm;
  });
