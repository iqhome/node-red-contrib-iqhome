module.exports = function(RED) {
    'use strict';

    function si_th(config) {
        RED.nodes.createNode(this, config);

        this.on('input', (msg, send, done) => {

        });
    }

    RED.nodes.registerType('iqhome-si-th', si_th);
}