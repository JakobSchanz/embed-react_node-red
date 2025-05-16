module.exports = function(RED) {
    function submerged(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Submerged",
                description: "Submerged: Submerged arc welding",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("submerged", submerged);
};