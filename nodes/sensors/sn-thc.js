module.exports = function(RED) {
    'use strict';

    function sn_thc(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        this.address = config.address;

        this.on('input', (msg, send, done) => {
            let payload = msg.payload;
            if(Array.isArray(payload)) {
                node.status({});
                payload.forEach(item => {
                    if(item.device_address == node.address) {
                        send([{payload: item.temperature}, {payload: item.relative_humidity}, {payload: item.co2}]);
                        done();
                    }
                });
            } else {
                node.status({fill:'yellow',shape:'dot',text:'Invalid input'});
            }
        });
    }

    RED.nodes.registerType('iqhome-sn-thc', sn_thc);
}
