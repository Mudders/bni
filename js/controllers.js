'use strict';


/* Controllers */
function HomeCtrl($scope,navSvc,$rootScope) {
    $rootScope.showSettings = false;
    $scope.slidePage = function (path,type) {
        navSvc.slidePage(path,type);
    };
    $scope.back = function () {
        navSvc.back();
    };
    $scope.changeSettings = function () {
        $rootScope.showSettings = true;
    };
    $scope.closeOverlay = function () {
        $rootScope.showSettings = false;
    };
}

function NotificationCtrl($scope) {
    $scope.alertNotify = function() {
        navigator.notification.alert("Sample Alert",function() {console.log("Alert success")},"My Alert","Close");
    };
    
    $scope.beepNotify = function() {
        navigator.notification.beep(1);
    };
    
    $scope.vibrateNotify = function() {
        navigator.notification.vibrate(3000);
    };
    
    $scope.confirmNotify = function() {
        navigator.notification.confirm("My Confirmation",function(){console.log("Confirm Success")},"Are you sure?",["Ok","Cancel"]);
    };
}

function GeolocationCtrl($scope,navSvc,$rootScope) {
    navigator.geolocation.getCurrentPosition(function(position) {
        $scope.position=position;
        $scope.$apply();
        },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });

    $scope.back = function () {
        navSvc.back();
    };
}

function AccelerCtrl($scope) {
    navigator.accelerometer.getCurrentAcceleration(function (acceleration) {
        $scope.acceleration  = acceleration;
        },function(e) { console.log("Error finding acceleration " + e) });
}

function DeviceCtrl($scope) {
    $scope.device = device;
}

function CompassCtrl($scope) {
    navigator.compass.getCurrentHeading(function (heading) {
        $scope.heading  = heading;
        $scope.$apply();
    },function(e) { console.log("Error finding compass " + e.code) });
}

function ContactsCtrl($scope) {
    $scope.find = function() {
        $scope.contacts = [];
        var options = new ContactFindOptions();
        //options.filter=""; //returns all results
        options.filter=$scope.searchTxt;
        options.multiple=true;
        var fields = ["displayName", "name", "phoneNumbers"];
        navigator.contacts.find(fields,function(contacts) {
            $scope.contacts=contacts;
            $scope.$apply();
        },function(e){console.log("Error finding contacts " + e.code)},options);
    }
}

function SearchIndustryCtrl($scope,navSvc,$rootScope) {


    $rootScope.showSettings = false;
    $scope.slidePage = function (path,type) {
        navSvc.slidePage(path,type);
    };
    $scope.back = function () {
        navSvc.back();
    };
    $scope.changeSettings = function () {
        $rootScope.showSettings = true;
    };
    $scope.closeOverlay = function () {
        $rootScope.showSettings = false;
    };

    $scope.find = function() {
      console.log("ddf " + $('#industry-id').val());
    }
}

function ChaptersCtrl($scope,navSvc,$rootScope) {
    $rootScope.showSettings = false;
    $scope.slidePage = function (path,type) {
        navSvc.slidePage(path,type);
    };
    $scope.back = function () {
        navSvc.back();
    };
    $scope.changeSettings = function () {
        $rootScope.showSettings = true;
    };
    $scope.closeOverlay = function () {
        $rootScope.showSettings = false;
    };

    webStore.findAllChapters(function(chapters) {
      $scope.chapters = [];
      $scope.chapters = chapters;
      $scope.$apply();
    });
}

function MembersCtrl($scope, $routeParams, navSvc,$rootScope) {
    $rootScope.showSettings = false;
    $scope.slidePage = function (path,type) {    console.log("MembersCtrl : " + path);
        navSvc.slidePage(path,type);
    };
    $scope.back = function () {
        navSvc.back();
    };
    $scope.changeSettings = function () {
        $rootScope.showSettings = true;
    };
    $scope.closeOverlay = function () {
        $rootScope.showSettings = false;
    };

    $scope.name = "MembersCtrl";
    $scope.params = $routeParams;

    webStore.findChapterMembersById($scope.params.id, function(members) {
      $scope.members = [];
      $scope.members = members;
      console.log("MembersCtrl : " + members.length);
      $scope.$apply();
    });

}

function MemberDetailCtrl($scope, $routeParams, navSvc,$rootScope) {
    $rootScope.showSettings = false;
    $scope.slidePage = function (path,type) {   console.log("MemberDetailCtrl : " + path);
        navSvc.slidePage(path,type);
    };
    $scope.back = function () {
        navSvc.back();
    };
    $scope.changeSettings = function () {
        $rootScope.showSettings = true;
    };
    $scope.closeOverlay = function () {
        $rootScope.showSettings = false;
    };

    $scope.name = "MemberDetailCtrl";
    $scope.params = $routeParams;

    webStore.findById($scope.params.id, function(member) {
      $scope.member = [];
      $scope.member = member;
      $scope.$apply();
    });


}

function AddToContactsCtrl($scope, $routeParams, navSvc,$rootScope, $route) {
    $rootScope.showSettings = false;
    $scope.slidePage = function (path,type) {  console.log("AddToContactsCtrl : " + path);
        navSvc.slidePage(path,type);
    };
    $scope.back = function () {
        navSvc.back();
    };
    $scope.changeSettings = function () {
        $rootScope.showSettings = true;
    };
    $scope.closeOverlay = function () {
        $rootScope.showSettings = false;
    };

    $scope.name = "AddToContactsCtrl";
    $scope.params = $routeParams;
    var obj = $route.current.params;
    for(var key in obj) {
      var value = obj[key];
      console.log("tt " + value + " -> " + obj[key]);
    }
    webStore.findById($scope.params.id, function(member) {
      // now to add this member to contacts and return something saying it was added successfully...
      $scope.member = [];
      $scope.member = member;
      $scope.$apply();
      addToContacts(member);
    });

}
function addToContacts(member) {
        console.log('addToContacts');
        if (!navigator.contacts) {
            //navigator.notification.alert("Sample Alert",function() {console.log("Alert success")},"My Alert","Close");
            return;
        }

        var contact = navigator.contacts.create({"displayName": member.name});
        //contact.displayName = displayName: member.name;
        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('work', member.phone, false);
        phoneNumbers[1] = new ContactField('mobile', member.mobile, true); // preferred number
        contact.phoneNumbers = phoneNumbers;
        var ContactOrganization  = [];
        ContactOrganization.name = member.company;
        contact.ContactOrganization = ContactOrganization;
        contact.save();
        console.log("addToContacts")
        app.showAlert(
            member.name + ' Saved',  // message
           'Done'                  // buttonName
        );

        return false;
    };

function MembersByIndustryCtrl($scope, $routeParams, navSvc,$rootScope) {
    $rootScope.showSettings = false;
    $scope.slidePage = function (path,type) {    console.log("MembersCtrl : " + path);
        navSvc.slidePage(path,type);
    };
    $scope.back = function () {
        navSvc.back();
    };
    $scope.changeSettings = function () {
        $rootScope.showSettings = true;
    };
    $scope.closeOverlay = function () {
        $rootScope.showSettings = false;
    };

    $scope.name = "MembersByIndustryCtrl";
    $scope.params = $routeParams;

    webStore.findMembersByIndustry($scope.params.id, function(members) {
      $scope.members = [];
      $scope.members = members;
      console.log("MembersByIndustryCtrl : " + members.length);
      $scope.$apply();
    });
}


                     