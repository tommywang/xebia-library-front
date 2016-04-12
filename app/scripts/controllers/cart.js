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
    vm.selectedIsbns = books.getSelectedIsbns();
    vm.requestUrl = 'http://henri-potier.xebia.fr/books/'+vm.selectedIsbns.join()+'/commercialOffers';
    vm.selectedBooks = [];

    vm.getOffers = function (){
      $http({
        method: 'GET',
        url: vm.requestUrl
      }).then(function successCallback(response) {
        console.log(response.data);
        vm.offers = response.data.offers;
        console.log(vm.getBestTotalPrice(vm.offers));
      }, function errorCallback(response) {

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
        total +=  vm.books[index].price;
      });
      return total;
    };

    vm.getBestTotalPrice = function(offers){
       var total = vm.getTotal();
      var price1, price2, price3;
      console.log('The price is ' + total);
      console.log('offer is ', offers);
      angular.forEach(offers, function(offer, key) {
        if (offer.type === 'percentage'){
          price1 = total * (100 - offer.value) / 100;
          console.log('price1: ' + price1);
        }
        else if (offer.type === 'minus'){
          price2 = total - offer.value;
          console.log('price2: ' + price2);
        }
        else if (offer.type === 'slice'){
          price3 = total - offer.value * Math.floor(total / offer.sliceValue);
          console.log('price3: ' + price3);
        }
      });
      return Math.min(price1, price2, price3);
    };

    vm.init = function(){
      vm.getOffers();
      vm.getSelectedBooks();
    };

    vm.init();

    return vm;
  });
