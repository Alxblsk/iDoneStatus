(function(App) {
    'use strict';

    var mailToken = window.mail_token || 'token_should_be_here';

    App.sendReport = function(params) {
        var requestData = window.emailData || {
                type: 'POST',
                url: 'https://mandrillapp.com/api/1.0/messages/send.json',
                data: {
                    'key': mailToken,
                    'message': {
                        'from_email': 'abelski@example.com',
                        'to': [
                            {
                                'email': 'xxx@xxx.com',
                                'name': 'Mr. Smith',
                                'type': 'to'
                            }
                        ],
                        'autotext': 'true',
                        'subject': 'Test statuses from chrome extention by email',
                        'html': null,
                        'send_at': "2015-01-01 00:00:01"
                    }
                }
            };

        if (!requestData.data.html) {
            requestData.data.message.html = params.html;
        }

        var send = App.request(requestData);

        send.then(successCallback, errorCallback);

        function successCallback(data) {
            console.log('success', data);
        }

        function errorCallback(data) {
            console.log('error', data);
        }
    }

})(StatusApp);