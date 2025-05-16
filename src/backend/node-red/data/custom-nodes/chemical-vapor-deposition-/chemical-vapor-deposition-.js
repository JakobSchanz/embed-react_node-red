module.exports = function(RED) {
    function chemical_vapor_deposition_(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Chemical-vapor-deposition ",
                description: "Chemical-vapor-deposition : Chemical vapor deposition process",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("chemical-vapor-deposition-", chemical_vapor_deposition_);
};