module.exports = function(RED) {
    function extrusion(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Extrusion",
                description: "Extrusion: Extrusion of materials",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("extrusion", extrusion);
};