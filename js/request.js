(function(App) {
    'use strict';

    var defaults = {
        type: 'GET'
    };

    function setHeaders(xmlhttp, headers) {
        for (var headerName in headers) {
            if (headers.hasOwnProperty(headerName)) {
                xmlhttp.setRequestHeader(headerName, headers[headerName]);
            }
        }
    }

App.request = function(options) {
    options = App.extend(defaults, options || {});

    var xmlhttp = new XMLHttpRequest();

    return new Promise(function(resolve, reject) {
        xmlhttp.open(options.type, options.url, true);
        options.headers && setHeaders(xmlhttp, options.headers);
        xmlhttp.send();

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 ) {
                var data = JSON.parse(xmlhttp.response);

                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    resolve(data);
                } else {
                    reject(data);
                }
            }
        };
    });
}

})(StatusApp);