(function () {
  'use strict';

  describe('Follwes Route Tests', function () {
    // Initialize global variables
    var $scope,
      FollwesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FollwesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FollwesService = _FollwesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('follwes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/follwes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FollwesController,
          mockFollwe;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('follwes.view');
          $templateCache.put('modules/follwes/client/views/view-follwe.client.view.html', '');

          // create mock Follwe
          mockFollwe = new FollwesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Follwe Name'
          });

          // Initialize Controller
          FollwesController = $controller('FollwesController as vm', {
            $scope: $scope,
            follweResolve: mockFollwe
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:follweId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.follweResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            follweId: 1
          })).toEqual('/follwes/1');
        }));

        it('should attach an Follwe to the controller scope', function () {
          expect($scope.vm.follwe._id).toBe(mockFollwe._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/follwes/client/views/view-follwe.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FollwesController,
          mockFollwe;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('follwes.create');
          $templateCache.put('modules/follwes/client/views/form-follwe.client.view.html', '');

          // create mock Follwe
          mockFollwe = new FollwesService();

          // Initialize Controller
          FollwesController = $controller('FollwesController as vm', {
            $scope: $scope,
            follweResolve: mockFollwe
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.follweResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/follwes/create');
        }));

        it('should attach an Follwe to the controller scope', function () {
          expect($scope.vm.follwe._id).toBe(mockFollwe._id);
          expect($scope.vm.follwe._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/follwes/client/views/form-follwe.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FollwesController,
          mockFollwe;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('follwes.edit');
          $templateCache.put('modules/follwes/client/views/form-follwe.client.view.html', '');

          // create mock Follwe
          mockFollwe = new FollwesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Follwe Name'
          });

          // Initialize Controller
          FollwesController = $controller('FollwesController as vm', {
            $scope: $scope,
            follweResolve: mockFollwe
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:follweId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.follweResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            follweId: 1
          })).toEqual('/follwes/1/edit');
        }));

        it('should attach an Follwe to the controller scope', function () {
          expect($scope.vm.follwe._id).toBe(mockFollwe._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/follwes/client/views/form-follwe.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
