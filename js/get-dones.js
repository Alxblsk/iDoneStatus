(function(App) {
    "use strict";

    /**
     * Make 'get dones' request
     */
    App.getDones = function(params) {
        var testRequest = App.request({
            type: 'GET',
            url: 'https://idonethis.com/api/v0.1/dones/',
            queries: {
                team: 'fed',
                tags: params.tags || '',
                page_size: 100,
                done_date: params.done_date || 'today'
            }
        });

        testRequest.then(donesRequestCallback);
    };

    /**
     * Succes callback
     * @param {Object} data Parsed response data
     */
    function donesRequestCallback(data) {
        if (data.ok && data.results.length) {
            parseDones(data.results);
        } else {
            getDonesNode().innerText = 'No results';
        }
    }

    function getDonesNode() {
        return document.querySelector('#getDonesButton::shadow #donesResponse');
    }

    /**
     * Parse and display requested dones
     * @param {Array} results List of dones
     */
    function parseDones(results) {
        var donesNode = getDonesNode();
        var donesHtml = '';
        var parsedResults = {};

        results.forEach(function(item) {
            if (!(item.owner in parsedResults)) {
                parsedResults[item.owner] = [];
            }
            parsedResults[item.owner].push(item);
        });

        for (var ownerName in parsedResults) {
            var itemHtml = '';
            itemHtml += '<h3>' + ownerName + '</h3>';

            parsedResults[ownerName].forEach(function(item) {
                itemHtml += '<p>' + (item.is_goal ? 'goal' : 'done') + ': ' + item.markedup_text + '</p>';
            });

            donesHtml += itemHtml;
        }

        donesNode.innerHTML = donesHtml;
        localStorage.setItem('last', donesHtml);
    }
})(StatusApp);