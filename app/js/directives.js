/**
 * Created by thiago on 17/10/15.
 */
var ukeSongbookDirectives = angular.module('ukeSongbookDirectives', []);

ukeSongbookDirectives.directive('topbarDirective', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'partials/topbar.html'
    };
}]);

ukeSongbookDirectives.directive('footerDirective', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'partials/footer.html'
    };
}]);

/**
 * Form attribute directives
 */
ukeSongbookDirectives.directive('numbersOnlyDirective', function(){
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input.
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue === undefined) return '';
                inputValue = String(inputValue);
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput!=inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});



ukeSongbookDirectives.directive('focusMeDirective', ['$timeout', function ($timeout) {
    return {
        scope: {
            trigger: '=focusMeDirective'
        },
        link: function (scope, element) {
            scope.$watch('trigger', function (value) {
                console.log(value);
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };

}]);


