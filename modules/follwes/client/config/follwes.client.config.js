(function () {
  'use strict';

  angular
    .module('follwes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Follwes',
      state: 'follwes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'follwes', {
      title: 'List Follwes',
      state: 'follwes.list',
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'follwes', {
      title: 'Create Follwe',
      state: 'follwes.create',
      roles: ['user']
    });
  }
}());
