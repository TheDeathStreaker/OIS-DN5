/*
 * DN3.6:a) Uporabite podatkovno bazo Northwind in tehnologijo ORM, da ustvarite e-račun na podlagi
 *          podane identifikacijske številke naročila.
 *
 *          Elektronsko račun naj pravilno prikaže postavke računa, vključno z atributi: 
 *          Opis, Obdobje Dobave, Količina, Cena (iz modela Products in ne OrderDetails), Vrednost, Znesek popusta, 
 *          DDV (pomeni znesek DDV), Osnova za DDV in Skupaj. Davčna stopnja (%) naj bo vedno enaka 22 %.
 *
 *          Vrednost popusta (%) tokrat pridobite iz podatkovne baze.
 *
 *          Za polno število točk uporabite knjižnico libxmljs, ustvarite nov element XML in ga
 *          vnesite v dokument XML.
 *
 *       b) Prav tako pravilno prikažite agregirane vrednosti: Vrednost postavk, Vsota popustov,
 *          Osnova za DDV, Vsota zneskov DDV, Vsota s popusti in davki in Za plačilo. Pri tem 
 *          nastavite SUPER RABAT na 0 %, tako da ne vpliva na končno plačilo.
 *          Kategorije Neobdavčeno, Zamudne obresti, Izravnava in Predplačilo naj imajo vrednost 0.
 *
 *       c) Prav tako pravilno prikažite povzetek davkov.
 *          (i)   Popravite splošno davčno stopnjo iz 20 % na 22 % in vrednosti Osnova za DDV, Vrednost DDV.
 *          (ii)  Popravite nižjo davčno stopnjo iz 8.5 % na 9.5 % in vrednosti Osnova za DDV, Vrednost DDV.
 *          (iii) Popravite neobdavčene vrednosti na 0.
 *
 *       d) Izpišite ime Fakturista (Zaposlenega)
 *
 *       e) Pravilno prikažite podatke prejemnika pošiljke. To so: Naziv podjetja, Naslov, Poštna št. in kraj,
 *          Država. Kodo države spremenite v XY. Nanašajte se na podatke iz tabele Orders.
 *
 *          Za polno število točk pri b), c) in d) spremenite obstoječo predlogo chkout.xml z uporabo knjižnice 
 *          libxmljs in tehnologije XPath.
 */

var fs = require('fs');
var xmljs = require("libxmljs");
var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',});
var Project = require('sequelize-import')(__dirname + '/../models', sequelize, {
    exclude: ['index.js']
});

exports.printOrder = function(req, res){

	fs.readFile('./views/chkout.xml', function (err, data) {

		if (err) 
			throw err;

		content=data.toString(); 
		xmlDoc = xmljs.parseXml(content);

		// TODO

		res.header('Content-Type', 'application/xhtml+xml');
		res.end(xmlDoc.toString());
	});
};
