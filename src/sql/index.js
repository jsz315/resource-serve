const mysql = require("mysql");
const config = require('../core/config');
const resource = require("./resource");

let connection;
resetConnect();

function resetConnect() {
    if(!connection){
        connection = mysql.createConnection(config.databaseConfig);
    }
    connection.connect();
    resource.init(connection);

    connection.on('error', function(err) {
      if (!err.fatal) {
        return;
      }
   
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        console.log(err);
        return "无法连接数据库";
      }
   
      console.log('重新链接数据库');
      resetConnect();
    });
}

module.exports = {
    resource
}