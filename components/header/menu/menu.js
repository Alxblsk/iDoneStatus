(function(App) {
	'use strict';
	
	// New prototype for future tag
	var proto = Object.create(HTMLElement.prototype);
	
	// Actions on elements
	var actions = {
		'ids-menu-filter-link': {
			click: function() {
				App.events.trigger('header-menu-filter', arguments);
			}
		},
		'ids-menu-options-link': {
			click: function() {
				console.log('click', this);
			}
		}, 
		'ids-menu-teams-link': {
			click: function() {
				console.log('click', this);
			}
		}
	};

	// Updting element events
	App.modifyProto(proto, actions, {
		createdCallback: function() {
			var content = App.getTemplateContent('#link-menu-template', '#ids-menu-template');
		  	this.appendChild(content);	
		}
	});
	
	document.registerElement('ids-menu', { prototype: proto	});
})(StatusApp);