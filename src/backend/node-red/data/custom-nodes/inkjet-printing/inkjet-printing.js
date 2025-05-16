module.exports = function(RED) {
    function inkjet_printing(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Inkjet-printing",
                description: "Inkjet-printing: Printing with inkjet technology",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("inkjet-printing", inkjet_printing);
};