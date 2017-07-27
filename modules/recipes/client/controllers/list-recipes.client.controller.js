(function () {
  'use strict';

  angular
    .module('recipes')
    .controller('RecipesListController', RecipesListController);

  RecipesListController.$inject = ['$scope','Socket','RecipesService'];

  function RecipesListController($scope,Socket, RecipesService) {
    var vm = this;


    Socket.on('recips.created', function (recips) {
      vm.recipes.unshift(recips);
    });


    Socket.on('recips.delete', function (recips) {
      for (var i = 0; i < vm.recipes.length; i++) {
        if (isRecpiesEquals(recips, vm.recipes[i])) {
          vm.recipes.splice(i, 1);
        }
      }
    });

    function isRecpiesEquals(recipe1, recipe2) {
      var ans = false;
      if (recipe1.name.localeCompare(recipe2.name) === 0 /*&& recipe1.user.username.localeCompare(recipe2.user.username) === 0 *//*&& recipe1.created.dateString.toLocaleString().localeCompare(recipe2.name.created.dateString.toLocaleString()) === 0*/) {
        ans = true;
      }
      return ans;
    }

    $scope.search = function() {
      var searchKey = $scope.searchKeyWord;
      if (searchKey) {
        $scope.resultMode = true;
        var recipes = vm.recipes;
        var searchResultByUserName, searchResultBytitle;
        searchResultByUserName = searchByRecpieslUser(recipes, searchKey);
        searchResultBytitle = searchByRecpieslTitle(recipes, searchKey);
      
        //show results
        $scope.searchResults = searchResultByUserName.concat(searchResultBytitle);
      
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

    vm.recipes = RecipesService.query();

    // search tooles
    function searchByRecpieslUser(results,name) {
      var i;
      var ans = [];
      var arr;
      for (i = 0; i < results.length; i++)
      {  
        arr = results[i].user.username.split(' ');
        if (arr && arr.indexOf(name) !== -1) 
        {
          ans.push(results[i]);
        }
      }
      return ans;
    }

    function searchByRecpieslTitle(results, name) {
      var i;
      var ans = [];
      
      for (i = 0; i < results.length; i++)
      { 
        var arr = results[i].name.split(' ');
        if (arr && arr.indexOf(name) !== -1) 
        {
          ans.push(results[i]);
        }
      }
      return ans;
    }


  }
}());
