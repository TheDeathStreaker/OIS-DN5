/*
 * e-Invoice - Exercise 1
 *
 * The goal of this exercise is to demonstrate the creation e-invoice
 * based on the content of e-cart. We build on the e-cart exercise, so you should
 * already be familiar with files index.js, index.jade, containers.css,
 * Node.js ORM (Sequelize) and Node.js Express Server Sessions.
 * 
 * This application generates e-SLOG compliant XML output based on the e-cart content,
 * when the Checkout link is used [see index.jade, line 25]. The XML generation handler
 * is defined in the chkout.js file.
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',});
var Project = require('sequelize-import')(__dirname + '/../models', sequelize, {
    exclude: ['index.js']
});

Project.Suppliers.hasMany(Project.Products, {foreignKey: 'SupplierID'});

exports.index = function(req, res){
	if(req.session.cart == null)
		req.session.cart = {};

	var addproduct = req.query.addproduct;

	Project.Products
		.find({ where: { ProductID: addproduct }, })
		.success(function(qr) {

			if(qr == null)
				throw "Err";
			//console.log(qr);

			if(req.session.cart[qr.ProductID] == null)
				req.session.cart[qr.ProductID] = {desc: qr.dataValues, count: 1};
			else
				req.session.cart[qr.ProductID].count += 1;

			renderFun(req, res, req.session.cart);
  	})
  	.error(function(err) {
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
