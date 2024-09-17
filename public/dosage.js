var connection  = require('./db');
connection.query(`SELECT * FROM vaccination;`,function(error, results, fields){
	if(error) throw error;
	document.getElementById("data").innerHTML=results;
})