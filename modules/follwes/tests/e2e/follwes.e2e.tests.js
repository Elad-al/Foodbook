'use strict';

describe('Follwes E2E Tests:', function () {
  describe('Test Follwes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/follwes');
      expect(element.all(by.repeater('follwe in follwes')).count()).toEqual(0);
    });
  });
});
