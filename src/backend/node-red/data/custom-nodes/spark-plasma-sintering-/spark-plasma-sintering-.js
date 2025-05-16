module.exports = function(RED) {
    function spark_plasma_sintering_(config) {
        RED.nodes.createNode(this, config);
        this.on('input', msg => {
            msg.payload = {
                nodeName: "Spark-plasma-sintering ",
                description: "Spark-plasma-sintering : Spark plasma sintering process",
                data: msg.payload
            };
            this.send(msg);
        });
    }
    RED.nodes.registerType("spark-plasma-sintering-", spark_plasma_sintering_);
};