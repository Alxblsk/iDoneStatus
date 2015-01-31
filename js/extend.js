(function(App) {
    'use strict';

    App.extend = function(source, target) {
        var a = Object.create(source);
        Object.keys(target).map(function(prop) {
            a[prop] = target[prop];
        });
        return a;
    };

})(StatusApp);