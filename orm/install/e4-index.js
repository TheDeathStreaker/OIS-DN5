/*
 * ORM - Exercise 4
 *
 * How to find objects using ORM query language and
 *        include two [Many-to-One] associations?
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',})
var Project = require('sequelize-import')(__dirname + '/models', sequelize, { exclude: ['index.js'] });

// 1. Define Many-to-One Associations that are used in the query below
Project.Products.belongsTo(Project.Suppliers, {foreignKey: 'SupplierID'});
Project.Products.belongsTo(Project.Categories, {foreignKey: 'CategoryID'});

Project.Products
	// 3. Find the product's price (and associated supplier name and category name) where ProductName is Chai
	.find({ where: { ProductName: 'Chai' }, include: [Project.Suppliers, Project.Categories] })
	// 4. Add the associations                                         ^-------------------^ (The 2nd model)
	.success(function(qr) {

		if(qr == null)
			throw "Err";
		//console.log(qr);

		console.log("---");
		console.log("Product Name: " + qr.ProductName);
		console.log("Supplier: " + qr.Supplier.CompanyName);
		// 4. PITFALL!                ^------^
		// Use 'Supplier' instead of 'Suppliers', because each Product has only one assoc. Supplier (see line 9 or uncomment line 18).
		console.log("Category: " + qr.Category.CategoryName);
		// 5. PITFALL!                ^------^
		// Use 'Category' instead of 'Categories', because each Product has only one assoc. Category (see line 10 or uncomment line 18).
	})
	.error(function(err) {
		console.log("Err");
});