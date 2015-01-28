var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',});
var Project = require('sequelize-import')(__dirname + '/../models', sequelize, { exclude: ['index.js']});

Project.Categories.hasMany(Project.Products, {foreignKey: 'CategoryID'});

exports.index = function(req, res){

	var selectedItem = req.query.category;

	Project.Categories
		.findAll()
		.success(function(qrm) {

			if(qrm == null)
				throw "Err";
			//console.log(qrm);
			
			function izbran(){
    			var radios = document.getElementsByName("categories");
    			var length = radios.length;
    
			    for (var i=0; i<length; i++){
			        if(radios[i].checked){
        			    alert(radios[i].value);
				        break;
        			}
    			}
			}
			
			 Project.Categories
			 	.find({ where: { CategoryID: selectedItem }, include: [Project.Products,] })
			 	.success(function(qrd) {

			 		if(qrd == null)
			 			throw "Err";
			 		//console.log(qrd);
					
			 		var title = 'Seznam izdelkov kategorije "' + qrd.CategoryName + '"';
			 		res.render('index', { title1: 'Kategorije izdelkov', title2: title, master: qrm, detail: qrd.Products, add: false, bold: selectedItem });

			 	})
			 	.error(function(err){
			 		res.render('index', { title1: 'Kategorije izdelkov', master: qrm, detail: null });
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