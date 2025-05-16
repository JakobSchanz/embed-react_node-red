module.exports = function(RED) {
    function resin_casting(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Resin-casting",
                description: "Resin-casting: Casting with resin",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("resin-casting", resin_casting);
};