module.exports = function(RED) {
    'use strict';

    function si_t(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        this.address = config.address;

        this.on('input', (msg, send, done) => {
            let payload = msg.payload;
            if(Array.isArray(payload)) {
                node.status({});
                payload.forEach(item => {
                    if(item.device_address == parseInt(node.address)) {
                        send({payload: item.temperature});
                        done();
                    }
                });
            } else {
                node.status({fill:'yellow',shape:'dot',text:'Invalid input'});
            }
        });
    }

    RED.nodes.registerType('iqhome-si-t', si_t);
}
