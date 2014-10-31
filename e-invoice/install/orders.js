
/*
 * GET home page.
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',});
var Project = require('sequelize-import')(__dirname + '/../models', sequelize, {
    exclude: ['index.js']
});

exports.orders = function(req, res) {
	Project.Orders
		.findAll()
		.success(function(qr){

			if(qr==null)
				throw "Err";
			//console.log(qr);

			res.render('orders', { title: 'e-Invoice', orders: qr});
		})
		.error(function(err) {
			render404(req, res);
		});
};
