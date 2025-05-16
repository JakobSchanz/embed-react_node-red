module.exports = function(RED) {
    function ring(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Ring",
                description: "Ring: Manufacturing of rings through forming",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("ring", ring);
};