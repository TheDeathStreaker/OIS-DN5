/*
 * Master-Detail - Exercise 1
 *
 * Def: "A master–detail interface displays a master list and the details for the currently selected item. 
 *       ...
 *       A master–detail relationship is a one-to-many type relationship. Examples of a master-detail 
 *       relationship are: a set of purchase orders and a set of line items belonging to each purchase order, 
 *       an expense report with a set of expense line items or a department with a list of employees belonging to it. 
 *       An application can use this master-detail relationship to enable users to navigate through 
 *       the purchase order data and see the detail data for line items only related 
 *       to the master purchase order selected." [Wikipedia]
 *
 * Northwind database [see misc/NorthwindERModel.png] and ORM are used to implement master-detail interface as follows.
 * A. We use Suppliers and Products tables with one-to-many relationship to implement this concept.
 * B. We create master list by listing all Suppliers.
 * C. A client selects an item from the master list (which is identified by the SupplierID).
 * D. Based on that input we create a detail list of associated products, which are provided by the selected supplier.
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',})
var Project = require('sequelize-import')(__dirname + '/models', sequelize, { exclude: ['index.js'] });

Project.Suppliers.hasMany(Project.Products, {foreignKey: 'SupplierID'});

// 1. Select an Item
var selectedItem = 1;

Project.Suppliers
	// 2. Find All Items to create the Master List
	.findAll()
	// ^-----^
	.success(function(qrm) {
		
		if(qrm == null)
			throw "Err";
		//console.log(qrm);

		Project.Suppliers
			// 3 Find the Selected Item's Details to create the Detail List
			.find({ where: { SupplierID: selectedItem }, include: [Project.Products,] })
			.success(function(qrd) {

				if(qrd == null)
					throw "Err";
				//console.log(qrm);

				// 4. Display Master List
				console.log("--- Master List ---");
				qrm.forEach(function(qrmel) {
					//console.log(qrmel);
					if(qrmel.SupplierID == selectedItem)
						console.log(qrmel.CompanyName + " [SELECTED ITEM]");
					else
						console.log(qrmel.CompanyName);
				});

				// 5. Display Detail List
				console.log("--- Detail List ---");
				//console.log(qrd);
				qrd.Products.forEach(function(qrdel) {
					//console.log(qrdel);
					console.log(qrdel.ProductName);
				});
			})
			.error(function(err){
				console.log('Err');
		});
	})
	.error(function(err){
		console.log('Err');
});
