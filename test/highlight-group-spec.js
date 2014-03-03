describe('Directive: hlGroup', function () {
  var el, scope, document;

  // load the tabs code
  beforeEach(module('highlightGroup'));

  beforeEach(inject(function($rootScope, $compile, $document) {
    el = angular.element(
      '<div hl-group>' +
        '<ul>' +
          '<li ng-repeat="choice in choices" ng-bind="choice" hl-index="{{$index}}" hl-select="onSelect(choice)"></li>' +
        '</ul>' +
        '<span hl-index="100" hl-select="otherOption()" ng-show="showOther">other option</span>' +
      '</div>'
    );

    document = $document;
    scope = $rootScope;
    scope.choices = ['a', 'b'];
    scope.onSelect = jasmine.createSpy('onSelect');
    scope.otherOption = jasmine.createSpy('otherOption');
    scope.showOther = true;
    $compile(el)(scope);
    scope.$digest();
  }));

  it('item scopes should change on mouseover', inject(function ($rootScope, $compile) {
    var tEl;

    tEl = el.find('li').eq(0);
    tEl.trigger('mouseover');
    expect(tEl).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);

    tEl = el.find('li').eq(1);
    tEl.trigger('mouseover');
    expect(tEl).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
  
  it('should select first item on down arrow press', inject(function ($rootScope, $compile) {
    document.trigger($.Event('keydown', { which: 40 }));
    expect(el.find('li').first()).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));

  it('should select next item on down arrow press', inject(function ($rootScope, $compile) {
    el.find('li').eq(1).trigger('mouseover');
    document.trigger($.Event('keydown', { which: 40 }));
    expect(el.find('span')).toHaveClass('highlight');
  }));

  it('should remain on last item on down arrow press', inject(function ($rootScope, $compile) {
    el.find('span').trigger('mouseover');
    document.trigger($.Event('keydown', { which: 40 }));
    expect(el.find('span')).toHaveClass('highlight');
  }));
    
  it('shouldnt select hidden items on down arrow press', inject(function ($rootScope, $compile) {
    el.find('li').eq(1).trigger('mouseover');
    scope.$apply(function () { scope.showOther = false; });
    document.trigger($.Event('keydown', { which: 40 }));
    expect(el.find('li').eq(1)).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
   
  it('should select last item on up arrow press', inject(function ($rootScope, $compile) {
    document.trigger($.Event('keydown', { which: 38 }));
    expect(el.find('span')).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
    
  it('should select previous item on up arrow press', inject(function ($rootScope, $compile) {
    el.find('span').trigger('mouseover');
    document.trigger($.Event('keydown', { which: 38 }));
    expect(el.find('li').eq(1)).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
    
  it('should remain on first item on up arrow press', inject(function ($rootScope, $compile) {
    el.find('li').first().trigger('mouseover');
    document.trigger($.Event('keydown', { which: 38 }));
    expect(el.find('li').first()).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
  
  it('shouldnt select hidden items on up arrow press', inject(function ($rootScope, $compile) {
    scope.$apply(function () { scope.showOther = false; });
    document.trigger($.Event('keydown', { which: 38 }));
    expect(el.find('li').eq(1)).toHaveClass('highlight');
    expect(el.find('.highlight').length).toBe(1);
  }));
   
  it('should call hl-select on click', inject(function ($rootScope, $compile) {
    el.find('li').first().trigger('click');
    expect(scope.onSelect).toHaveBeenCalledWith('a');
    expect(scope.onSelect.calls.length).toBe(1);
  }));
  
  it('should call hl-select on return key press', inject(function ($rootScope, $compile) {
    el.find('li').eq(1).trigger('mouseover');
    document.trigger($.Event('keydown', { which: 13 }));
    expect(scope.onSelect).toHaveBeenCalledWith('b');
    expect(scope.onSelect.calls.length).toBe(1);
  }));
});
