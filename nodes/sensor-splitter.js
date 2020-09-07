module.exports = function(RED) {
	"use strict";

	function sensorSplitter(config) {
		RED.nodes.createNode(this, config);
		var node = this;
	}

	RED.nodes.registerType("iqhome-sensor-splitter", sensorSplitter);
}