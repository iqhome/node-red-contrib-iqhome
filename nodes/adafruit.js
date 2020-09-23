const https = require('http');
const querystring = require('querystring');

module.exports = function(RED) {
    'use strict';

    const rate = {
        normal: 2100,
        premium: 1100
    }

    function adafruit(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        node.messages = [];

        function sendNext(send, done) {
            const next = node.messages.shift();

            const body = querystring.stringify({
                value: next.payload
            });

            const options = {
                hostname: 'io.adafruit.com',
                path: '/api/v2/' + config.username + '/feeds/' + next.topic + '/data',
                headers: {
                    'X-AIO-Key': node.credentials.apiKey,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                },
                method: 'POST'
            };

            const req = https.request(options, response => {
                if(response.statusCode == 200) {
                    node.status({fill:'green',shape:'dot',text:'OK'});
                } else {
                    node.status({fill:'red',shape:'dot',text:'Error'});
                    node.error("Error posting to Adafruit: status code " + response.statusCode);
                }
            });

            req.write(body);
            req.end();

            if(node.messages.length > 0) {
                if(config.premium) {
                    setTimeout(sendNext, rate.premium, send, done);
                } else {
                    setTimeout(sendNext, rate.normal, send, done);
                }
            } else {
                done();
            }
        }

        node.on('input', (msg, send, done) => {
            node.messages.push(msg);
            if(node.messages.length === 1) {
                if(config.premium) {
                    setTimeout(sendNext, rate.premium, send, done);
                } else {
                    setTimeout(sendNext, rate.normal, send, done);
                }
            }
        });
    }

    RED.nodes.registerType('iqhome-adafruit', adafruit, {
        credentials: {
            apiKey: {type: "password"}
        }
    });
}
