angular.module('highlightGroup', [])

  .directive('hlGroup', ['$document', function ($document) {
    var items = [];
    var current;
    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function (scope, elem, attrs) {
        this.hlClass = attrs.hlClass || 'highlight';
        this.addItem = function (item) {
          items.push(item); 
          items = items.sort(function (a, b) {
            return a.index - b.index;
          });
        };
        this.removeItem = function (item) {
          items.slice(items.indexOf(item), 1); 
        };
        this.highlightItem = function (item) {
          if (current) current.unhighlight();
          current = item;
          current.highlight();
        };
        this.highlightNext = function () {
          var visibleItems = this.getVisibleItems();
          if (current) {
            if (!visibleItems.length) {
              current.unhighlight();
            } else {
              var currentIndex = visibleItems.indexOf(current);
              if (currentIndex == -1) this.highlightItem(visibleItems[0]);
              else if (currentIndex < visibleItems.length-1) {
                this.highlightItem(visibleItems[currentIndex+1]);
              }
            }
          } else {
            if (visibleItems.length) this.highlightItem(visibleItems[0]);
          }
        };
        this.highlightPrevious = function () {
          var visibleItems = this.getVisibleItems();
          if (current) {
            if (!visibleItems.length) {
              current.unhighlight();
            } else {
              var currentIndex = visibleItems.indexOf(current);
              if (currentIndex == -1) this.highlightItem(visibleItems[visibleItems.length-1]);
              else if (currentIndex > 0) {
                this.highlightItem(visibleItems[currentIndex-1]);
              }
            }
          } else {
            if (visibleItems.length) this.highlightItem(visibleItems[visibleItems.length-1]);
          }
        };
        this.select = function () {
          if (current && current.isVisible()) current.select();
        };
        this.getVisibleItems = function () {
          return items.filter(function (item) {
            return item.isVisible();
          });
        };
      }], 
      link: function (scope, element, attrs, ctrl) {

        function keyHandler (e) {
          switch (e.which) {
            case 38: // Up arrow
              ctrl.highlightPrevious();
              return false;
            case 40: // Down arrow
              ctrl.highlightNext();
              return false;
            case 13: // Return key
              ctrl.select();
              return false;
          }
        }

        $document.on('keydown', keyHandler);
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
          ctrl.select();
        });

        // Cleanup
        scope.$on('$destroy', function (e) {
          group.removeItem(ctrl);
        });
      }
    };
  }])

  .directive('hlGroupO', function ($http) {
    return {
      restrict: 'A',
      priority: 9,
      controller: function () {}, 
      link: function (scope, element, attrs, ctrl) {
        ctrl.hlClass = attrs.hlClass || highlight;

        function keyHandler (e) {
          var index, cElement, hlItems;

          switch (e.which) {
            
            case 38: // Up arrow

              cElement = element.find('.'+ctrl.hlClass+'[hl-item]');
              if (cElement.length == 1) {
                hlItems = element.find('[hl-item]:visible');
                index = hlItems.index(cElement);
                if (index > 0) {
                  cElement.removeClass(ctrl.hlClass);
                  hlItems.eq(index - 1).addClass(ctrl.hlClass);
                }
              } else {
                // Remove class just incase more than one item is currently highlighted
                cElement.removeClass(ctrl.hlClass);
                // Highlight the last item in the group
                element.find('[hl-item]:visible').last().addClass(ctrl.hlClass);
              }
              return false;
              
            case 40: // Down arrow

              cElement = element.find('.'+ctrl.hlClass+'[hl-item]');
              if (cElement.length == 1) {
                hlItems = element.find('[hl-item]:visible');
                index = hlItems.index(cElement);
                if (index < hlItems.length - 1) {
                  cElement.removeClass(ctrl.hlClass);
                  hlItems.eq(index + 1).addClass(ctrl.hlClass);
                }
              } else {
                // Remove class just incase more than one item is currently highlighted
                cElement.removeClass(ctrl.hlClass);
                // Highlight the first item in the group
                element.find('[hl-item]:visible').first().addClass(ctrl.hlClass);
              }
              return false;
          }
        }

        $('body').on('keydown', keyHandler);
      }
    };
  })

  .directive('hlSelectO', function ($http) {
    return {
      restrict: 'A',
      require: '^hlGroup',
      link: function (scope, element, attrs, grpCtrl) {
        // Evaluate the expression
        // Triggered by click or enter key if highlighted
        function select (e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          scope.$apply(function () {
            scope.$eval(attrs.hlSelect);
          });
        }
        function keyHandler (e) {
          // If Enter/return key pressed, is highlighted & is visible
          if (e.which === 13 && element.hasClass(grpCtrl.hlClass) && element.is(':visible')) {
            select(e);
            return false;
          }
        }

        element.on('click', select);
        $('body').on('keydown', keyHandler);
        
        scope.$on('$destroy', function (e) {
          element.off('click', select);
          $('body').off('keydown', keyHandler);
        });
      }
    };
  });
