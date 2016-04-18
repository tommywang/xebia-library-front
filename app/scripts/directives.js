app
  .directive('imageloaded', function () {
    return {
      restrict: 'A',
      scope: {imageloaded: '@'},
      link: function postLink(scope, element, attrs) {
        var image = new Image();
        image.onload = function(){ // always fires the event.
          element.attr('style', 'background-image: url(' + scope.imageloaded + ')');
        };
        image.src = attrs.imageloaded;
      }
    }
  })
  .directive('numberStepper', function() {
    return {
      restrict: "AE",
      require: "ngModel",
      scope: {
        min: "=",
        max: "=",
        ngModel: "="
      },
      template: '<div class="spinner-buttons input-group-btn"><button ng-click="decrement();" ng-disabled="isOverMin()"  class="btn spinner-down" type="button">- </button></div>' +
      '<input ng-model="ngModel" type="number" style="text-align: center;"  class="spinner-input form-control"/>' +
      '<div class="spinner-buttons input-group-btn"><button ng-click="increment();" ng-disabled="isOverMax()" class="btn spinner-down" type="button">+ </button></div>',
      link: function(scope, iElement, iAttrs, ngModelController) {

        scope.label = '';

        if (angular.isDefined(iAttrs.label)) {
          iAttrs.$observe('label', function(value) {
            scope.label = ' ' + value;
            ngModelController.$render();
          });
        }

        ngModelController.$render = function() {
          var valid = !(scope.isOverMin(true) || scope.isOverMax(true) || isNaN(ngModelController.$viewValue));
          if (!valid){
            ngModelController.$setViewValue(0);
          }
        };

        // when model change, cast to integer
        ngModelController.$formatters.push(function(value) {
          return parseInt(value, 10);
        });

        // when view change, cast to integer
        ngModelController.$parsers.push(function(value) {
          return parseInt(value, 10);
        });
        scope.$watch(function () {
          return ngModelController.$modelValue;
        }, function(newValue,oldval) {
          if(newValue!==oldval){
            scope.$eval(iAttrs.ngChange);
          }
        });

        function updateModel(offset) {

          // update the model, call $parsers pipeline...
          ngModelController.$setViewValue(ngModelController.$viewValue + offset);

          //// update the local view
          ngModelController.$render();
        }

        scope.isOverMin = function(strict) {
          var offset = strict?0:1;
          return (angular.isDefined(scope.min) && (ngModelController.$viewValue - offset) < parseInt(scope.min, 10));
        };
        scope.isOverMax = function(strict) {
          var offset = strict?0:1;
          return (angular.isDefined(scope.max) && (ngModelController.$viewValue + offset) > parseInt(scope.max, 10));
        };


        // update the value when user clicks the buttons
        scope.increment = function() {
          updateModel(+1);
        };
        scope.decrement = function() {
          updateModel(-1);
        };

        // watch out min/max and recheck validity when they change
        scope.$watch('min+max', function() {
          //checkValidity();
        });
      }
    }
  });
;