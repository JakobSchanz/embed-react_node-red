module.exports = function(RED) {
    function labour(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Labour",
                description: "Labour: Workforce involved in production or service tasks",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("labour", labour);
};