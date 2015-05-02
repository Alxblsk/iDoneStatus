(function(App) {
	'use strict';
	
	var proto = Object.create(HTMLElement.prototype);
	
	var actions = {
		'idc-filter-submit-button': {
			click: function() {
				console.log(arguments);
			}
		}
	};
	
	var $el = null;
	
	App.events.on('header-menu-filter', function(evnt) {
		$el.classList.toggle('hide');
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