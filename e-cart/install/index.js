/*
 * e-Cart - Exercise 1
 *
 * Create an e-Cart using Node.js Express Server Session.
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',});
var Project = require('sequelize-import')(__dirname + '/../models', sequelize, {
    exclude: ['index.js']
});

Project.Suppliers.hasMany(Project.Products, {foreignKey: 'SupplierID'});

exports.index = function(req, res){
	// 1. Init Session Variable
	if(req.session.cart == null)
		req.session.cart = {};

	// 2. Acquire product to add
	var addproduct = req.query.addproduct;

	// 3A. Add the product to the cart
	Project.Products
		.find({ where: { ProductID: addproduct }, })
		.success(function(qr) {

			if(qr == null)
				throw "Err";
			//console.log(qr);

			// 4A. Update the session variable
			if(req.session.cart[qr.ProductID] == null)
				// Add the session variable if it does not exist yet
				req.session.cart[qr.ProductID] = {desc: qr.dataValues, count: 1};
			else
				// Else increment the counter of the appropriate session variable
				req.session.cart[qr.ProductID].count += 1;

			// 5A. Render [see views/index.jade]
			renderFun(req, res, req.session.cart);
  	})
  	// 3B. This handler executes if the client did not add a new product to the cart
  	.error(function(err) {
  		// 4B. Render
			renderFun(req, res, req.session.cart);
	});
};

renderFun = function(req, res, cart) {
	Project.Products
		.findAll()
		.success(function(qr){

			if(qr==null)
				throw "Err";
			//console.log(qr);

			res.render('index', { title: 'e-Cart', products: qr, cart: cart});
		})
		.error(function(err) {
			render404(req, res);
		})
}

render404 = function(req, res) {
	res.writeHead('Content-Type', 'plain/text');
	res.end("404");
}
