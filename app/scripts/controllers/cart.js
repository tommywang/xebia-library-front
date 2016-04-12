'use strict';

/**
 * @ngdoc function
 * @name xebiaLibraryFrontApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the xebiaLibraryFrontApp
 */
angular.module('xebiaLibraryFrontApp')
  .controller('CartCtrl', function ($scope, $http, $location, books) {
    $scope.books = books.getBooks();
    $scope.selectedIsbns = books.getSelectedIsbns();
    $scope.requestUrl = 'http://henri-potier.xebia.fr/books/'+$scope.selectedIsbns.join()+'/commercialOffers';
    console.log($scope.requestUrl);

    $http({
      method: 'GET',
      url: $scope.requestUrl
    }).then(function successCallback(response) {
      console.log(response.data);
      $scope.offers = response.data.offers;
      console.log($scope.getBestTotalPrice($scope.offers));
    }, function errorCallback(response) {

    });

    $scope.getTotal = function(){
      var total = 0;
      angular.forEach($scope.selectedIsbns, function(value, key) {
        var index = _.findIndex($scope.books, function(o) { return o.isbn == value; });
        total +=  $scope.books[index].price;
      });
      return total;
    };



    $scope.getBestTotalPrice = function(offers){
       var total = $scope.getTotal();
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
    }
  });
