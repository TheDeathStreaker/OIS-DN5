/*
 * ORM - Exercise 2
 *
 * How to find objects using ORM query language? (similar to Exercise 1)
 * [http://sequelizejs.com/docs/1.7.8/models#finders]
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',})
var Project = require('sequelize-import')(__dirname + '/models', sequelize, { exclude: ['index.js'] });

Project.Products
	// 1. Find the product name where ProductID is 1
	.find({ where: { ProductID: 1 } })
	.success(function(qr) {
		
		if(qr == null)
			throw "Err";
		//console.log(qr); // 2. Uncomment to see raw output / object with attributes and values / to debug
		
		// 3. Use raw output or ORM models (models/*.js) to determine object's attribute names
		console.log("---");
		console.log("Product Name: " + qr.ProductName);
	})
	// 4. Error handler
	.error(function(err) {
		console.log("Err");
});
