/*
 * ORM - Exercise 5
 *
 * How to find objects using ORM query language and
 *        include one [Many-to-Many] association directly?
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',})
var Project = require('sequelize-import')(__dirname + '/models', sequelize, { exclude: ['index.js'] });

// 1. Define Many-to-Many Association (two statements)
Project.Products.hasMany(Project.Orders, {foreignKey: 'ProductID', through: 'OrderDetails'});
Project.Orders.hasMany(Project.Products, {foreignKey: 'OrderID', through: 'OrderDetails'});
// 2. Orders are associated to Products through OrderDetails     ^---------------------^

Project.Orders
	// 3. Find the order's date (and associtated products' names) where OrderID is 10248
	.find({ where: { OrderID: 10248 }, include: [Project.Products,] })
	.success(function(qr) {

		if(qr == null)
			throw "Err";
		//console.log(qr);

		console.log("---");
		console.log("Order Date: " + qr.OrderDate);
		qr.Products.forEach(function(ass) {
			//console.log(ass);
			console.log("Product Name: " + ass.ProductName);
		});
		console.log('---')
	})
	.error(function(err) {
		console.log("Err");
});
