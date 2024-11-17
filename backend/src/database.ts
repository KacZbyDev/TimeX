const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath,(err:any)=>{
    if(err){
        console.log("skill issue")
    }else{
        console.log("connected to database")
    }
});

module.exports = db;