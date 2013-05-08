angular.module('HlGroup', [])

  .directive('hlGroup', function ($http) {
    return {
      restrict: 'A',
      // asks for $scope to fool the BC controller module
      controller: ['$scope', function () {
        var items = this.items = [];

        this.addItem = function ($scope, $element) {
          items.push($scope);

          $element.on('mouseover', function (e) {
            $element.closest('[hl-group]').find('[hl-item]').each(function (i, el) {
              $elScope = angular.element(el).scope();
              $scope.$apply(function () {
                $elScope.highlighted = $elScope === $scope;
              });
            });

            //for (var i = 0; i < items.length; i++) {
              //$scope.$apply(function () {
                //if (items[i] !== $scope) {
                  //items[i].highlighted = false;
                //} else {
                  //items[i].highlighted = true;
                //}
              //});
            //}
          });
        };
        this.removeItem = function ($scope, $element) {
          var i = items.indexOf($scope);
          if (i != -1) {
            items.splice(i, 1);
          }
          $element.off('mouseover');
        };
      }],

      link: function ($scope, $element, attrs, ctrl) {

        function keyHandler (e) {
          //if (!this.enabled) return;
          var found, index, $hlItems;

          switch (e.which) {
            case 38: // Up arrow
              $hlItems = $element.find('[hl-item]:visible');
              $hlItems.each(function (i, el) {
                if (found) return;
                if (angular.element(el).scope().highlighted) {
                  found = el;
                  if (i > 0) {
                    $scope.$apply(function () {
                      angular.element($hlItems[i - 1]).scope().highlighted = true;
                      angular.element(el).scope().highlighted = false;
                    });
                  }
                }
              });
              if (!found) {
                $scope.$apply(function () {
                  angular.element($hlItems[$hlItems.length - 1]).scope().highlighted = true;
                });
              }
              $element.find('[hl-item]:hidden').each(function (i, el) {
                $scope.$apply(function () {
                  angular.element(el).scope().highlighted = false;
                });
              });
              //for (i = 0; i < ctrl.items.length; i++) {
                //if (ctrl.items[i].highlighted) {
                  //found = true;
                  //if (i > 0) {
                    //$scope.$apply(function () {
                      //ctrl.items[i - 1].highlighted = true;
                      //ctrl.items[i].highlighted = false;
                    //});
                  //}
                  //break;
                //}
              //}
              //if (!found) {
                //$scope.$apply(function () {
                  //ctrl.items[ctrl.items.length - 1].highlighted = true;
                //});
              //}
              return false;
            case 40: // Down arrow
              $hlItems = $element.find('[hl-item]:visible');
              $hlItems.each(function (i, el) {
                if (found) return;
                if (angular.element(el).scope().highlighted) {
                  found = el;
                  if (i < $hlItems.length - 1) {
                    $scope.$apply(function () {
                      angular.element($hlItems[i + 1]).scope().highlighted = true;
                      angular.element(el).scope().highlighted = false;
                    });
                  }
                }
              });
              if (!found) {
                $scope.$apply(function () {
                  angular.element($hlItems[0]).scope().highlighted = true;
                });
              }
              $element.find('[hl-item]:hidden').each(function (i, el) {
                $scope.$apply(function () {
                  angular.element(el).scope().highlighted = false;
                });
              });
              //for (i = ctrl.items.length - 1; i >= 0; i--) {
                //if (ctrl.items[i].highlighted) {
                  //found = true;
                  //if (i < ctrl.items.length - 1) {
                    //$scope.$apply(function () {
                      //ctrl.items[i + 1].highlighted = true;
                      //ctrl.items[i].highlighted = false;
                    //});
                  //}
                  //break;
                //}
              //}
              //if (!found) {
                //$scope.$apply(function () {
                  //ctrl.items[0].highlighted = true;
                //});
              //}
              return false;
          }
        }

        $('body').on('keydown', keyHandler);
      }
    };
  })

  .directive('hlItem', function ($http) {

    return {
      restrict: 'A',
      scope: true,
      require: '^hlGroup',
      link: function ($scope, $element, attrs, grpCtrl) {
        $scope.highlighted = false;
        grpCtrl.addItem($scope, $element);
        $scope.$on('$destroy', function (e) {
          grpCtrl.removeItem($scope, $element);
        });
      }
    };
  })

  .directive('hlSelect', function ($http) {

    return {
      restrict: 'A',
      link: function ($scope, $element, attrs) {
        function select () {
          $scope.$apply(function () {
            $scope.$eval(attrs.hlSelect);
          });
        }

        $element.on('click', select);

        $('body').on('keydown', function (e) {
          // Enter/return key
          if (e.which === 13) {
            if ($scope.highlighted) select();
            return false;
          }
        });
      }
    };
  });
