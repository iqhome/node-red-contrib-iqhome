var https = require('https');

module.exports = function(RED) {
    function thingspeak(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.topics = [
            config.topic1,
            config.topic2,
            config.topic3,
            config.topic4,
            config.topic5,
            config.topic6,
            config.topic7,
            config.topic8
        ];

        node.timeout = null;

        clearStoredValues();

        function clearStoredValues() {
            node.values = [ null, null, null, null, null, null, null, null ];
            node.status({fill:"green",shape:"dot",text:"ready"});
        };

        function storeValue(index, value) {
            node.values[index] = value;
            node.status({fill:"yellow",shape:"ring",text:"data queued, waiting..."});
        };

        function getValue(index) {
            return node.values[i];
        }

        function startTimer() {
            if( node.timeout == null ) {
                let delayMs = 15000;
                if(config.premium) {
                    delayMs = 1000;
                }

                node.timeout = setTimeout(publishData, delayMs);
            }
        }

        function stopTimer() {
            if( node.timeout != null ) {
                clearTimeout(node.timeout);
                node.timeout = null;
            }
        }

        function publishData() {
            node.status({fill:"blue",shape:"dot",text:"uploading data..."});

            var url = buildThingSpeakURL();
            stopTimer();

            https.get(url, function(response) {
                    if(response.statusCode == 200){
                    } else {
                        node.error("Error posting to ThingSpeak: status code " + response.statusCode);
                    }
                }
            ).on('error', function(e) {
                node.error("Error posting to ThingSpeak: " + e);
            });

            clearStoredValues();
        }

        function buildThingSpeakURL() {
            var url = "https://thingspeak.com/update?api_key=" + node.credentials.apiKey;
            for( i=0; i < node.topics.length; i++ ) {
                var val = getValue(i);
                if (val != null) {
                    url = url + "&field" + (i + 1) + "=" + val;
                }
            }
            return url;
        }

        function updateStatus() {
            if( timeout == null ) {
                status({fill:"green",shape:"dot",text:"ready"});
            } else {
                status({fill:"blue",shape:"ring",text:"waiting to push"});
            }
        }

        this.on('input', function(msg) {
            for(i=0; i < node.topics.length; i++) {
                if( msg.topic == node.topics[i] ) {
                    storeValue(i, msg.payload);
                    startTimer();
                }
            }
        });

        this.on('close', function() {
            stopTimer();
        });
    };

    RED.nodes.registerType("iqhome-thingspeak", thingspeak, {
        credentials: {
            apiKey: {type: "password"}
        }
    });
};
