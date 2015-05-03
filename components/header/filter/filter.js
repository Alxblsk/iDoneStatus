(function(App) {
	'use strict';
	
	// Predefined element container
	var $el = null;
	
	// Object for keeping data
	var data = {
		date: null,
		tags: null	
	};
	
	// New prototype for future tag
	var proto = Object.create(HTMLElement.prototype);
	
	// Actions on elements
	var actions = {
		'ids-filter-submit-button': {
			click: function(event) {
				getDones();
			}
		},
		'ids-filter-date': {
			change: function(event) {
				data.date = event.srcElement.value;
			}
		},
		'ids-filter-tags': {
			change: function() {
				data.tags = event.srcElement.value;
			}
		}
	};
	
	/**
	 * Gets dones for selected parameters
	 */
	function getDones(event) {
        App.getDones({
            done_date: data.date,
            tags: data.tags
        });
    }
	
	// Updting element events
	App.modifyProto(proto, actions, {
		createdCallback: function() {
			var content = App.getTemplateContent('#link-filter-template', '#ids-filter-template');

			$el = this;
		  	$el.appendChild(content);	
		}
	});
	
	document.registerElement('ids-filter', { prototype: proto });
})(StatusApp);