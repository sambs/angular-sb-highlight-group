angular.module('highlightGroup', [])

  .directive('hlGroup', ['$document', function ($document) {
    var items = [];
    var current;
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function (scope, elem, attrs) {
        var ctrl = this;

        ctrl.hlClass = attrs.hlClass || 'highlight';

        ctrl.addItem = function (item) {
          items.push(item); 
          items = items.sort(function (a, b) {
            return a.index - b.index;
          });
        };

        ctrl.removeItem = function (item) {
          items.slice(items.indexOf(item), 1); 
        };

        ctrl.highlightItem = function (item) {
          if (!ctrl.enabled) return;
          if (current) current.unhighlight();
          current = item;
          current.highlight();
        };

        ctrl.highlightNext = function () {
          if (!ctrl.enabled) return;
          var items = ctrl.getVisibleItems();
          if (current) {
            if (!items.length) {
              current.unhighlight();
            } else {
              var currentIndex = items.indexOf(current);
              if (currentIndex == -1) ctrl.highlightItem(items[0]);
              else if (currentIndex < items.length-1) {
                ctrl.highlightItem(items[currentIndex+1]);
              }
            }
          } else {
            if (items.length) ctrl.highlightItem(items[0]);
          }
        };

        ctrl.highlightPrevious = function () {
          if (!ctrl.enabled) return;
          var items = ctrl.getVisibleItems();
          if (current) {
            if (!items.length) {
              current.unhighlight();
            } else {
              var currentIndex = items.indexOf(current);
              if (currentIndex == -1) ctrl.highlightItem(items[items.length-1]);
              else if (currentIndex > 0) {
                ctrl.highlightItem(items[currentIndex-1]);
              }
            }
          } else {
            if (items.length) ctrl.highlightItem(items[items.length-1]);
          }
        };

        ctrl.select = function () {
          if (!ctrl.enabled) return;
          if (current && current.isVisible()) ctrl.selectItem(current);
        };

        ctrl.selectItem = function (item) {
          if (!ctrl.enabled) return;
          item.select();
        };

        ctrl.getVisibleItems = function () {
          return items.filter(function (item) {
            return item.isVisible();
          });
        };

        ctrl.enable = function () {
          ctrl.enabled = true;
          $document.on('keydown', ctrl.keyHandler);
          if (ctrl.autoselect) {
            var items = ctrl.getVisibleItems();
            if (items.length) this.highlightItem(items[0]);
          }
        };

        ctrl.disable = function () {
          ctrl.enabled = false;
          $document.off('keydown', ctrl.keyHandler);
          if (current) current.unhighlight();
        };

        ctrl.keyHandler = function (e) {
          switch (e.which) {
            case 38: // Up arrow
              e.preventDefault();
              ctrl.highlightPrevious();
              break;
            case 40: // Down arrow
              e.preventDefault();
              ctrl.highlightNext();
              break;
            case 13: // Return key
              e.preventDefault();
              ctrl.select();
          }
        };
      }], 
      link: function (scope, element, attrs, ctrl) {
        scope.$watch(attrs.hlDisabled, function (val) {
          if (!val || typeof val == 'undefined') ctrl.enable();
          else ctrl.disable();
        });
        ctrl.autoselect = 'hlAutoselect' in attrs;
      }
    };
  }])

  .directive('hlIndex', ['$animate', function ($animate) {
    return {
      restrict: 'A',
      require: ['^hlGroup', 'hlIndex'],
      controller: ['$scope', '$element', '$attrs', function (scope, elem, attrs) {
        this.select = function () {
          scope.$eval(attrs.hlSelect);
        };
      }], 
      link: function (scope, elem, attrs, ctrls) {
        var group = ctrls[0];
        var ctrl = ctrls[1];

        // Prepare the controller;
        ctrl.index = parseInt(attrs.hlIndex, 10);
        ctrl.highlight = function () {
          $animate.addClass(elem, group.hlClass);
        };
        ctrl.unhighlight = function () {
          $animate.removeClass(elem, group.hlClass);
        };
        ctrl.isVisible = function () {
          return !elem.hasClass('ng-hide');
        };

        // Add to group controller
        group.addItem(ctrl);

        // Setup event listeners
        elem.on('mouseover', function (e) {
          group.highlightItem(ctrl);
        });
        elem.on('click', function (e) {
          group.selectItem(ctrl);
        });

        // Cleanup
        scope.$on('$destroy', function (e) {
          group.removeItem(ctrl);
        });
      }
    };
  }]);
