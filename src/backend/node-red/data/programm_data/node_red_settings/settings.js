const path = require('path');

module.exports = { 
    httpAdminRoot: "/",       
    httpNodeRoot: "/api",         
    userDir: path.resolve(__dirname, "../../.nodered"),    
    nodesDir: [path.resolve(__dirname, "../../custom-nodes")],  

    adminAuth: {
        type: "credentials",
        users: [
            {
                username: "admin",
                password: "$2b$08$HT8ohEib9yB6fzKdj95LHeKZZ.6Mx./xXNb56cLGFNaLkO7BR2Cmq", //jjj123
                permissions: "*" //all permissions
            },
            {
                username: "test",
                password: "$2b$08$OgSuvr4P8h9CmDta7hk3nOuOWs8wkUjsML/l5ND7uDQvF1kzvhJ8W", //test
                permissions: "read"
            }
            // to add new user password has to hash use: npx node-red admin hash-pw  
        ]
    },  
};
