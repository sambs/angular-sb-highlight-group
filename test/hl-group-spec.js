describe('Directive: hlGroup', function () {
  var el, scope;

  // load the tabs code
  beforeEach(module('HlGroup'));

  beforeEach(inject(function($rootScope, $compile) {
    el = angular.element(
      '<div hl-group>' +
        '<ul>' +
          '<li ng-repeat="choice in choices" ng-bind="choice" hl-item hl-select="onSelect(choice)"></li>' +
        '</ul>' +
        '<span hl-item hl-select="otherOption()" ng-show="showOther">other option</span>' +
      '</div>'
    );

    scope = $rootScope;
    scope.choices = ['a', 'b'];
    scope.onSelect = jasmine.createSpy('onSelect');
    scope.otherOption = jasmine.createSpy('otherOption');
    scope.showOther = true;
    $compile(el)(scope);
    scope.$digest();

    // We need to add the element to the dom because the directive uses visibility checks
    angular.element('body').append(el);
  }));

  it('item scopes should change on mouseover', inject(function ($rootScope, $compile) {
    var tEl;

    tEl = el.find('li').first();
    tEl.trigger('mouseover');
    expect(tEl).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);

    tEl = el.find('li').eq(1);
    tEl.trigger('mouseover');
    expect(tEl).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
  
  it('should select first item on down arrow press', inject(function ($rootScope, $compile) {
    angular.element('body').trigger($.Event('keydown', { which: 40 }));

    expect(el.find('li').first()).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
    
  it('should select next item on down arrow press', inject(function ($rootScope, $compile) {
    el.find('li').first().addClass('highlight');
    angular.element('body').trigger($.Event('keydown', { which: 40 }));

    expect(el.find('li').eq(1)).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);

    angular.element('body').trigger($.Event('keydown', { which: 40 }));

    expect(el.find('span')).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
    
  it('shouldnt change if last item already selected on down arrow press', inject(function ($rootScope, $compile) {
    el.find('span').addClass('highlight');
    angular.element('body').trigger($.Event('keydown', { which: 40 }));

    expect(el.find('span')).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
  
  it('shouldnt select hidden items on down arrow press', inject(function ($rootScope, $compile) {
    el.find('li').first().addClass('highlight');
    el.find('li').eq(1).hide();
    angular.element('body').trigger($.Event('keydown', { which: 40 }));

    expect(el.find('span')).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
   
  it('should select last item on up arrow press', inject(function ($rootScope, $compile) {
    angular.element('body').trigger($.Event('keydown', { which: 38 }));

    expect(el.find('span')).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
    
  it('should select previous item on down arrow press', inject(function ($rootScope, $compile) {
    el.find('span').addClass('highlight');
    angular.element('body').trigger($.Event('keydown', { which: 38 }));

    expect(el.find('li').eq(1)).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);

    angular.element('body').trigger($.Event('keydown', { which: 38 }));

    expect(el.find('li').first()).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
    
  it('shouldnt change if first item already selected on down arrow press', inject(function ($rootScope, $compile) {
    el.find('li').first().addClass('highlight');
    angular.element('body').trigger($.Event('keydown', { which: 38 }));

    expect(el.find('li').first()).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
  
  it('shouldnt select hidden items on down arrow press', inject(function ($rootScope, $compile) {
    el.find('span').addClass('highlight');
    el.find('li').eq(1).hide();
    angular.element('body').trigger($.Event('keydown', { which: 38 }));

    expect(el.find('li').first()).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
   
  it('should call hl-select on click', inject(function ($rootScope, $compile) {
    el.find('li').first()
      .addClass('highlight')
      .trigger('click');

    expect(scope.onSelect).toHaveBeenCalledWith('a');
    expect(scope.onSelect.calls.length).toBe(1);
  }));
  
  it('should call hl-select on return key press', inject(function ($rootScope, $compile) {
    el.find('li').first()
      .addClass('highlight');
    
    angular.element('body').trigger($.Event('keydown', { which: 13 }));

    expect(scope.onSelect).toHaveBeenCalledWith('a');
    expect(scope.onSelect.calls.length).toBe(1);
  }));
});
