(function(App) {
    'use strict';

    var token = 'token_should_be_here';

    function makeTestRequest() {
        var testRequest = App.request({
            type: 'GET',
            url: 'https://idonethis.com/api/v0.1/noop/',
            headers: {
                Authorization: 'Token ' + token
            }
        });

        testRequest.then(testRequestCallback);
    }

    function testRequestCallback(data) {
        var testNode = document.getElementById("testResponse"),
            appNode = document.getElementById("getDones");

        if (data.ok) {
                appNode.classList.remove('hide');
                appNode.addEventListener('click', function() {
                makeDonesRequest();
            }, false);
        } else {
            testNode.innerHTML ="error connecting to iDone server";
        }
    }

    function init() {
        makeTestRequest();
    }

    function makeDonesRequest() {
        var testRequest = App.request({
            type: 'GET',
            url: 'https://idonethis.com/api/v0.1/dones/?team=fed&done_date=today&tags=nextgen&page_size=100'
        });

        testRequest.then(donesRequestCallback);
    }

    function donesRequestCallback(data) {
        if (data.ok) {
            parseDones(data.results);
        }
    }

    function parseDones(results) {
        var donesNode = document.getElementById("donesResponse");
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
    }

    init();
})(StatusApp);