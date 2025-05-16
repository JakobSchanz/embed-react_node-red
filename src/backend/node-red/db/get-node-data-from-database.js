const mysql = require('mysql2/promise');
const dbConfig = require('../../data/programm_data/db/db-config.js');

async function getDataFromDB(tables) {
    let all_results = [];

    const connection = await mysql.createConnection(dbConfig.basic_config);

    for (const table of tables) {
        const [results] = await connection.execute(`SELECT * FROM ${table}`); 
        all_results = all_results.concat(results); 
    }

    await connection.end();

    return all_results;
}

module.exports = getDataFromDB;
