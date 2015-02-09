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
        return document.querySelector('#donesResponse');
    }

    function getUserId(id) {
        return id.split('@')[0];
    }

    /**
     * Parse and display requested dones
     * @param {Array} results List of dones
     */
    function parseDones(results) {
        var donesNode = getDonesNode();
        var donesHtml = '';
        var parsedResults = {};
        var users = [];

        results.forEach(function(item) {
            var owner = item.owner;

            if (!(owner in parsedResults)) {
                parsedResults[owner] = [];
                users.push(owner);
            }

            parsedResults[owner].push(item);
        });

        var profiles = getUserProfiles(users);

        profiles.then(function(data) {
            var currentProfiles = JSON.parse(localStorage.getItem('profiles')) || {};
            users.forEach(function(item) {
                document.querySelector('#user_' + getUserId(item)).innerHTML = currentProfiles[item].nicest_name + ' <span class="user_owner">(' + item+ ')</span>';
            });
        });

        for (var ownerName in parsedResults) {
            var itemHtml = '';
            itemHtml += '<h3 id="user_' + getUserId(ownerName) + '">' + ownerName + '</h3>';

            parsedResults[ownerName].forEach(function(item) {
                itemHtml += '<p class="'+ (item.is_goal ? 'goal' : 'done') + '">' + item.markedup_text + '</p>';
            });

            donesHtml += itemHtml;
        }

        donesNode.innerHTML = donesHtml;
        localStorage.setItem('last', donesHtml);
    }

    function getUserProfiles(usernames) {
        var currentProfiles = JSON.parse(localStorage.getItem('profiles')) || {},
            requests = [];

        usernames.forEach(function(user) {
             if (!(user in currentProfiles)) {
                 var request = App.request({
                     type: 'GET',
                     url: 'https://idonethis.com/api/v0.1/users/' + user + '/'
                 });
                 request.then(function(data) {
                    data.ok && (currentProfiles[user] = data.result);
                     localStorage.setItem('profiles', JSON.stringify(currentProfiles));
                 });
                 requests.push(request);
             }
        });

        return Promise.all(requests);
    }
})(StatusApp);