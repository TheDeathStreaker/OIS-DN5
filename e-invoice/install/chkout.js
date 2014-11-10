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

 /*
 * DN3.5:a) Dopolnite routes/checkout.js, tako da bodo elementi posamezne postavke na zaslonu 
 *          prikazani pravilno. To so: Količina, Cena (iz modela Products in ne OrderDetails),
 *          Vrednost, Znesek popusta, DDV (pomeni znesek DDV), Osnova za DDV in Skupaj. 
 *          Popust (%) naj bo vedno enak 10 %, Davčna stopnja (%) pa naj bo vedno enaka 22 %.
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
 *          Za polno število točk spremenite obstoječo predlogo chkout.xml z uporabo knjižnice 
 *          libxmljs in tehnologije XPath.
 */

var fs = require('fs');
var xmljs = require("libxmljs");

exports.chkout = function(req, res){

	if(req.session.cart == null)
		req.session.cart = {};

	cart=req.session.cart

	// 1. Read e-invoice XML template
	fs.readFile('./views/chkout.xml', function (err, data) {
		// 2. Open the chkout.xml -- our e-SLOG template
		//    [e-SLOG Resources http://e-slog.gzs.si/slo//58741]
		//    [e-SLOG Manual http://e-slog.gzs.si/pripone/34980/Prirocnik_ESLOG_1_6_verzija_2012_1_5.pdf]
		//
		//    The XML document visualization is defined in chkout.xslt
		//

		if (err) 
			throw err;

		// 2. Convert the file content to String
		content=data.toString(); 
		
		// 3. Use libXMLjs to parse the template
		//    [https://github.com/polotek/libxmljs/wiki]
		xmlDoc = xmljs.parseXml(content);

		// 4. Iterate over the items in the cart
		//    to add new items in the e-invoice
		i=0;
		for(var key in cart) {
			
			// 5. For each cart item create a new XML element
			//    [https://github.com/polotek/libxmljs/wiki/Element]
			//    according to the schema of the template
			//    [http://www.gzs.si/e-poslovanje/sheme/eSLOG_1-6_EnostavniRacun.xsd]
			//    and provide appropriate detail values.
			//
			//    To make the long story short ... a properly formated new item
			//    should be placed in the new <PostavkeRacuna></PostavkeRacuna> tag.
			//
			//    Show the mapping between //TODO comments below and e-invoice visualization
			//
			newElement = new xmljs.Element(xmlDoc, 'PostavkeRacuna')
			newElement
				.node('Postavka')
					.node('StevilkaVrstice', (i+1).toString()).parent() //TODO Nastavi Zap št.
				.parent()
				.node('DodatnaIdentifikacijaArtikla')
					.node('VrstaPodatkaArtikla', '5').parent()
					.node('StevilkaArtiklaDodatna', cart[key].desc.ProductID).parent() //TODO Nastavi Oznako
					.node('VrstaKodeArtiklaDodatna', 'SA').parent()
				.parent()
				.node('OpisiArtiklov')
					.node('KodaOpisaArtikla', 'F').parent()
					.node('OpisArtikla')
						.node('OpisArtikla1', cart[key].desc.ProductName).parent() //TODO Nastavi Opis
					.parent()
				.parent()
				.node('OpisiArtiklov')
					.node('OpisArtikla')
						.node('OpisArtikla1', 'OZNAKA_POSTAVKE').parent()
						.node('OpisArtikla2', 'navadna').parent()
					.parent()
				.parent()
				.node('OpisiArtiklov')
					.node('OpisArtikla')
						.node('OpisArtikla1', 'OPIS_ENOTE_MERE').parent()
						.node('OpisArtikla2', '').parent()
					.parent()
				.parent()
				.node('KolicinaArtikla')
					.node('VrstaKolicine', '47').parent()
					.node('Kolicina', cart[key].count.toString()).parent() //TODO Nastavi Količino
					.node('EnotaMere', 'PCE').parent()
				.parent()
				.node('CenaPostavke')
					.node('Cena', cart[key].desc.UnitPrice.toString()).parent() //TODO Nastavi Ceno
			.parent()
				.node('ZneskiPostavke')
					.node('VrstaZneskaPostavke', '203').parent()
					.node('ZnesekPostavke', '150').parent() //TODO Nastavi Vrednost [CenaPostavke/Cena x KolicinaArtikla/Kolicina]
				.parent()
			.node('OdstotkiPostavk')
				.node('Identifikator', 'A').parent()
				.node('VrstaOdstotkaPostavke', '1').parent()
				.node('OdstotekPostavke', '19').parent() // TODO Nastavi Popust (%)
				.node('VrstaZneskaOdstotka', '204').parent()
				.node('ZnesekOdstotka', '28.50').parent() // TODO Izračunaj Znesek Popusta [Vrednost x Popust (%)/100]
			.parent()
			.node('DavkiPostavke')
				.node('DavkiNaPostavki')
					.node('VrstaDavkaPostavke', 'VAT').parent()
					.node('OdstotekDavkaPostavke', '20').parent() // TODO Nastavi Davčno stop. (%)
				.parent()
				.node('ZneskiDavkovPostavke')
					.node('VrstaZneskaDavkaPostavke', '125').parent()
					.node('Znesek', '121.50').parent() // TODO Izračunaj Osnovo za DDV [Vrednost x (1-Popust (%)/100)]
				.parent()
				.node('ZneskiDavkovPostavke')
					.node('VrstaZneskaDavkaPostavke', '124').parent()
					.node('Znesek', '24.30').parent() // TODO Izračunaj DDV [Osnova za DDV x Davčna stop (%)/100]
				.parent()
			.parent()
				.node('ZneskiPostavke')
					.node('VrstaZneskaPostavke', '38').parent()
					.node('ZnesekPostavke', '145.80').parent() // TODO Izračunaj Skupaj [Osnova za DDV + DDV]
				.parent()
			.node('ReferencniDokumentiPostavke')
				.node('VrstaDokumentaPostavke', 'ON').parent()
				.node('StevilkaDokumentaPostavke', 'OIS-00000001').parent()
				.node('DatumDokumenta','2014-10-25T12:00:00Z').parent()
			.parent()
			.node('StroskovnoMesto', 'OIS-PE-001').parent()
			.node('ObdobjeDobave', '1.10.2014-23.1.2014');

			/*
	    6. The above lines generate the following XML Element:

			<PostavkeRacuna>
      <Postavka>
        <StevilkaVrstice>1</StevilkaVrstice>
      </Postavka>
      <DodatnaIdentifikacijaArtikla>
        <VrstaPodatkaArtikla>5</VrstaPodatkaArtikla>
        <StevilkaArtiklaDodatna/>
        <VrstaKodeArtiklaDodatna>SA</VrstaKodeArtiklaDodatna>
      </DodatnaIdentifikacijaArtikla>
      <OpisiArtiklov>
        <KodaOpisaArtikla>F</KodaOpisaArtikla>
        <OpisArtikla>
          <OpisArtikla1>Chai</OpisArtikla1>
        </OpisArtikla>
      </OpisiArtiklov>
      <OpisiArtiklov>
        <OpisArtikla>
          <OpisArtikla1>OZNAKA_POSTAVKE</OpisArtikla1>
          <OpisArtikla2>navadna</OpisArtikla2>
        </OpisArtikla>
      </OpisiArtiklov>
      <OpisiArtiklov>
        <OpisArtikla>
          <OpisArtikla1>OPIS_ENOTE_MERE</OpisArtikla1>
          <OpisArtikla2/>
        </OpisArtikla>
      </OpisiArtiklov>
      <KolicinaArtikla>
        <VrstaKolicine>47</VrstaKolicine>
        <Kolicina>1</Kolicina>
        <EnotaMere>PCE</EnotaMere>
      </KolicinaArtikla>
      <CenaPostavke>
        <Cena>18</Cena>
      </CenaPostavke>
      <ZneskiPostavke>
        <VrstaZneskaPostavke>203</VrstaZneskaPostavke>
        <ZnesekPostavke>150</ZnesekPostavke>
      </ZneskiPostavke>
      <OdstotkiPostavk>
        <Identifikator>A</Identifikator>
        <VrstaOdstotkaPostavke>1</VrstaOdstotkaPostavke>
        <OdstotekPostavke>19</OdstotekPostavke>
        <VrstaZneskaOdstotka>204</VrstaZneskaOdstotka>
        <ZnesekOdstotka>28.50</ZnesekOdstotka>
      </OdstotkiPostavk>
      <DavkiPostavke>
        <DavkiNaPostavki>
          <VrstaDavkaPostavke>VAT</VrstaDavkaPostavke>
          <OdstotekDavkaPostavke>20</OdstotekDavkaPostavke>
        </DavkiNaPostavki>
        <ZneskiDavkovPostavke>
          <VrstaZneskaDavkaPostavke>125</VrstaZneskaDavkaPostavke>
          <Znesek>121.50</Znesek>
        </ZneskiDavkovPostavke>
        <ZneskiDavkovPostavke>
          <VrstaZneskaDavkaPostavke>124</VrstaZneskaDavkaPostavke>
          <Znesek>24.30</Znesek>
        </ZneskiDavkovPostavke>
      </DavkiPostavke>
      <ZneskiPostavke>
        <VrstaZneskaPostavke>38</VrstaZneskaPostavke>
        <ZnesekPostavke>145.80</ZnesekPostavke>
      </ZneskiPostavke>
      <ReferencniDokumentiPostavke>
        <VrstaDokumentaPostavke>ON</VrstaDokumentaPostavke>
        <StevilkaDokumentaPostavke>OIS-00000001</StevilkaDokumentaPostavke>
        <DatumDokumenta>2014-10-25T12:00:00Z</DatumDokumenta>
      </ReferencniDokumentiPostavke>
      <StroskovnoMesto>OIS-PE-001</StroskovnoMesto>
      <ObdobjeDobave>1.10.2014-23.1.2014</ObdobjeDobave>
    	</PostavkeRacuna>

    	*/

			// 7. The new element should be inserted into the e-invoice template at the appropriate place.
			//    We use XPath to navigate to the first element <PostavkaRacuna></PostavkaRacuna>
			//    [http://www.w3schools.com/xpath/]
			xppointer = '//PostavkeRacuna';

			// 8. Insert the new element after the i-th occurance of <PostavkaRacuna></PostavkaRacuna>
			xmlDoc.find(xppointer)[i].addNextSibling(newElement);

			// 9. Increment the item counter
			i += 1;
		}

		// 10. Calculate cumulative sum of all items
		cumsum = 145.80; // TODO
		// 11. Find appropriate the cumulative sum XML tag using the XPath language
		//     [http://www.w3schools.com/xpath/]
		//
		//     Select the first occurance of //PovzetekZneskovRacuna/ZneskiRacuna/ZnesekRacuna, where
		//     //PovzetekZneskovRacuna/ZneskiRacuna/VrstaZneska="79"
		//
		xppointer = '//PovzetekZneskovRacuna[ZneskiRacuna/VrstaZneska="79"]/ZneskiRacuna/ZnesekRacuna';
		// 12. PITFALL!                      ^---------------------------^ (OK), "/ZneskiRacuna..." (WRONG!)
		// 13. Show the mapping between the XPath and the chkout.xml document

		// 14. Insert the new value
		xmlDoc
			.find(xppointer)[0]
			.text(cumsum);

		// 15. Send the XML application to the client
		res.header('Content-Type', 'application/xhtml+xml');
		res.end(xmlDoc.toString());
	});
};
