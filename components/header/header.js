(function(App) {
	'use strict';
	
	// New prototype for future tag
	var proto = Object.create(HTMLElement.prototype);
	var cssHiddenElementName = 'hide';
	
	App.currentOpenedMenuId = {
		id: '',
		count: 0
	}
	
	Object.observe(App.currentOpenedMenuId, function(changes) {
		changes.forEach(function(change) {
			var newName = change.object[change.name],
			    $oldElement = change.oldValue && document.querySelector(change.oldValue),
			    $newElement = newName && document.querySelector(newName);
			
			if ($oldElement) {
				$oldElement.classList.toggle(cssHiddenElementName);
			}
			
			if ($newElement) {
				$newElement.classList.remove(cssHiddenElementName);
			}
		});
	}, ['add', 'update']);
	
		// Updting element events
	App.modifyProto(proto, {}, {
		createdCallback: function() {
			var content = App.getTemplateContent('#link-header-template', '#ids-header-template');
		  	this.appendChild(content);	
		}
	});
	
	document.registerElement('ids-header', { prototype: proto	});
})(StatusApp);