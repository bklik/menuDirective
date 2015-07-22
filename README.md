# menuDirective

Creates a nested menu control.

**Requirements**

* [AngularJS](http://angularjs.org/)
* [bklik/styleSheetFactory](https://github.com/bklik/styleSheetFactory)
* [bklik/popupDirective (optional)](https://github.com/bklik/popup/)

### Installation

Link to popup's CSS and Javascript files.
```html
<script src="menuDirective/menuDirective.js"></script>
```

In your app's directives.js file, add the menuDirective module.
```javascript
angular.module('myApp', ['menuDirective']);
```

Last, simply add a `<menu-directive>` element.
```html
<button ng-click="popup01.show($event)">Menu</button>
<popup-directive api="popup01" hide-callback="menu01.reset()">
    <menu-directive api="menu01" selection-callback="mySelection(selection)">
        <menu-item label="Menu Item 1"></menu-item>
        <menu-item label="Menu Item 2">
            <sub-menu>
                <menu-item label="Menu Item a"></menu-item>
                <menu-item label="Menu Item b"></menu-item>
                <menu-item label="Menu Item c"></menu-item>
            </sub-menu>
        </menu-item>
        <menu-item label="Menu Item 3"></menu-item>
    </menu-directive>
</popup-directive>
```