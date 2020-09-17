module.exports = function(RED) {
    'use strict';

    function si_t(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        this.on('input', (msg, send, done) => {
            let payload = msg.payload;
            if(Array.isArray(payload)) {
                node.status({});
                payload.forEach(item => {
                    if(item.device_address == parseInt(config.address)) {
                        send({
                            payload: item.temperature || null,
                            topic: (config.temperatureTopic || config.default_temperatureTopic)
                        });
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
