/*
 * ORM - Exercise 3
 *
 * How to find objects using ORM query language and
 *        include one [One-to-Many] association?
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',})
var Project = require('sequelize-import')(__dirname + '/models', sequelize, { exclude: ['index.js'] });

// 1. Define One-to-Many Associations
//    [http://sequelizejs.com/docs/1.7.8/associations]
Project.Suppliers.hasMany(Project.Products, {foreignKey: 'SupplierID'});
Project.Suppliers
	// 2. Find the supplier's address (and associated product names) where Company Name is Exotic Liquids
	//    [http://sequelizejs.com/docs/1.7.8/models#finders]
	.find({ where: { CompanyName: 'Exotic Liquids' }, include: [Project.Products,] })
	// 3. Add the association                         ^--------------------------^
	//                                                 Define the include attribute by 
	//                                                 setting the Project.Products association model.
	.success(function(qr) {

		if(qr == null)
			throw "Err";
		//console.log(qr);

		console.log("---");
		console.log("Address: " + qr.Address);

		// 4. Iterate through supplier's products (association) indirectly using handler function
		qr.Products.forEach(function(ass) { // ass ... means association
			// Iterate throuh JS Array (i.e. qr.OrderDetails) using forEach method.
			// [https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach]
			//console.log(ass);
			console.log("Product Name: " + ass.ProductName);
		});

		console.log("---");
		// 5. Iterate through supplier's products directly
		for(var key in qr.Products) {
			ass=qr.Products[key];
			console.log("Product Name: " + ass.ProductName);
		}
	})
	.error(function(err) {
		console.log("Err");
});
