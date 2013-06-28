'use strict';

/* Directives */
angular.module('myApp.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
          elm.text(version);
}}])
  .directive('autoComplete',  ["$location", function($location) {
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
                    // elem is a jquery lite object if jquery is not present,
                    // but with jquery and jquery ui, it will be a full jquery object..

                    webStore.findAllIndustries(function(industries) {
                        keywords = industries;
                        //alert(industries)
                        elem.autocomplete({
                            source: industries, //from your service
                            minLength: 2,
                            focus: function( event, ui ) {
                              elem.val( ui.item.label );
                              return false;
                            },select: function(event, ui) {
                                // got our selected item - now to somehow redirect the page to this items list of people...
                                elem.val( ui.item.label );
                                $( "#industry-id" ).val(ui.item.value );
                                var industryID = ui.item.value;
                                // redirect this to the MembersByIndustryView
                                //scope.$apply(function() { $location.path("/view6/" + industryID); });

                                return false;
                              },
                        });
                    });

        }
    };
}])

