const express = require('express');
const session = require('express-session');
const path = require('path'); 
var mysql = require('mysql');
const bodyParser=require("body-parser");
var connection  = require('./db');
const { connect } = require('./db');
let alert=require('alert');
const { Script } = require('vm');
const e = require('express');
var flash=require('connect-flash');
var app = express();
 
app.use(express.static('public'))
app.get('/' ,(req,res)=>{

  res.sendFile(__dirname + "/index.html")

})
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/public/adminn.html',(req,res)=>{
	res.sendFile(__dirname+"/public/adminn.html");
})
app.set('view engine', 'ejs');
app.post('/admin',(req,res)=>{
	let username = req.body.username;
	let password = req.body.password;
	if(!username || !password){
		alert("Please enter email and password!!!");
		res.redirect("/admin.html");
	}
	else{
		if(username==='arun@123' && password==='1234' ){
			// res.redirect("./adminn.html");
			res.sendFile(__dirname+"/public/adminn.html");
	
		}
		else{
			// res.send(`<h1 style="color:red;">Invalid admin...</h1>`);
			// res.render('myview');
			// res.sendFile(__dirname+'/public/admin.html');
			alert("Invalid username or password!!!");
			res.redirect("./admin.html");
		}
	}
});

app.post('/login', (req,res)=> {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
    connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
        res.redirect("book.html");
		// res.send(`<h1 style="color:green;">You are logged in...</h1>`);
      }
      else {
				// res.send(`<h1 style="color:red;">Incorrect Username and/or Password!</h1>`);
				alert("Incorrect Username and/or Password!");
				res.redirect("/login.html");
			}			
			res.end();
		});
	} else {
		// res.send(`<h1 style="color:red;">Please enter Username and Password!</h1>`);
		alert("Please enter Username and Password!");
		res.redirect("/login.html");
		res.end();
	}
});


app.post('/register', (req,res)=> {
  let id = req.body.id;
  let name = req.body.name;
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
    var query=`INSERT INTO users (id,name,email,password) VALUES(?,?,?,?);`;
		connection.query(query,[id,name,username,password], function (err, result) {  
		if (err) throw err; 
		console.log("1 record inserted"); 
    // res.send(`<h1 style="color:green;">You are successfully registered</h1>`)
	alert("You are successfully registered");
	res.redirect("/register.html");
  }) 
}else {
		// res.send(`<h1 style="color:red;">Please fill all the details!</h1>`);
		alert("Please fill all the details!");
		res.redirect("/register.html");
		res.end();
	}
});

app.post('/book', (req,res)=> {
	let flname = req.body.flname;
	let email = req.body.email;
	let date = req.body.date;
	let center = req.body.center;
	if (flname && date && email && center) {
	  connection.query('SELECT booked FROM vaccination where center=?',[center],function(err,results){
		if (err) throw err;
		else{
			if(results[0].booked <10){
					var query=`INSERT INTO booked (flname,email,date,center) VALUES(?,?,?,?);`;
						connection.query(query,[flname,email,date,center], function (err, result) {  
						if (err) throw err; 
						else {
						  console.log("1 record inserted"); 
						  connection.query('UPDATE vaccination SET booked=booked+1 WHERE center=?;',[center],function(err,result){
							  if (err) throw err;
							  console.log("booked is updated");
						  });
						  // res.send(`<h1 style="color:green;">You are successfully booked your slot</h1>`);
						  alert("You are successfully booked your slot");
						  res.redirect("/book.html");
						}
				  	}) 
			}
			else{
				alert("Daily limit reached try another day:)");
				res.redirect("/book.html");
			}
		}
	})
	}
	else {
		//   res.send(`<h1 style="color:red;">Please fill all the details!</h1>`);
		alert("Please fill all the details!");
		res.redirect("/book.html");
		res.end();
	}
});

app.post("/search",(req,res)=>{
	let search = req.body.search;
	if(search){
		connection.query(`SELECT * FROM vaccination WHERE center LIKE CONCAT(?,'%');`,[search],function(error, results, fields){
			if(error) throw error;
			if(results.length != 0){
				res.render('search',{data:results});
			}
			else{
				// res.send(`<h1 style="color:red;">No data available...</h1>`);
				// res.end();
				// res.redirect(req.get('referer'));
				alert("No data available...");
				return false;
				// res.redirect("/index.html");
			}
		})
	}
	else{
		alert("Please enter search keyword");
		res.redirect("/index.html");
	}
});

app.post("/add",(req,res)=>{
	let center = req.body.center;
	let dose = req.body.dose;
	if(center && dose){
		connection.query("select center from vaccination where center=?;",[center],function(err,results){
			if (err) throw err;
			if(results.length === 0){
				connection.query(`INSERT INTO vaccination(center,dose,booked) VALUES(?,?,0);`,[center,dose],function(error, results, fields){
					if(error) throw error;
					else{
						console.log("1 row inserted");
						alert(`Center is successfully Added...`);
						res.redirect("/adminn.html");
						res.end();
						// res.send(`<h1 style="color:green;">Data is successfully Added...</h1>`)
						// res.sendFile(__dirname+'/public/adminn.html');
					}
				})
			}
			else{
				alert("Center is already available!");
				res.redirect("/adminn.html");
			}
		})
	}else{
		// res.send(`<h1>Please Enter center and dose</h1>`);
		alert("Please Enter center and dose");
		res.redirect("/adminn.html");
		res.end();
	}
});

app.post("/remove",(req,res)=>{
	let center = req.body.center;
	if(center){
		connection.query("select center from vaccination where center=?;",[center],function(err,results){
			if (err) throw err;
			if(results.length !== 0){
				connection.query(`DELETE FROM vaccination WHERE center=?;`,[center],function(error, results, fields){
					if(error) throw error;
					// res.send(`<h1 style="color:green;">Data is successfully deleted...</h1>`);
					alert("Center is successfully deleted...");
					res.redirect("/adminn.html");
					res.end();
				})
			}
			else{
				alert("Center is not available to delete!");
				res.redirect("/adminn.html");
			}
		})
	}
	else{
		// res.send(`<h1 style="red;">Please Enter center ....</h1>`);
		alert("Please Enter center ....");
		res.redirect("/adminn.html");
		res.end();
	}
});

app.get("/dosage",(req,res)=>{
connection.query(`SELECT * FROM vaccination;`,function(error, results, fields){
	if(error) throw error;
	if(results.length>0){
		// res.sendFile(__dirname+"/public/dosage.html");
		res.render('center',{data:results});
	}
	else{
		// res.send(`<h1 style="color:red;>There is no data available...</h1>`);
		alert("There is no data available...");
		res.redirect("/adminn.html");
		req.end();
	}
})
});

app.get("/booked",(req,res)=>{
	connection.query(`SELECT * FROM booked;`,function(error, results, fields){
		if(error) throw error;
		if(results.length>0){
			// res.sendFile(__dirname+"/public/dosage.html");
			res.render('booked',{data:results});
		}
		else{
			// res.send(`<h1 style="color:red;>There is no data available...</h1>`);
			alert("There is no data available...");
			res.redirect("/adminn.html");
			req.end();
		}
	})
	});

app.listen(3000,()=>{
  console.log(`Server running at 127.0.0.1:3000`);
});