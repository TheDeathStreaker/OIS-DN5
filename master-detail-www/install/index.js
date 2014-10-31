/*
 * Master-Detail - Exercise 2
 *
 * Def: A master–detail interface displays a master list and the details for the currently selected item. [Wikipedia]
 *
 * The goal of this exercise is to extend Master-Detail - Exercise 1 by adding user friendly interface via Node.js Express Server.
 */

/*
 * DN3.3:a) Dopolnite routes/index.js, tako da se seznam podrobnosti ne bo izpisan,
 *          če uporabnik predhodno ne izbere elementa. Namig: pri klicu res.render() 
 *          nastavite atribut detail na vrednost null.
 *
 *          Za polno število točk uporabite asinhroni rokovalnik napak 
 *          namesto vejitve namesto vejitve if/else. Glej: http://sequelizejs.com/docs/latest/misc
 *
 *       b) Dopolnite routes/index.js in views/index.jade, tako da bo izbran element iz seznama master
 *          označen z odebeljeno pisavo. Sicer naj bo izpisan z privzeto pisavo. Namig: v index.jade 
 *          uporabite vejitev in ustrezno oznako HTML.
 */

/*
 * DN3.4: Razširite nalogo DN3.3.
 *        
 *        Dopolnite routes/index.js, tako da bo prikazano dvo-nivojski vmesnik "master-detail".
 *        Nivo 1 "master" je naj seznam dobaviteljev (CompanyName). Nivo 1 "detail" je naj seznam 
 *        produktov (ProductName) izbranega dobavitelja in hkrati tudi nivo 2 "master". Nivo 2 "detail"
 *        so naj naročila (Quantity) izbranega produkta.
 *
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',});
var Project = require('sequelize-import')(__dirname + '/../models', sequelize, { exclude: ['index.js']});

Project.Suppliers.hasMany(Project.Products, {foreignKey: 'SupplierID'});

// 1. index handler is used when www client connects to localhost:3000 or localhost:3000/index [see app.js, line 35-36]
// 2. [see app.js, line 35-36]
exports.index = function(req, res){

	// 3.  Select an Item
	//
	//    Client uses a hyperlink to select an item. A HTTP GET request is issued (e.g. localhost:3000/index?supplier=1)
	//    The handler can access the supplier variable via server variable req.query.supplier
	var selectedItem = req.query.supplier || 1; // Defaults to 1 if req.query.supplier is undefined
	//                 ^----------------^

	// 4. Execute Queries from the Master-Detail - Exercise 1
	Project.Suppliers
		.findAll()
		.success(function(qrm) {

			if(qrm == null)
				throw "Err";
			//console.log(qrm);
			
			Project.Suppliers
				.find({ where: { SupplierID: selectedItem }, include: [Project.Products,] })
				.success(function(qrd) {

					if(qrd == null)
						throw "Err";
					//console.log(qrd);
					
					// 5. Generate HTML page by invoking the Jade interpreter and providing the appropriate Jade template [see views/index.jade]
					//    with two arguments: master and detail (lists)
					res.render('index', { title: 'Master-Detail', master: qrm, detail: qrd.Products });
					// 6. [see views/index.jade]
				})
				.error(function(err){
					render404(req, res);
			});
		})
		.error(function(err){
			render404(req, res);
	});
};

render404 = function(req, res) {
	res.writeHead('Content-Type', 'text/plain');
	res.end("404");
}
