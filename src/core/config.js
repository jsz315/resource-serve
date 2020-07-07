const fs = require('fs')
const path = require('path')

const databaseConfig = {
    // host: "122.51.176.36",
    // user: "root",
    // password: "Jsz04005301!",
    // database: "qiniu",

    host: "localhost",
    user: "root",
    password: "Jsz04005301",
    database: "asset"
}

const bucket = "three-js-model";
const accessKey = 'MDNdTeEsk_7k4LrKpMwSO_ZtrbOoWPwbMRk4pA8w';
const secretKey = 'vNlCEQ2elBBnxT-h-16kVS-yDzil7qjybSw9K9QK';
const HOST = "http://py325bkfy.bkt.clouddn.com";


const deleteImg = function(name){
    var fname = path.resolve(__dirname, "../../static/upload/" + name);
    fs.unlink(fname, (error)=>{
        if(error){
            console.log(error);
            console.log("delete fail");
        }
        else{
            console.log("[delete success]", fname);
        }
    });
}

module.exports = {
    databaseConfig, 
    bucket,
    accessKey,
    secretKey,
    HOST,
    deleteImg
}