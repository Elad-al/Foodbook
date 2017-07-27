(function () {
  'use strict';

  angular
    .module('follwes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('follwes', {
        abstract: true,
        url: '/follwes',
        template: '<ui-view/>'
      })
      .state('follwes.list', {
        url: '',
        templateUrl: 'modules/follwes/client/views/list-follwes.client.view.html',
        controller: 'FollwesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Follwes List'
        }
      })
      .state('follwes.create', {
        url: '/create',
        templateUrl: 'modules/follwes/client/views/form-follwe.client.view.html',
        controller: 'FollwesController',
        controllerAs: 'vm',
        resolve: {
          follweResolve: newFollwe
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Follwes Create'
        }
      })
      .state('follwes.edit', {
        url: '/:follweId/edit',
        templateUrl: 'modules/follwes/client/views/form-follwe.client.view.html',
        controller: 'FollwesController',
        controllerAs: 'vm',
        resolve: {
          follweResolve: getFollwe
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Follwe {{ follweResolve.name }}'
        }
      })
      .state('follwes.view', {
        url: '/:follweId',
        templateUrl: 'modules/follwes/client/views/view-follwe.client.view.html',
        controller: 'FollwesController',
        controllerAs: 'vm',
        resolve: {
          follweResolve: getFollwe
        },
        data: {
          pageTitle: 'Follwe {{ follweResolve.name }}'
        }
      });
  }

  getFollwe.$inject = ['$stateParams', 'FollwesService'];

  function getFollwe($stateParams, FollwesService) {
    return FollwesService.get({
      follweId: $stateParams.follweId
    }).$promise;
  }

  newFollwe.$inject = ['FollwesService'];

  function newFollwe(FollwesService) {
    return new FollwesService();
  }
}());
