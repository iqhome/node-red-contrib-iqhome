const https = require('https');

module.exports = function(RED) {
    'use strict';

    function sheets(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        let r_id = /(?<=d = ')[\w-]*/gm;
        let r_pkey = /(?<=pkey=)\w*/gm;
        let r_auth = /(?<=': ')[\w-]*/gm;

        node.on('input', (msg, send, done) => {
            if(config.sheetData) {
                let pizzly = {
                    id: r_id.exec(config.sheetData)[0],
                    pkey: r_pkey.exec(config.sheetData)[0],
                    auth: r_auth.exec(config.sheetData)[0]
                };
            }
        });
    }

    RED.nodes.registerType('iqhome-google-sheets', sheets);
}
