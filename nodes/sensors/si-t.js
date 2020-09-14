module.exports = function(RED) {
    'use strict';

    function si_t(config) {
        RED.nodes.createNode(this, config);
        var node = this;
    }

    RED.nodes.registerType('iqhome-si-t', si_t);
}