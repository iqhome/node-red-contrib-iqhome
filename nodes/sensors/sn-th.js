module.exports = function(RED) {
    'use strict';

    function sn_th(config) {
        RED.nodes.createNode(this, config);
        var node = this;
    }

    RED.nodes.registerType('iqhome-sn-th', sn_th);
}