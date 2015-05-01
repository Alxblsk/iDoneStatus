(function(App) {
    'use strict';

    var defaults = {
        type: 'GET',
        queries: {}
    };

    function setHeaders(xmlhttp, headers) {
        for (var headerName in headers) {
            if (headers.hasOwnProperty(headerName)) {
                xmlhttp.setRequestHeader(headerName, headers[headerName]);
            }
        }
    }

    function setRequestParams(url, queryParams) {
        var link = document.createElement('a'),
            params = [], joined;
        link.href = url;

        for (var paramName in queryParams) {
            if (queryParams.hasOwnProperty(paramName)) {
                params.push(paramName + '=' + queryParams[paramName]);
            }
        }

        joined = params.join('&');

        if (joined) {
            link.search = (link.search.length ? '&' : '?') + joined;
        }

        return link.href;
    }


App.request = function(options) {
    options = App.extend(defaults, options || {});

    var xmlhttp = new XMLHttpRequest(), data;

    return new Promise(function(resolve, reject) {
        var url = setRequestParams(options.url, options.queries);

        xmlhttp.open(options.type, url, true);
        options.headers && setHeaders(xmlhttp, options.headers);
        if (options.data) {
            xmlhttp.setRequestHeader("Content-type", "application/json");
            data = JSON.stringify(options.data);
        }
        xmlhttp.send(data);

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
};

})(StatusApp);