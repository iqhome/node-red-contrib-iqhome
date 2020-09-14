module.exports = function(RED) {
    'use strict';

    function sn_thc(config) {
        RED.nodes.createNode(this, config);
        var node = this;
    }

    RED.nodes.registerType('iqhome-sn-thc', sn_thc);
}