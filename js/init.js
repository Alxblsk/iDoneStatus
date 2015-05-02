(function(App, EventEmitter) {
    'use strict';

    var token = window.token || 'token_should_be_here';
    var wrapper = document.querySelector('#wrapper');
    var testNode = document.getElementById("testResponse");
    
    var emitter = new EventEmitter();

    App.getTemplateContent = function getTemplateContent(linkSelector, templateSelector) {
        var link = document.querySelector(linkSelector),
            template = link.import.querySelector(templateSelector);

        return document.importNode(template.content, true);
    }
    
    App.listeners = function listeners(actions, type) {
		if (!type) return;
		
		Object.keys(actions).forEach(function(actionName) {
			var action = actions[actionName];
			var $el = document.getElementById(actionName);
			
			Object.keys(action).forEach(function(actionEvent) {
				$el[type + 'EventListener'](actionEvent, action[actionEvent], false);
			});		
		});	
	}
    
    App.events = {
        on: emitter.on.bind(emitter),
        once: emitter.once.bind(emitter),
        off: emitter.off.bind(emitter),
        trigger: emitter.trigger.bind(emitter)
    }
    
    App.modifyProto = function(proto, actions, callbacks) {
        if (!proto || !actions) return;
        callbacks = callbacks || {};
        
        proto.createdCallback = function() {
            callbacks.createdCallback && callbacks.createdCallback.apply(this, arguments);
        };
        
        proto.attachedCallback = function() {
    	    App.listeners(actions, 'add');
            callbacks.attachedCallback && callbacks.attachedCallback.apply(this, arguments);;
    	};
    	
    	proto.detachedCallback = function() {
    		App.listeners(actions, 'remove');
            callbacks.detachedCallback && callbacks.detachedCallback.apply(this, arguments);;
    	};
        
        proto.attributeChangedCallback = function() {
            callbacks.attributeChangedCallback && callbacks.attributeChangedCallback.apply(this, arguments);;
        };
        
    }

    /**
     * Authentication request
     */
    function makeConnectionRequest() {
        var testRequest = App.request({
            type: 'GET',
            url: 'https://idonethis.com/api/v0.1/noop/',
            headers: {
                Authorization: 'Token ' + token
            }
        });

        testRequest.then(testConnectionCallback, testConnectionError);
    }

    /**
     *
     */
    function loadLastResponse() {
        var container = wrapper.querySelector('#donesResponse');
        var lastResponse = localStorage.getItem('last');
        if (lastResponse) {
            container.innerHTML = lastResponse;
        }
    }

    /**
     *
     */
    function preparePopup() {
        var clone = App.getTemplateContent('#link__dones', '#donesTemplate'),
            headerClone = App.getTemplateContent('#link__header', '#headerTemplate'),
            profileClone = App.getTemplateContent('#link__profile', '#profileTemplate');

        testNode.classList.add('hide');
        wrapper.appendChild(headerClone);
        wrapper.appendChild(clone);
        wrapper.querySelector('#profile').appendChild(profileClone);

        loadLastResponse();
    }
    
    /**
     * Displayed active groups
     */
    function loadTeamsList(event) {
        var configurableArea = document.querySelector('#configure');
        
        App.getTeams().then(function(items) {
            var content = App.getTemplateContent('#link__teams', '#teamsListTemplate');
            var listContainer = content.querySelector('#teamsList');
            listContainer.innerHTML = items;
                
            configurableArea.appendChild(content);
        });
    }

    /**
     *
     * @param message
     */
    function connectionMessage(message) {
        testNode.innerHTML = message;
    }

    /**
     * Success callback, if connection is established. Display 'get status' button
     * @param {Object} data Dones for requested period
     */
    function testConnectionCallback(data) {
        data.ok ? preparePopup() : connectionMessage('error connecting to iDoneThis server. Response error');
    }

    /**
     * If something goes wrong, display an error message instead
     * @param data
     */
    function testConnectionError(data) {
        connectionMessage('error connecting to iDoneThis server. Request error');
    }

    /**
     * Initial request
     */
    function init() {
        makeConnectionRequest();
    }

    init();
})(StatusApp, EventEmitter);