describe('hlGroup directive', function () {
  var init, el, scope, document, sendKey;

  // load the tabs code
  beforeEach(module('sbHighlightGroup'));

  beforeEach(inject(function($rootScope, $compile, $document) {
    init = function (options) {
      el = angular.element(options.template);
      document = $document;
      scope = $rootScope;
      for (var key in options.scope) { scope[key] = options.scope[key]; }
      $compile(el)(scope);
      scope.$digest();

      sendKey = function (key) {
        var code = {
          down: 40,
          up: 38,
          return: 13
        }[key];
        if (!code) throw new Error('Unknown key: '+key);
        document.trigger($.Event('keydown', { which: code }));
      };
    };
  }));

  describe('without options', function () {

    beforeEach(function() {
      init({
        template: '<div sb-highlight-group>' +
          '<ul>' +
            '<li ng-repeat="choice in choices" ng-bind="choice" sb-highlight-index="{{$index}}" sb-highlight-select="onSelect(choice)"></li>' +
          '</ul>' +
          '<span sb-highlight-index="100" sb-highlight-select="otherOption()" ng-show="showOther">other option</span>' +
        '</div>', 
        scope: {
          choices: ['a', 'b'],
          onSelect: jasmine.createSpy('onSelect'),
          otherOption: jasmine.createSpy('otherOption'),
          showOther: true
        }
      });
    });

    it('should select item on mouseover', function () {
      var tEl;

      tEl = el.find('li').eq(0);
      tEl.trigger('mouseover');
      expect(tEl).toHaveClass('highlight');
      expect(el.find('.highlight').length).toBe(1);

      tEl = el.find('li').eq(1);
      tEl.trigger('mouseover');
      expect(tEl).toHaveClass('highlight');
      expect(el.find('.highlight').length).toBe(1);
    });
    
    it('should select first item on down arrow press', function () {
      sendKey('down');
      expect(el.find('li').first()).toHaveClass('highlight');
      expect(el.find('.highlight').length).toBe(1);
    });

    it('should select next item on down arrow press', function () {
      el.find('li').eq(1).trigger('mouseover');
      sendKey('down');
      expect(el.find('span')).toHaveClass('highlight');
    });

    it('should remain on last item on down arrow press', function () {
      el.find('span').trigger('mouseover');
      sendKey('down');
      expect(el.find('span')).toHaveClass('highlight');
    });
      
    it('shouldnt select hidden items on down arrow press', function () {
      el.find('li').eq(1).trigger('mouseover');
      scope.$apply(function () { scope.showOther = false; });
      sendKey('down');
      expect(el.find('li').eq(1)).toHaveClass('highlight');
      expect(el.find('.highlight').length).toBe(1);
    });
     
    it('should select last item on up arrow press', function () {
      sendKey('up');
      expect(el.find('span')).toHaveClass('highlight');
      expect(el.find('.highlight').length).toBe(1);
    });
      
    it('should select previous item on up arrow press', function () {
      el.find('span').trigger('mouseover');
      sendKey('up');
      expect(el.find('li').eq(1)).toHaveClass('highlight');
      expect(el.find('.highlight').length).toBe(1);
    });
      
    it('should remain on first item on up arrow press', function () {
      el.find('li').first().trigger('mouseover');
      sendKey('up');
      expect(el.find('li').first()).toHaveClass('highlight');
      expect(el.find('.highlight').length).toBe(1);
    });
    
    it('shouldnt select hidden items on up arrow press', function () {
      scope.$apply(function () { scope.showOther = false; });
      sendKey('up');
      expect(el.find('li').eq(1)).toHaveClass('highlight');
      expect(el.find('.highlight').length).toBe(1);
    });
     
    it('should evaluate select attr on click', function () {
      el.find('li').first().trigger('click');
      expect(scope.onSelect).toHaveBeenCalledWith('a');
      expect(scope.onSelect.calls.length).toBe(1);
    });
    
    it('should evaluate select attr on return key press', function () {
      el.find('li').eq(1).trigger('mouseover');
      sendKey('return');
      expect(scope.onSelect).toHaveBeenCalledWith('b');
      expect(scope.onSelect.calls.length).toBe(1);
    });

    it('shouldnt select previously highlighted item after removal', function () {
      el.find('li').eq(0).trigger('mouseover');
      scope.$apply(function () { scope.choices = ['c', 'd']; });
      sendKey('return');
      expect(scope.onSelect).not.toHaveBeenCalled();
    });
     
    it('should work after items have been changed', function () {
      scope.$apply(function () { scope.choices = ['c', 'd']; });
      sendKey('down');
      sendKey('return');
      expect(el.find('li').eq(0)).toHaveClass('highlight');
      expect(el.find('li').eq(0).text()).toEqual('c');
    });
  });

  describe('with disabled attr', function () {

    beforeEach(inject(function($rootScope, $compile, $document) {
      init({
        template:
        '<div sb-highlight-group sb-disabled="disabled">' +
          '<ul>' +
            '<li ng-repeat="choice in choices" ng-bind="choice" sb-highlight-index="{{$index}}" sb-highlight-select="onSelect(choice)"></li>' +
          '</ul>' +
          '<span sb-highlight-index="100" sb-highlight-select="otherOption()" ng-show="showOther">other option</span>' +
        '</div>', 
        scope: {
          disabled: true,
          choices: ['a', 'b'],
          onSelect: jasmine.createSpy('onSelect'),
          showOther: true
        }
      });
    }));

    it('should not respond to arrow keys when disabled', function () {
      sendKey('down');
      expect(el.find('.highlight').length).toBe(0);
      sendKey('up');
      expect(el.find('.highlight').length).toBe(0);
    });
    
    it('should not respond to mouseover when disabled', function () {
      el.find('li').eq(0).trigger('mouseover');
      expect(el.find('.highlight').length).toBe(0);
    });

    it('should not respond to click when disabled', function () {
      el.find('li').eq(0).trigger('click');
      expect(scope.onSelect).not.toHaveBeenCalled();
    });

    it('should respond to arrow keys when enabled', function () {
      scope.$apply(function () { scope.disabled = false; });
      sendKey('down');
      expect(el.find('.highlight').length).toBe(1);
    });
    
    it('should respond to mouseover when enabled', function () {
      scope.$apply(function () { scope.disabled = false; });
      el.find('li').eq(0).trigger('mouseover');
      expect(el.find('.highlight').length).toBe(1);
    });

    it('should respond to click when enabled', function () {
      scope.$apply(function () { scope.disabled = false; });
      el.find('li').eq(0).trigger('click');
      expect(scope.onSelect).toHaveBeenCalled();
    });
  });

  describe('with auto-highlight attr', function () {

    beforeEach(inject(function($rootScope, $compile, $document) {
      init({
        template: 
          '<div sb-highlight-group sb-disabled="disabled" sb-auto-highlight>' +
            '<ul>' +
              '<li ng-repeat="choice in choices" ng-bind="choice" sb-highlight-index="{{$index}}" sb-highlight-select="onSelect(choice)"></li>' +
            '</ul>' +
          '</div>', 
        scope: {
          disabled: false,
          choices: ['a', 'b']
        }
      });
    }));

    it('should highlight the first item when enabled', function () {
      expect(el.find('li').eq(0)).toHaveClass('highlight');
      scope.$apply(function () { scope.disabled = true; });
      expect(el.find('.highlight').length).toBe(0);
      scope.$apply(function () { scope.disabled = false; });
      expect(el.find('li').eq(0)).toHaveClass('highlight');
    });
  });
});
