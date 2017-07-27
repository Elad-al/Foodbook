(function () {
  'use strict';

  angular
    .module('follwes')
    .controller('FollwesListController', FollwesListController);

  FollwesListController.$inject = ['$scope', 'Socket','$state', '$window', 'Authentication', 'FollwesService'];

  function FollwesListController($scope, Socket, $state, $window, Authentication,FollwesService) {
    var vm = this;
    var user = Authentication.user;
    vm.users = FollwesService.query();
    vm.isFollwed = isFollwed;

    vm.follwes = vm.users;
    vm.userFollwes = user.follows;

    function isFollwed()
    {
      console.log('isFollwed::');
      return isUserFollwe($scope.follwe);
    }


    //Binding using socket.io
    Socket.on(user.username + 'follwe.update', function (follwsList) {
      vm.userFollwes = follwsList;
    });



    $scope.search = function() {
      var searchKey = $scope.searchKeyWord;
      if (searchKey) {
        $scope.resultMode = true;
        var users = vm.follwes;
        var searchResultByUserName;
        searchResultByUserName = searchByUsername(users, searchKey);
      
        //show results
        $scope.searchResults = searchResultByUserName;
      
        //clean search window
        $scope.searchKeyWord = null;
      }
      else {
      }
    };

    $scope.clearSearch = function()
    {
      $scope.resultMode = false;
    };


    // search tooles
    function searchByUsername(users,name) {
      var i;
      var ans = [];
      var arr;
      for (i = 0; i < users.length; i++)
      {  
        arr = users[i].username.split(' ');
        if (arr && arr.indexOf(name) !== -1) 
        {
          ans.push(users[i]);
        }
      }
      return ans;
    }

    function updateUserListFollweStatus()
    {
      var arr=[];
      for (var i = 0; i < vm.users.length; i++)
      {
        arr.push(vm.users[i]);
        if(isUserFollwe(vm.users[i]))
        {
          arr[i].isFollwe = true;        
        }
        else {
          arr[i].isFollwe = false;
        }
      }
      return arr;
    }

    function isUserFollwe(user)
    {
      var isFollwe = false;

      console.log(user);
      if (user)
      {
        var usersFollowed = vm.userFollwes;
        
        if (usersFollowed.indexOf(user.username) !== -1) {
          isFollwe = true;
        }
      }
      return isFollwe;
    }








  }
}());
