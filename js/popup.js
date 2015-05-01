(function(App) {
    'use strict';

    var token = window.token || 'token_should_be_here';
    var wrapper = document.querySelector('#wrapper');
    var testNode = document.getElementById("testResponse");

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
     * @param linkSelector
     * @param templateSelector
     * @returns {Node}
     */
    function getTemplateContent(linkSelector, templateSelector) {
        var link = document.querySelector(linkSelector),
            template = link.import.querySelector(templateSelector);

        return document.importNode(template.content, true);
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

    function login() {
        console.log('login button');
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
        wrapper.querySelector('#filterDones').addEventListener('click', filterDones, false);

        loadLastResponse();
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
})(StatusApp);