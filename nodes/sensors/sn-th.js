module.exports = function(RED) {
    'use strict';

    function sn_th(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        this.address = config.address;

        this.on('input', (msg, send, done) => {
            let payload = msg.payload;
            if(Array.isArray(payload)) {
                node.status({});
                payload.forEach(item => {
                    if(item.device_address === parseInt(config.address)) {
                        send([
                            {
                                payload: item.temperature || null,
                                topic: (config.temperatureTopic || config.default_temperatureTopic)
                            },
                            {
                                payload: item.relative_humidity || null,
                                topic: (config.humidityTopic || config.default_humidityTopic)
                            }
                        ]);
                        done();
                    }
                });
            } else {
                node.status({fill:'yellow',shape:'dot',text:'Invalid input'});
            }
        });
    }

    RED.nodes.registerType('iqhome-sn-th', sn_th);
}
