(function(App) {
    'use strict';

    var mailToken = window.mail_token || 'token_should_be_here';

    App.sendReport = function(params) {
        var send = App.request({
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
                    'html': params.html,
                    'send_at': "2015-01-01 00:00:01"
                }
            }
        });

        send.then(successCallback, errorCallback);

        function successCallback(data) {
            console.log('success', data);
        }

        function errorCallback(data) {
            console.log('error', data);
        }
    }

})(StatusApp);