module.exports = function(RED) {
    function machine(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Machine",
                description: "Machine: Equipment or tools used for automated or mechanical processes",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("machine", machine);
};