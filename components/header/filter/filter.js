(function(App) {
	'use strict';
	
	var $el = null;
	var data = {
		date: null,
		tags: null	
	};
	var proto = Object.create(HTMLElement.prototype);
	
	var actions = {
		'ids-filter-submit-button': {
			click: function(event) {
				getDones();
				console.log(data);
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
	
	function toggleFilter() {
		$el.classList.toggle('hide');
	}
	
	function getDones(event) {
        App.getDones({
            done_date: data.date,
            tags: data.tags
        });
    }
	
	App.events.on('header-menu-filter', function(evnt) {
		toggleFilter();
		console.log('on filter', arguments);
	});
	
	proto.createdCallback = function() {
		$el = this;
		
		var content = App.getTemplateContent('#link-filter-template', '#ids-filter-template');
	  	this.appendChild(content);	
	};
	
	proto.attachedCallback = function() {
	    App.listeners(actions, 'add');
	};
	
	proto.detachedCallback = function() {
		App.listeners(actions, 'remove');
	};
	
	document.registerElement('ids-filter', {
		prototype: proto
	});
})(StatusApp);