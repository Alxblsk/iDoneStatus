(function(App) {
    'use strict';

    var token = window.token || 'token_should_be_here';

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
     * Success callback, if connection is established. Display 'get status' button
     * @param {Object} data Dones for requested period
     */
    function testConnectionCallback(data) {
        var testNode = document.getElementById("testResponse"),
            shadow = document.querySelector('#getDonesButton').createShadowRoot(),
            link = document.querySelector('link#link__getDoneForm'),
            template = link.import.querySelector("#getDonesTemplate"),
            clone = document.importNode(template.content, true);

        var header = document.querySelector('link#link__header'),
            headerTemplate = header.import.querySelector("#headerTemplate"),
            headerClone = document.importNode(headerTemplate.content, true);

        if (data.ok) {
            testNode.classList.add('hide');
            shadow.appendChild(headerClone);
            shadow.appendChild(clone);
            shadow.querySelector('#hamburger').addEventListener('click', function(event) {
                event.target.classList.toggle('active');
            }, false);
            shadow.querySelector('button').addEventListener('click', function() {
                App.getDones({
                    done_date: shadow.querySelector('#doneDate').value,
                    tags: shadow.querySelector('#hashtag').value
                });
            }, false);
            shadow.querySelector('#sendMail').addEventListener('click', function() {
                App.sendReport({
                    html: localStorage.getItem('last')
                })
            }, false);

            var lastResponse = localStorage.getItem('last');
            lastResponse && (shadow.querySelector('#donesResponse').innerHTML = lastResponse);
        } else {
            testNode.innerHTML = "error connecting to iDoneThis server. Response error";
        }
    }

    /**
     * If something goes wrong, display an error message instead
     * @param data
     */
    function testConnectionError(data) {
        var testNode = document.getElementById("testResponse");
        testNode.innerHTML = "error connecting to iDoneThis server. Request error";
    }

    /**
     * Initial request
     */
    function init() {
        makeConnectionRequest();
    }

    init();
})(StatusApp);