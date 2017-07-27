'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', 'Socket','$stateParams', '$location', 'Authentication', 'Articles',
    function ($scope, Socket , $stateParams, $location, Authentication, Articles) {
      var vm = this;
      vm.searchKeyWord='';
      vm.searchResultByUserName=[];
      $scope.authentication=Authentication;

      //Binding using socket.io
      Socket.on('article.created', function (article) {
        $scope.articles.unshift(article);
      });

      Socket.on('article.delete', function (article) {
        for (var i = 0; i < $scope.articles.length; i++) {
          if (isArticlesEquals(article, $scope.articles[i])) {
            $scope.articles.splice(i, 1);
          }
        }
      });

      function isArticlesEquals(article1, article2) {
        var ans = false;
        if (article1.title.localeCompare(article2.title) === 0 /*&& article1.user.username.localeCompare(article2.user.username) === 0 *//*&& article1.created.dateString.toLocaleString().localeCompare(article2.name.created.dateString.toLocaleString()) === 0*/) {
          ans = true;
        }
        return ans;
      }

      function searchByArticlelUser(results,name) {
        var i;
        var ans = [];
        var arr;
        for (i = 0; i < results.length; i++)
        { 
          arr = results[i].user.displayName.split(' ');
          if (arr && arr.indexOf(name) !== -1) 
          {
            ans.push(results[i]);
          }
        }
        return ans;
      }
      function searchByArticlelTitle(results,name) {
        var i;
        var ans = [];
        
        for (i = 0; i < results.length; i++)
        { 
          var arr = results[i].title.split(' ');
          console.log('in search');
          if (arr && arr.indexOf(name) !== -1) 
          {
            ans.push(results[i]);
          }
        }
        return ans;
      }

      $scope.search = function() {
        
        var searchKey = $scope.vm.searchKeyWord;
        if (searchKey) {
          $scope.resultMode = true;
          var articles = $scope.articles;
          var searchResultByUserName, searchResultBytitle;
          searchResultByUserName = searchByArticlelUser(articles, searchKey);
          searchResultBytitle = searchByArticlelTitle(articles, searchKey);

          //show results
          console.log(searchResultBytitle);
          $scope.searchResults = searchResultByUserName.concat(searchResultBytitle);

          //clean search window
          $scope.vm.searchKeyWord = null;
        }
        else {
          console.log('not searching!');
        }
      };

      $scope.clearSearch = function()
      {
        $scope.resultMode = false;
      };


    // Create new Article
      $scope.create = function (isValid) {
        $scope.error = null;

        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'articleForm');
          return false;
        }

        // Create new Article object
        var article = new Articles({
          title: this.title,
          content: this.content
        });

        // Redirect after save
        article.$save(function (response) {
          $location.path('articles/' + response._id);
          
          // Clear form fields
          $scope.title = '';
          $scope.content = '';
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      // Remove existing Article
      $scope.remove = function (article) {
        if (article) {
          article.$remove();
      
          for (var i in $scope.articles) {
            if ($scope.articles[i] === article) {
              $scope.articles.splice(i, 1);
            }
          }
        } else {
          $scope.article.$remove(function () {
            $location.path('articles');
          });
        }
      };

      // Update existing Article
      $scope.update = function (isValid) {
        $scope.error = null;
      
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'articleForm');
      
          return false;
        }
      
        var article = $scope.article;
      
        article.$update(function () {
          $location.path('articles/' + article._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      // Find a list of Articles
      $scope.find = function () {
        $scope.articles = Articles.query();  
      };
      
      // Find existing Article
      $scope.findOne = function () {
        $scope.article = Articles.get({
          articleId: $stateParams.articleId
        });
      };
    }
]);
