/*
 * ORM - Exercise 6
 *
 * How to find objects using ORM query language and
 *        include one [Many-to-Many] association indirectly?
 */

var Sequelize = require('sequelize')
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',})
var Project = require('sequelize-import')(__dirname + '/models', sequelize, { exclude: ['index.js'] });

// 1. Define Many-to-Many association via two One-to-Many associations.
Project.Orders.hasMany(Project.OrderDetails, {foreignKey: 'OrderID'});
Project.OrderDetails.belongsTo(Project.Products, {foreignKey: 'ProductID'});

Project.Orders
	// 2. Find the order's date (and associated products' names and ordered quantitiy) where OrderID is 10248
	.find({ where: { OrderID: 10248 }, include: [{ model: Project.OrderDetails, include: [Project.Products,] }] })
	// 3. Use nested eager loading              ^--------- Reference Products via OrderDetails ---------------^
	//    to load associations of association, 
	//    i.e. to access Products via Order Details.
	//    [http://sequelizejs.com/docs/1.7.8/models#eager-loading, see Nested eager loading]
	.success(function(qr) {

		if(qr == null)
			throw "Err";
		//console.log(qr);

		console.log("---");
		console.log("Order Date: " + qr.OrderDate);
		qr.OrderDetails.forEach(function(ass) {
			//console.log(ass);
			console.log("Product Name: " + ass.Product.ProductName + ", Ordered Quantity: " + ass.Quantity);
		});
	})
	.error(function(err) {
		console.log("Err");
});
