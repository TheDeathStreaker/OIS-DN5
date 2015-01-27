var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',});
var Project = require('sequelize-import')(__dirname + '/../models', sequelize, { exclude: ['index.js']});

Project.Categories.hasMany(Project.Products, {foreignKey: 'CategoryID'});

// 1. index handler is used when www client connects to localhost:3000 or localhost:3000/index [see app.js, line 35-36]
// 2. [see app.js, line 35-36]
exports.index = function(req, res){

	// 3.  Select an Item
	//
	//    Client uses a hyperlink to select an item. A HTTP GET request is issued (e.g. localhost:3000/index?supplier=1)
	//    The handler can access the supplier variable via server variable req.query.supplier
	var selectedItem = req.query.category; // Defaults to 1 if req.query.supplier is undefined
	//                 ^----------------^

	// 4. Execute Queries from the Master-Detail - Exercise 1
	Project.Categories
		.findAll()
		.success(function(qrm) {

			if(qrm == null)
				throw "Err";
			//console.log(qrm);
			
			 Project.Categories
			 	.find({ where: { CategoryID: selectedItem }, include: [Project.Products,] })
			 	.success(function(qrd) {

			 		if(qrd == null)
			 			throw "Err";
			 		//console.log(qrd);
					
			 		// 5. Generate HTML page by invoking the Jade interpreter and providing the appropriate Jade template [see views/index.jade]
			 		//    with two arguments: master and detail (lists)
			 		var title = 'Seznam izdelkov kategorije "' + qrd.CategoryName + '"';
			 		res.render('index', { title1: 'Kategorije izdelkov', title2: title, master: qrm, detail: qrd.Products });
			 		// 6. [see views/index.jade]
			 	})
			 	.error(function(err){
			 		res.render('index', { title1: 'Kategorije izdelkov', master: qrm, detail: null });
			 		render404(req, res);
			 });
		})
		.error(function(err){
			render404(req, res);
	});
	
	$('#poslji-obrazec').submit(function() {
	    console.log("Dela");
	});
	
	
};

render404 = function(req, res) {
	res.writeHead('Content-Type', 'text/plain');
	res.end("404");
}