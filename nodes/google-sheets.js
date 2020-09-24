const { https } = require('follow-redirects');

module.exports = function(RED) {
    'use strict';

    function sheets(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        function transformData(values, property) {
            let c = 1;
            let data = [new Date().toUTCString()];
            values.forEach(element => {
                if(element.device_address == c) {
                    data.push(element[property] || '');
                } else {
                    let cc = c
                    for(let i = 0; i < element.device_address - cc; i++) {
                        data.push('');
                        c++;
                    }
                    data.push(element[property] || '');
                }
                c++;
            });

            return data;
        }

        node.on('input', (msg, send, done) => {
            if(config.scriptURL && config.sheetURL) {
                const regex = /\w*(?=\/edit)/g;
                const devices = msg.payload[msg.payload.length - 1].device_address;

                const sheetId = regex.exec(config.sheetURL);
                if(sheetId) {
                    msg.payload.sort((a, b) => (a.device_address > b.device_address) ? 1 : -1);
                    const body = JSON.stringify({
                        spreadsheet: sheetId[0],
                        devices: devices,
                        temp: transformData(msg.payload, 'temperature'),
                        hum: transformData(msg.payload, 'relative_humidity'),
                        co: transformData(msg.payload, 'co2')
                    });

                    let url;
                    try {
                        url = new URL(config.scriptURL);
                    } catch(e) {
                        node.status({fill:'red',shape:'dot',text:'Invalid URL'});
                        node.error('Invalid Script URL');
                        done();
                        return;
                    }
    
                    const options = {
                        hostname: url.hostname,
                        path: url.pathname,
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': body.length,
                            'User-Agent': 'Node-RED',
                        },
                        method: 'POST'
                    }

                    const req = https.request(options, response => {
                        response.on('data', data => {
                            let res;
                            try {
                                res = JSON.parse(data.toString());
                            } catch(e) {
                                node.error('Could not parse response ' + e);
                                node.status({fill:'red',shape:'dot',text:'Error'});
                            }

                            if(res.response === true) {
                                node.status({fill:'green',shape:'dot',text:'OK'});
                            } else {
                                node.status({fill:'red',shape:'dot',text:'Error'});
                            }
                        });
                        done();
                    });

                    req.write(body);
                    req.end();
                }
            }
        });
    }

    RED.nodes.registerType('iqhome-google-sheets', sheets);
}
