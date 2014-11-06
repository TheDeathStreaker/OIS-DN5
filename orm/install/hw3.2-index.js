/* 
 * DN3.2: Uporabite ORM. Za ProductID = 3 izpišite njegovo ime (ProductName), 
 *        pripadajoč naziv podjetja dobavitelja (CompanyName), kategorijo produkta (CategoryName),
 *        datume naročil (OrderDate) in število produktov v posameznem naročilu (Quantity).
 *        Uporabite lahko največ eno poizvedbo.
 *
 * Primer izpisa.
 * ---
 * Product Name: Aniseed Syrup
 * Company Name: Exotic Liquids
 * Category Name: Condiments
 * Order Date: Mon Aug 26 1996 02:00:00 GMT+0200 (CEST), Ordered Quantity: 30
 * Order Date: Mon Jan 06 1997 01:00:00 GMT+0100 (CET), Ordered Quantity: 50
 * Order Date: Tue Mar 25 1997 01:00:00 GMT+0100 (CET), Ordered Quantity: 20
 * Order Date: Mon May 19 1997 02:00:00 GMT+0200 (CEST), Ordered Quantity: 60
 * Order Date: Mon Jul 07 1997 02:00:00 GMT+0200 (CEST), Ordered Quantity: 14
 * Order Date: Mon Oct 13 1997 02:00:00 GMT+0200 (CEST), Ordered Quantity: 6
 * Order Date: Fri Nov 14 1997 01:00:00 GMT+0100 (CET), Ordered Quantity: 20
 * Order Date: Wed Dec 03 1997 01:00:00 GMT+0100 (CET), Ordered Quantity: 20
 * Order Date: Fri Jan 23 1998 01:00:00 GMT+0100 (CET), Ordered Quantity: 49
 * Order Date: Wed Jan 28 1998 01:00:00 GMT+0100 (CET), Ordered Quantity: 30
 * Order Date: Mon Apr 13 1998 02:00:00 GMT+0200 (CEST), Ordered Quantity: 25
 * Order Date: Wed May 06 1998 02:00:00 GMT+0200 (CEST), Ordered Quantity: 4
 */

var Sequelize = require('sequelize')
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',})
var Project = require('sequelize-import')(__dirname + '/models', sequelize, { exclude: ['index.js'] });

//TODO
