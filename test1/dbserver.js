const express = require('express');
const app = express();
const mysql = require('mysql');
require("dotenv").config();
const DB_HOST = process.env.DB_HOST;
const DB_USER =process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE =process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;
const port = process.env.PORT;
const db = mysql.createConnection({
    connectionLimit:100,
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_DATABASE,
    port:DB_PORT
});
app.get('/' ,(req,res)=>{

    res.sendFile(__dirname + "/login.html")

})
//Login Authentication
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/',(req,res)=>{
    const user=req.body.username;
    const password=req.body.password;
    db.getConnection(async(err,connection)=>{
        if(err) throw err
        const sqlSearch ="select * from datauser where user=?"
        const search_query = mysql.format(sqlSearch,[user])
        await connection.query(search_query,async(err,result)=>{
            connection.release();
            if(err) throw err
            if(result.length == 0){
                console.log("--------> User doesnot exist")
                res.sendStatus(404)
            }
            else{
                const hashedPassword = result[0].password
                if(awaitbcrypt.compare(password,hashedPassword)){
                    console.log("------->Login successful");
                    res.send(`${user} is logged in!`)
                }
                else{
                    console.log("--------->Password Incorrect");
                    res.send("Password Incorrect!")
                }
            }
        })
    })
});



app.listen(port,()=>{
    console.log(`Server running at ${DB_HOST}:${port}`);
})
