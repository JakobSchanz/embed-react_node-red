module.exports = function(RED) {
    function press(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Press",
                description: "Press: Pressing of materials",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("press", press);
};