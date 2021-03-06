Sinhronizacija z vodilnim repozitorjem.

* Dodajte vodilni repozitorij in pridobite spremembe.
	*  `git remote add upstream https://istarc2@bitbucket.org/istarc2/ois-dn3.git`
	*  `git fetch upstream`

* Uveljavite spremembe na glavni veji.
	*  `git checkout master`
	*  `git merge upstream/master`
	*  `git push origin master`

* Po potrebi uveljavite spremembe na vejah dn_3_1 do dn_3_3. Npr.
	* `git checkout dn_3_1`
	* `git merge upstream/master`
	* `git push origin dn_3_1`

Postavitev okolja za reševanje domačih nalog.

* DN 3.1 in 3.2
	* Priprava okolja:
		* `cd orm`
		* `./setup.sh`
	* DN 3.1 
		* Iz glavne veje naredite novo vejo `git checkout -b dn_3_1`
		* Uredite hw3.1-index.js
		* Preizkusite `nodejs hw3.1-index.js`
	* DN 3.2 
		* Iz glavne veje naredite novo vejo `git checkout -b dn_3_2`
		* Uredite hw3.2-index.js
		* Preizkusite `nodejs hw3.2-index.js`

* DN 3.3 in 3.4
	* Priprava okolja:
		* `cd master-detail-www`
		* `./setup.sh`
	* DN 3.3
		* Iz glavne veje naredite novo vejo `git checkout -b dn_3_3`
		* Uredite routes/index.js
		* Preizkusite `nodejs app.js` z brskalnikom.
	* DN 3.4
		* Iz stranske veje dn_3_3 naredite novo vejo `git checkout -b dn_3_4`
		* Uredite routes/index.js
		* Preizkusite `nodejs app.js` z brskalnikom.

* DN 3.5 in 3.6
	* Priprava okolja:
		* `cd e-invoice`
		* `./setup.sh`
	* DN 3.5
		* Iz glavne veje naredite novo vejo `git checkout -b dn_3_5`
		* Uredite routes/chkout.js
		* Preizkusite `nodejs app.js` z brskalnikom.
	* DN 3.6
		* Iz glavne veje naredite novo vejo `git checkout -b dn_3_6`
		* Uredite routes/printOrder.js
		* Preizkusite `nodejs app.js` z brskalnikom. Pri tem ne uporabite korenskega naslova \(http://.../\), ampak \(http://../orders\).