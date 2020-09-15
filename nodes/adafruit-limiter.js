module.exports = function(RED) {
    'use strict';

    const rate = {
        normal: 2100,
        premium: 1100
    }

    function adafruit_limiter(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        node.messages = [];

        function sendNext(send, done) {
            const next = node.messages.shift();
            send({
                payload: next.payload,
                topic: config.username + '/feeds/' + next.feed
            });
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

    RED.nodes.registerType('iqhome-adafruit-limiter', adafruit_limiter);
}
