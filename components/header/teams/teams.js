(function(App) {
	'use strict';
	
    // Predefined element container
	var $el = null;
    
	// New prototype for future tag
	var proto = Object.create(HTMLElement.prototype);
	
	// Actions on elements
	var actions = {
		
	};

	// Updting element events
	App.modifyProto(proto, actions, {
		createdCallback: function() {
			var content = App.getTemplateContent('#link-teams-template', '#ids-teams-template');
            
            $el = this;
		  	$el.appendChild(content);	
              
			getTeams().then(function(items) {
                var container = $el.querySelector('#ids-teams-list');
                container.innerHTML = items;
            });
		}
	});
    
	function getTeams() {
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
        var content = App.getTemplateContent('#link-teams-template', '#ids-team-template');
        var items = '';
        
        results.forEach(function(item) {
            items += content.firstElementChild.outerHTML
                .replace('{teamName}', item.name)
                .replace('{shortName}', item.short_name);
        });
        return items;
    }
	
	document.registerElement('ids-teams', { prototype: proto });
})(StatusApp);