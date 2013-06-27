'use strict';

/* Directives */
angular.module('myApp.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
          elm.text(version);
}}])
  .directive('autoComplete', function(autoCompleteDataService) {
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
                    // elem is a jquery lite object if jquery is not present,
                    // but with jquery and jquery ui, it will be a full jquery object..
                    var industries = [];
                    webStore.findAllIndustries(function(industries) {
                        keywords = industries;
                        //alert(industries)
                        elem.autocomplete({
                            source: keywords, //from your service
                            minLength: 2
                        });
                    });

        }
    };
})

