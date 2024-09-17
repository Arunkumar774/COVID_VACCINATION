const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { json } = require('express');
const app=express();
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
app.get('/logindata',(req,res)=>{
    res.sendFile(__dirname + "/index.html")
})
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/auth', (req,res)=> {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		var sql = "INSERT INTO datauser (user, password, id) VALUES ('user', 'password', 'o170324')";  
		db.query(sql, function (err, result) {  
		if (err) throw err;  
		console.log("1 record inserted");  })
		// db.query("INSERT INTO datauser WHERE user = ? AND password = ? AND id=?', [username, password,o170324]",function(err,results,fields){
		// db.query('SELECT * FROM LoginDB.datauser WHERE user = ? AND password = ?', [username, password], function(error, results, fields) {
			// if (error) throw error;
			// if (results.length > 0) {
			// 	req.session.loggedin = true;
			// 	req.session.username = username;
                // db.query('SELECT id FROM LoginDB.datauser WHERE user = ? AND password = ?', [username, password],(err,results,fields)=>{
                //     if (error) throw error;
			    //     if (results.length > 0){
                //         const ob = JSON.stringify(results);
                //         console.log(JSON.stringify(results))
                //         const obj = JSON.parse(ob,(key,value)=>{
                //             console.log(value)
                //         })
                //         console.log(obj.id)
                //     }
                // })
                // res.send(`<h1>User successfully Logged in!</h1>`)
		// 		res.redirect('/logindata');
		// 	} else {
		// 		res.send(`<h1>Incorrect Username and/or Password!</h1>`);
		// 	}			
		// 	res.end();
		// });
	 } else {
		res.send(`<h1>Please enter Username and Password!</h1>`);
		res.end();
	}
});

app.listen(port,()=>{
    console.log(`Server running at ${DB_HOST}:${port}`);
})
