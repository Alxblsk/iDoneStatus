(function(App) {
	'use strict';
	
	var proto = Object.create(HTMLElement.prototype);
	var actions = {
		'ids-menu-filter-link': {
			click: function() {
				console.log('click', this);
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
	
	proto.createdCallback = function() {
		var content = App.getTemplateContent('#link-menu-template', '#ids-menu-template');
	  	this.appendChild(content);	
	};
	
	proto.attachedCallback = function() {
	    App.listeners(actions, 'add');
	};
	
	proto.detachedCallback = function() {
		App.listeners(actions, 'remove');
	};
	
	document.registerElement('ids-menu', {
		prototype: proto
	});
})(StatusApp);