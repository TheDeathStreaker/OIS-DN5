/*
 * ORM - Exercise 1
 *
 * How to execute a raw SQL query using sequelize (via mysql)
 */

var Sequelize = require('sequelize');

// 1. Connect to the northwind database using U: nodejs P: nodejs
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',})

// 2. Select ProductName from table Products where ProductID is 1
sequelize.query("SELECT ProductName FROM Products WHERE ProductID=1").success(function(qr) {
	console.log("---");
	// 3. Print out the query result
	console.log(qr); // qr ... query result
});
