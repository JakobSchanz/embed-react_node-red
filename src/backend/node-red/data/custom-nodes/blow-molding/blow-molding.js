module.exports = function(RED) {
    function blow_molding(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Blow-molding",
                description: "Blow-molding: Blow molding of plastics",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("blow-molding", blow_molding);
};