/***********************************************************************
 * Menu Directive
 * Author: Brenton Klik
 * 
 * Prerequisites:
 *  - AngularJS
 *  - styleSheetFactory (https://github.com/bklik/styleSheetFactory)
 * 
 * Description:
 * Creates a menu control.
/**********************************************************************/
angular.module('menuDirective', ['styleSheetFactory'])

.directive('menuDirective', ['$timeout', 'styleSheetFactory', function($timeout, styleSheetFactory) {
    return {
        scope: {
            api: '=',
            selectionCallback: '&'
        },
        restrict: 'E',
        link: function($scope, $element, $attrs) {
            // The document's stylesheet.
            var styleSheet = styleSheetFactory.getStyleSheet();

            // The prefix used by the browser for non-standard properties.
            var prefix = styleSheetFactory.getPrefix();

            // Add this directive's styles to the document's stylesheet.
            styleSheetFactory.addCSSRule(styleSheet, 'menu-directive',
                'display: block;' +
                'width: 250px;'
            ,1);

            styleSheetFactory.addCSSRule(styleSheet, 'menu-directive sub-menu',
                'display: none;' +
                'margin: 0 -8px;'
            ,1);

            styleSheetFactory.addCSSRule(styleSheet, 'menu-directive sub-menu menu-item',
                'padding-left: 24px;'
            ,1);

            styleSheetFactory.addCSSRule(styleSheet, 'menu-directive sub-menu.show',
                'display: block;'
            ,1);

            styleSheetFactory.addCSSRule(styleSheet, 'menu-directive menu-item',
                'cursor: pointer;' +
                'display: block;' +
                'line-height: 32px;' +
                'padding: 0 8px;' +
                'position: relative;'
            ,1);

            styleSheetFactory.addCSSRule(styleSheet, 'menu-directive menu-item.more::after',
                'display: block;' +
                'content: \'V\';' +
                'padding-right: 8px;' +
                'position: absolute;' +
                'right: 0;' +
                'text-align: right;' +
                'top: 0;' +
                'width: 32px;'
            ,1);

            var selection = [];

            var clickHandler = function(event) {
                event.stopPropagation();
                resetMenu();

                var subMenu = event.target.querySelector('sub-menu');
                if(subMenu != null) {
                    subMenu.classList.toggle('show');
                    var parent = event.target.parentNode;
                    while(parent.nodeName != 'BODY') {
                        if(parent.nodeName == 'SUB-MENU') {
                            parent.classList.toggle('show');
                        }
                        parent = parent.parentNode;
                    }
                } else {
                    selection.push(event.target.getAttribute('label'));

                    var parent = event.target.parentNode;
                    var leftSub = false;
                    while(parent.nodeName != 'BODY') {
                        if(parent.nodeName == 'SUB-MENU') {
                            leftSub = true;
                        } else if(parent.nodeName == 'MENU-ITEM' && leftSub) {
                            leftSub = false;
                            selection.splice(0, 0, parent.getAttribute('label'));
                        }
                        parent = parent.parentNode;
                    }

                    $scope.selectionCallback({selection: selection});
                    selection = [];

                    // Close the parent popup if present.
                    var parent = $element.parent();
                    while(parent.prop('tagName')) {
                        if(parent.prop('tagName') == 'POPUP-DIRECTIVE') {
                            var api = parent.attr('api');
                            parent.scope()[api].hide();
                            break;
                        }
                        parent = parent.parent();
                    }
                }
            };

            var resetMenu = function() {
                $element.find('sub-menu').removeClass('show');
            };

            var init = function() {
                var items = $element.find('menu-item');
                for(var i=0; i<items.length; i++) {
                    var label = document.createTextNode(items[i].getAttribute('label'));
                    var subMenu = items[i].querySelector('sub-menu');

                    if(subMenu != null) {
                        items[i].insertBefore(label, subMenu);
                        items[i].classList.add('more');
                    } else {
                        items[i].appendChild(label);
                    }

                    items[i].addEventListener('click', clickHandler);
                }
            };
            $timeout(init, 0);

            $scope.api = {
                reset: function() {
                    resetMenu();
                },
            };
        }
    }
}]);