const http = require('http');
const express = require("express");
const RED = require("node-red");
const path = require('path');

async function startNodeRed() {
    const app = express();
    const server = http.createServer(app);

    const settings = require(path.join(__dirname, '../../data/programm_data/node_red_settings/settings.js'));

    RED.init(server, settings);
    app.use(settings.httpAdminRoot, RED.httpAdmin);
    app.use(settings.httpNodeRoot, RED.httpNode);

    server.listen(8000);
    await RED.start();
}

module.exports = startNodeRed;
