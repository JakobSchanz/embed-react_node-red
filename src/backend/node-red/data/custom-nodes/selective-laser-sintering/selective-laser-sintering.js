module.exports = function(RED) {
    function selective_laser_sintering(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Selective-laser-sintering",
                description: "Selective-laser-sintering: Selective laser sintering process",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("selective-laser-sintering", selective_laser_sintering);
};