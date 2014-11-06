/* 
 * DN3.1: Razširite nalogo e6-index.js, tako da se bo za dan OrderID izpisalo tudi ime podjetja pod naročilom (tj. ime podjetja stranke).
 *
 * Primer izpisa.
 * ---
 * Order Date: Thu Jul 04 1996 02:00:00 GMT+0200 (CEST)
 * Product Name: Queso Cabrales, Ordered Quantity: 12
 * Product Name: Singaporean Hokkien Fried Mee, Ordered Quantity: 10
 * Product Name: Mozzarella di Giovanni, Ordered Quantity: 5
 * Company Name: Vins et alcools Chevalier
 */

var Sequelize = require('sequelize')
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',})
var Project = require('sequelize-import')(__dirname + '/models', sequelize, { exclude: ['index.js'] });

//TODO
