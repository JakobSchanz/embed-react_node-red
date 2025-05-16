module.exports = function(RED) {
    function shape(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Shape",
                description: "Shape: Shaping through forming techniques",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("shape", shape);
};