(function () {
  'use strict';

  angular
    .module('recipes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Recipes',
      state: 'recipes.list',
      roles: ['*']
    });

    menuService.addMenuItem('topbar', {
      title: 'Add Recipes',
      state: 'recipes.create',
      roles: ['user']
    });

    //// Add the dropdown list item
    //menuService.addSubMenuItem('topbar', 'recipes', {
    //  title: 'List Recipes',
    //  state: 'recipes.list'
    //});

    //// Add the dropdown create item
    //menuService.addSubMenuItem('topbar', 'recipes', {
    //  title: 'Create Recipe',
    //  state: 'recipes.create',
    //  roles: ['user']
    //});


  }
}());
