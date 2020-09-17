module.exports = function(RED) {
	"use strict";
	const dgram = require('dgram');
	var usedPorts = {};

	function gwInput(config) {
		RED.nodes.createNode(this, config);
		this.port = config.port;
		var node = this;

		var server;

		if(!usedPorts.hasOwnProperty(node.port)) {
			server = dgram.createSocket('udp4');
			server.bind(node.port);
			usedPorts[node.port] = server;
		} else {
			server = usedPorts[node.port];
		}

		server.on('error', (err) => {
			node.status({fill: 'red', shape: 'dot', text: 'error'});
			node.error(err.message);
			server.close();
		});

		server.on('message', msg => {
			try {
				var obj = JSON.parse(msg.toString());
				if(obj.message_topic === '$GW/application' || obj.message_topic === '$GW/sensnet') {
					node.send({payload: obj.message.values});
				}
				node.status({fill: 'green', shape: 'dot', text: 'listening'});
			} catch(e) {
				node.status({fill: 'yellow', shape: 'dot', text: 'invalid JSON'});
				node.error(e);
			}
		});

		server.on('listening', () => {
			node.status({fill: 'green', shape: 'dot', text: 'listening'});
			node.log('IQHome listening on UDP ' + node.port);
		})

		node.on('close', () => {
			try {
				server.close();
			} catch (error) {
				node.error(error);
			}
			if(usedPorts.hasOwnProperty(node.port)) {
				delete usedPorts[node.port];
			}
		});
	}

	RED.nodes.registerType("iqhome-gw-input", gwInput);
}