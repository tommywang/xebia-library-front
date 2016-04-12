'use strict';

/**
 * @ngdoc function
 * @name xebiaLibraryFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xebiaLibraryFrontApp
 */
angular.module('xebiaLibraryFrontApp')
  .controller('MainCtrl', function ($scope, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $http({
      method: 'GET',
      url: 'http://henri-potier.xebia.fr/books'
    }).then(function successCallback(response) {
      console.log(response.data);
      // this callback will be called asynchronously
      // when the response is available
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });


  });
