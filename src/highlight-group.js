/* jshint browser: true, es3: true */

angular.module('sbHighlightGroup', [])

  .directive('sbHighlightGroup', ['$document', function ($document) {

    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function (scope, elem, attrs) {
        var ctrl = this;

        ctrl.items = [];

        ctrl.highlightClass = attrs.sbHighlightClass || 'highlight';

        ctrl.addItem = function (item) {
          ctrl.items.push(item); 
          ctrl.items = ctrl.items.sort(function (a, b) {
            return a.index - b.index;
          });
          if (ctrl.autoHighlight) ctrl.highlightFirst();
        };

        ctrl.removeItem = function (item) {
          ctrl.items.splice(ctrl.items.indexOf(item), 1);
          if (item === ctrl.current) delete ctrl.current;
          if (ctrl.autoHighlight) ctrl.highlightFirst();
        };

        ctrl.highlightItem = function (item) {
          if (!ctrl.enabled) return;
          if (item === ctrl.current) return;
          if (ctrl.current) ctrl.current.unhighlight();
          ctrl.current = item;
          ctrl.current.highlight();
        };

        ctrl.unhighlight = function (item) {
          if (!ctrl.current) return;
          ctrl.current.unhighlight();
          delete ctrl.current;
        };

        ctrl.highlightFirst = function () {
          if (!ctrl.enabled) return;
          var items = ctrl.getVisibleItems();
          if (items.length) ctrl.highlightItem(items[0]);
        };

        ctrl.highlightNext = function () {
          if (!ctrl.enabled) return;
          var items = ctrl.getVisibleItems();
          if (ctrl.current) {
            if (!items.length) {
              ctrl.unhighlight();
            } else {
              var currentIndex = items.indexOf(ctrl.current);
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
          if (ctrl.current) {
            if (!items.length) {
              ctrl.unhighlight();
            } else {
              var currentIndex = items.indexOf(ctrl.current);
              if (currentIndex == -1) ctrl.highlightItem(items[items.length-1]);
              else if (currentIndex > 0) {
                ctrl.highlightItem(items[currentIndex-1]);
              }
            }
          } else {
            if (items.length) ctrl.highlightItem(items[items.length-1]);
          }
        };

        ctrl.selectCurrent = function () {
          if (ctrl.enabled && ctrl.current && ctrl.current.isVisible()) ctrl.selectItem(ctrl.current);
        };

        ctrl.selectItem = function (item) {
          if (ctrl.enabled) item.select();
        };

        ctrl.getVisibleItems = function () {
          return ctrl.items.filter(function (item) {
            return item.isVisible();
          });
        };

        ctrl.enable = function () {
          ctrl.enabled = true;
          $document.on('keydown', ctrl.keyHandler);
          if (ctrl.autoHighlight) ctrl.highlightFirst();
        };

        ctrl.disable = function () {
          ctrl.enabled = false;
          $document.off('keydown', ctrl.keyHandler);
          if (ctrl.current) ctrl.unhighlight();
        };

        ctrl.keyHandler = function (e) {
          switch (e.which) {
            case 38: // Up arrow
              e.preventDefault();
              scope.$apply(function () {
                ctrl.highlightPrevious();
              });
              break;
            case 40: // Down arrow
              e.preventDefault();
              scope.$apply(function () {
                ctrl.highlightNext();
              });
              break;
            case 13: // Return key
              e.preventDefault();
              scope.$apply(function () {
                ctrl.selectCurrent();
              });
          }
        };
      }], 
      link: function (scope, element, attrs, ctrl) {
        scope.$watch(attrs.sbDisabled, function (val) {
          if (!val || typeof val == 'undefined') ctrl.enable();
          else ctrl.disable();
        });
        ctrl.autoHighlight = 'sbAutoHighlight' in attrs;
      }
    };
  }])

  .directive('sbHighlightIndex', ['$animate', function ($animate) {
    return {
      restrict: 'A',
      require: ['^sbHighlightGroup', 'sbHighlightIndex'],
      controller: ['$scope', '$element', '$attrs', function (scope, elem, attrs) {
        this.select = function () {
          scope.$eval(attrs.sbHighlightSelect);
        };
      }], 
      link: function (scope, elem, attrs, ctrls) {
        var group = ctrls[0];
        var ctrl = ctrls[1];

        // Prepare the controller;
        ctrl.index = parseInt(attrs.sbHighlightIndex, 10);
        ctrl.highlight = function () {
          $animate.addClass(elem, group.highlightClass);
        };
        ctrl.unhighlight = function () {
          $animate.removeClass(elem, group.highlightClass);
        };
        ctrl.isVisible = function () {
          return !elem.hasClass('ng-hide');
        };

        // Add to group controller
        group.addItem(ctrl);

        // Setup event listeners
        elem.on('mouseover', function (e) {
          scope.$apply(function () {
            group.highlightItem(ctrl);
          });
        });
        elem.on('click', function (e) {
          scope.$apply(function () {
            group.selectItem(ctrl);
          });
        });

        // Cleanup
        scope.$on('$destroy', function (e) {
          group.removeItem(ctrl);
        });
      }
    };
  }]);
