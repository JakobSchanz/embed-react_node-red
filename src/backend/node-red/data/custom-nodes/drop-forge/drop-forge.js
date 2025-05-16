module.exports = function(RED) {
    function drop_forge(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Drop-forge",
                description: "Drop-forge: Forging with a drop hammer",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("drop-forge", drop_forge);
};