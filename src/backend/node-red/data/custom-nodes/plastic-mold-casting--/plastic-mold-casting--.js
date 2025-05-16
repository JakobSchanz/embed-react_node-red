module.exports = function(RED) {
    function plastic_mold_casting__(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Plastic-mold-casting  ",
                description: "Plastic-mold-casting  : Casting of plastic molds",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("plastic-mold-casting--", plastic_mold_casting__);
};