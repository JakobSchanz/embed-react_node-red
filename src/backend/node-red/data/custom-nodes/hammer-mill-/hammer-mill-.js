module.exports = function(RED) {
    function hammer_mill_(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Hammer-mill ",
                description: "Hammer-mill : Crushing with a hammer mill",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("hammer-mill-", hammer_mill_);
};