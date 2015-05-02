(function(App) {
	'use strict';
	
	var proto = Object.create(HTMLElement.prototype);
	
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

	App.modifyProto(proto, actions, {
		createdCallback: function() {
			var content = App.getTemplateContent('#link-menu-template', '#ids-menu-template');
		  	this.appendChild(content);	
		}
	});
	
	document.registerElement('ids-menu', { prototype: proto	});
})(StatusApp);