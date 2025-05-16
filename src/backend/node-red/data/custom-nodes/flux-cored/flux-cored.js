module.exports = function(RED) {
    function flux_cored(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Flux-cored",
                description: "Flux-cored: Flux-cored arc welding",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("flux-cored", flux_cored);
};