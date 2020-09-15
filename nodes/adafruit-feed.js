module.exports = function(RED) {
    'use strict';

    function adafruit_feed(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        this.on('input', (msg, send, done) => {
            msg.feed = config.feed;
            send(msg);
            done();
        });
    }

    RED.nodes.registerType('iqhome-adafruit-feed', adafruit_feed);
}
