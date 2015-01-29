(function() {
    var token = 'token_should_be_here';

    function makeTestRequest() {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                testRequestCallback(xmlhttp.response);
            }
        };

        xmlhttp.open("GET","https://idonethis.com/api/v0.1/noop/", true);
        xmlhttp.setRequestHeader('Authorization', 'Token ' + token);
        xmlhttp.send();
    }

    function testRequestCallback(response) {
        var data = JSON.parse(response),
            testNode = document.getElementById("testResponse"),
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
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                donesRequestCallback(xmlhttp.response);
            }
        };

        xmlhttp.open("GET","https://idonethis.com/api/v0.1/dones/?team=fed&done_date=today&tags=nextgen&page_size=100", true);
        xmlhttp.send();
    }

    function donesRequestCallback(response) {
        var data = JSON.parse(response);

        if (data.ok) {
            parseDones(JSON.parse(response).results);
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
})();