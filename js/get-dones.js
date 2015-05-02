(function(App) {
    "use strict";

    var PROFILE_HEADER = '<h3 id="user_{niceId}">{ownerId}</h3>';
    var PROFILE_HEADER_INNER = '{niceName} <span class="user_owner">({ownerId})</span>';
    var PROFILE_DONE = '<p><span class="done-type">{doneType}</span> {doneContent}</p>';

    var messageReplaces = window.extraReplaces || [];

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

    /**
     *
     * @returns {HTMLElement}
     */
    function getDonesNode() {
        return document.querySelector('#donesResponse');
    }

    /**
     *
     * @param id
     * @returns {*}
     */
    function getUserId(id) {
        return id.split('@')[0];
    }

    /**
     *
     * @param id
     * @returns {HTMLElement|null}
     */
    function getUserHeader(id) {
        var node = document.querySelector('#user_' + getUserId(id));
        return node || null;
    }

    function isDone(item) {
        return !item.is_goal || item.goal_completed;
    }

    function isGoal(item) {
        return !isDone(item);
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

        profiles.then(function() {
            var currentProfiles = JSON.parse(localStorage.getItem('profiles')) || {};

            users.forEach(function(item) {
                var userHeader = getUserHeader(item);
                if (userHeader) {
                    userHeader.innerHTML = PROFILE_HEADER_INNER
                        .replace('{niceName}', currentProfiles[item].nicest_name)
                        .replace('{ownerId}', item);
                }
            });
            localStorage.setItem('last', donesNode.innerHTML);
        });

        for (var ownerName in parsedResults) {
            var itemHtml = '';

            itemHtml += PROFILE_HEADER
                .replace('{niceId}', getUserId(ownerName))
                .replace('{ownerId}', ownerName);

            parsedResults[ownerName].forEach(function(item) {
                var message = item.markedup_text;

                messageReplaces && messageReplaces.forEach(function(replaceItem) {
                    message = message.replace(replaceItem.find, replaceItem.replaceWith)
                });

                itemHtml += PROFILE_DONE
                    .replace('{doneType}', isGoal(item) ? '☐' : '✓')
                    .replace('{doneContent}', message);
            });

            donesHtml += itemHtml;
        }

        donesNode.innerHTML = donesHtml;
        localStorage.setItem('last', donesHtml);
    }

    /**
     *
     * @param usernames
     * @returns {*}
     */
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