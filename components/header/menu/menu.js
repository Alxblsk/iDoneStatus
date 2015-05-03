(function(App) {
	'use strict';
	
	// New prototype for future tag
	var proto = Object.create(HTMLElement.prototype);
	
	// Actions on elements
	var actions = {
		'ids-menu-filter-link': {
			click: function() {
				setTag('ids-filter');
			}
		},
		'ids-menu-options-link': {
			click: function() {}
		}, 
		'ids-menu-teams-link': {
			click: function() {
				setTag('ids-teams');
			}
		}
	};
	
	/**
	 * Removes an ID of current tagname if already selected
	 */
	function setTag(tagname) {
		if (App.currentOpenedMenuId.id === tagname) {
			App.currentOpenedMenuId.id = '';
		} else {
			App.currentOpenedMenuId.id = tagname;
		}
	}

	// Updting element events
	App.modifyProto(proto, actions, {
		createdCallback: function() {
			var content = App.getTemplateContent('#link-menu-template', '#ids-menu-template');
		  	this.appendChild(content);	
		}
	});
	
	document.registerElement('ids-menu', { prototype: proto	});
})(StatusApp);