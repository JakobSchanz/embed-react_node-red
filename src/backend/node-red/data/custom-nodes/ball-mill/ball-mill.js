module.exports = function(RED) {
    function ball_mill(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Ball-mill",
                description: "Ball-mill: Grinding with a ball mill",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("ball-mill", ball_mill);
};