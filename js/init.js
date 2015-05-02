(function(App, EventEmitter) {
    'use strict';

    var token = window.token || 'token_should_be_here';
    var wrapper = document.querySelector('#wrapper');
    var testNode = document.getElementById("testResponse");
    
    var emitter = new EventEmitter()

    /**
     *
     * @param linkSelector
     * @param templateSelector
     * @returns {Node}
     */
    function getTemplateContent(linkSelector, templateSelector) {
        var link = document.querySelector(linkSelector),
            template = link.import.querySelector(templateSelector);

        return document.importNode(template.content, true);
    }
    
    App.getTemplateContent = getTemplateContent;
    
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
     * @param event
     */
    function getDones(event) {
        App.getDones({
            done_date: wrapper.querySelector('#doneDate').value,
            tags: wrapper.querySelector('#hashtag').value
        });
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

    function filterDones(event) {
        var button = event.target;
        var filterClone = getTemplateContent('#link__filter', '#filterTemplate');
        var configurableArea = document.querySelector('#configure');
        var filterNode = document.querySelector('#getDones');

        if (filterNode) {
            filterNode.classList.toggle('hide');
        } else {
            configurableArea.appendChild(filterClone);
            document.querySelector('#getDonesButton').addEventListener('click', getDones, false);
        }
        button.classList.toggle('header__item_open');
    }

    /**
     *
     */
    function preparePopup() {
        var clone = getTemplateContent('#link__dones', '#donesTemplate'),
            headerClone = getTemplateContent('#link__header', '#headerTemplate'),
            profileClone = getTemplateContent('#link__profile', '#profileTemplate');

        testNode.classList.add('hide');
        wrapper.appendChild(headerClone);
        wrapper.appendChild(clone);
        wrapper.querySelector('#profile').appendChild(profileClone);
        //wrapper.querySelector('#filterDones').addEventListener('click', filterDones, false);
        //wrapper.querySelector('#chooseTeam').addEventListener('click', loadTeamsList, false);

        loadLastResponse();
    }
    
    /**
     * Displayed active groups
     */
    function loadTeamsList(event) {
        var configurableArea = document.querySelector('#configure');
        
        App.getTeams().then(function(items) {
            var content = getTemplateContent('#link__teams', '#teamsListTemplate');
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