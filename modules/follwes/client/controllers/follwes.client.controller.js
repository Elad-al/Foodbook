(function () {
  'use strict';

  // Follwes controller
  angular
    .module('follwes')
    .controller('FollwesController', FollwesController);

  FollwesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'follweResolve'];

  function FollwesController ($scope, $state, $window, Authentication, follwe) {
    var vm = this;
    var user = Authentication.user; 

    vm.authentication = Authentication;
    vm.follwe = follwe;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.isFollwe = isFollwe();
    
    function isFollwe()
    {
      var ans = false;
      if (user && user.follows)
      {
        var index =user.follows.indexOf(vm.follwe.username);
        ans = (index === -1); 
      }
      
      return ans;
    }






    // Remove existing Follwe
    function remove() {
      if (vm.isFollwe) {
        if($window.confirm('Are you sure you want to un-follow?'))
        {
          vm.isFollwe = !vm.isFollwe;
          vm.follwe.$save(successCallback, errorCallback);
        }
      }
      else
      {
        vm.isFollwe = !vm.isFollwe;
        vm.follwe.$save(successCallback, errorCallback);
      }
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Save Follwe    - NOT IN USE!!!!!!!!
    function save(isValid) {
         
      vm.isFollwe = !vm.isFollwe;
      //if (vm.follwe._id) {
      console.log('client::save followe sending update');
      vm.follwe.$save(successCallback, errorCallback);





      //}

      
      //if (!isValid) {
      //  $scope.$broadcast('show-errors-check-validity', 'vm.form.follweForm');
      //  return false;
      //}

      //// TODO: move create/update logic to service
      //if (vm.follwe._id) {
      //  vm.follwe.$update(successCallback, errorCallback);
      //} else {
      //  vm.follwe.$save(successCallback, errorCallback);
      //}

      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
