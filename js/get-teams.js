(function(App) {
    'use strict';
    
    var teamTemplate = App.getTemplateContent('#link__team', '#teamItemTemplate');
    
    App.getTeams = function() {
        var testRequest = App.request({
            type: 'GET',
            url: 'https://idonethis.com/api/v0.1/teams/',
        });

        return testRequest.then(donesRequestCallback);
    };
    
    function donesRequestCallback(data) {
        if (data.ok && data.results.length) {
            return parseTeams(data.results);
        }
    }
    
    function parseTeams(results) {
        var items = '';
        results.forEach(function(item) {
            items += teamTemplate.firstElementChild.outerHTML
                .replace('{teamName}', item.name)
                .replace('{shortName}', item.short_name);
        });
        return items;
    }

})(StatusApp);