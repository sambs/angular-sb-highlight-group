angular.module('HlGroup', [])

  .directive('hlGroup', function ($http) {
    return {
      restrict: 'A',
      priority: 9,
      controller: function () {
        this.hlClass = 'highlight';
      }, 
      link: function (scope, element, attrs, ctrl) {

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
  
  .directive('hlClass', function ($http) {
    return {
      restrict: 'A',
      require: 'hlGroup',
      priority: 8,
      link: function (scope, element, attrs, ctrl) {
        ctrl.hlClass = attrs.hlClass || 'highlight';
      }
    };
  })

  .directive('hlItem', function ($http) {
    return {
      restrict: 'A',
      require: '^hlGroup',
      link: function (scope, element, attrs, grpCtrl) {
        element.on('mouseover', function (e) {
          element.closest('[hl-group]').find('[hl-item]').removeClass(grpCtrl.hlClass);
          angular.element(this).addClass(grpCtrl.hlClass);
        });
        scope.$on('$destroy', function (e) {
          element.off('mouseover');
        });
      }
    };
  })

  .directive('hlSelect', function ($http) {
    return {
      restrict: 'A',
      require: '^hlGroup',
      link: function (scope, element, attrs, grpCtrl) {
        function select () {
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
