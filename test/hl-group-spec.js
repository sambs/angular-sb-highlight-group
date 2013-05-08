describe('Directive: hlGroup', function () {
  var el, scope;

  // load the tabs code
  beforeEach(module('HlGroup'));

  beforeEach(inject(function($rootScope, $compile) {
    el = angular.element(
      '<div hl-group>' +
        '<ul>' +
          '<li ng-repeat="choice in choices" ng-bind="choice" hl-item hl-select="onSelect(choice)" ng-class="{ highlightcls: highlighted }"></li>' +
        '</ul>' +
        '<span hl-item hl-select="otherOption()" ng-show="showOther">other option</span>' +
      '</div>'
    );

    scope = $rootScope;
    scope.choices = ['a', 'b'];
    scope.onSelect = jasmine.createSpy();
    scope.otherOption = jasmine.createSpy();
    scope.showOther = true;
    $compile(el)(scope);
    scope.$digest();
  }));


  var element;

  it('item scopes should change on mouseover', inject(function ($rootScope, $compile) {
    var li0 = angular.element(el.find('li')[0]);
    var li1 = angular.element(el.find('li')[1]);
    li0.trigger('mouseover');
    expect(li0.scope().highlighted).toBe(true);
    expect(li1.scope().highlighted).toBe(false);
  }));
});
