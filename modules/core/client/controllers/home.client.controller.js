'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
      $scope.welcome_foodbook = true;
      // This provides Authentication context.
      $scope.authentication = Authentication;



      var i = 0;
      setInterval(function () {
        $scope.welcome_foodbook = i===1;
        console.log($scope.welcome_foodbook);
        i = i + 1;
        if (i === 3) {
          i = 0;
        }
      
      }, 2000);

    }


]);
