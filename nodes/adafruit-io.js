module.exports = function(RED) {
    'use strict';

    function adafruit_io(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        this.on('input', (msg, send, done) => {
            let payload = msg.payload;
        });
    }

    RED.nodes.registerType('iqhome-adafruit-io', adafruit_io);
}
