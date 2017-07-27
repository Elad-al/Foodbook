// Follwes service used to communicate Follwes REST endpoints
(function () {
  'use strict';

  angular
    .module('follwes')
    .factory('FollwesService', FollwesService);

  FollwesService.$inject = ['$resource'];

  function FollwesService($resource) {
    return $resource('api/follwes/:follweId', {
      follweId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
