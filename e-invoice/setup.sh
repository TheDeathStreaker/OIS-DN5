#!/bin/bash

set -e

# 1. Install Software Dependencies
# 1.1 Via apt-get
echo "Install Software Dependencies"
sudo apt-get install nodejs-legacy nodejs node-express node-mysql mysql-server mysql-client npm
# 1.2 Via Npm
sudo npm install mysql sequelize sequelize-auto sequelize-import underscore libxmljs node-gyp

# 2. Create DB
echo ""
echo "Rebuild Northwind DB?"
echo ""
read -r -p "Are you sure? [y/N] " response
case $response in
	[yY][eE][sS]|[yY])
		echo "Enter mysql root password"
		#sudo service mysql restart --skip-grant-tables
		sudo /etc/init.d/mysql stop || true
		sudo /usr/sbin/mysqld --skip-grant-tables --skip-networking &
		sleep 10
		sudo mysql -v -u root -h localhost -e "FLUSH PRIVILEGES; DROP DATABASE IF EXISTS northwind; CREATE DATABASE northwind; GRANT ALL PRIVILEGES ON northwind.* TO nodejs@localhost IDENTIFIED BY 'nodejs'; FLUSH PRIVILEGES;"
		echo "Insert Data"
		sudo mysql -v -u nodejs -h localhost --password=nodejs northwind < install/crebas.sql
		sudo /etc/init.d/mysql restart
		sleep 10
		;;
	*)
	  ;;
esac

# 3 Create ORM 
# 3.1 Create ORM Models based on exsiting DB schema
echo "Import ORM Models based on the existing DB schema"
./node_modules/sequelize-auto/bin/sequelize-auto -h localhost -d northwind -u nodejs -x nodejs -o "./models"
 
# 3.2 Apply Hotfixes
for file in $(ls models); do
	# Hotfix for Binary Types
        sed -i "s/'b'0''/'0'/g" models/$file
	# Update ORM Model to match DB Schema
        sed -i 8i'\ \ \ \ \ \ primaryKey: true,\n \ \ \ \ \ autoIncrement: true,' models/${file}
	# Upsudo service mysql stopdate ORM Model to match DB Schema
        sed -i s/'});'/'\ \ },{timestamps: false,});'/g models/${file}
done

# 4. Install express
mkdir tmp
if [ -f app.js ]; then
        cp app.js tmp/app.js
fi

if [ -f routes/index.js ]; then
        cp routes/index.js tmp/index.js
fi

if [ -f views/index.jade ]; then
        cp views/index.jade tmp/index.jade
fi

if [ -f views/layout.jade ]; then
        cp views/layout.jade tmp/layout.jade
fi

if [ -f public/stylesheets/containers.css ]; then
        cp public/stylesheets/containers.css tmp/containers.css
fi

if [ -f routes/chkout.js ]; then
	cp routes/chkout.js tmp/chkout.js
fi

if [ -f routes/orders.js ]; then
        cp routes/orders.js tmp/orders.js
fi

if [ -f routes/printOrder.js ]; then
        cp routes/printOrder.js tmp/printOrder.js
fi

if [ -f views/chkout.xml ]; then
        cp views/chkout.xml tmp/chkout.xml
fi

if [ -f views/orders.jade ]; then
        cp views/orders.jade tmp/orders.jade
fi

if [ -f public/stylesheets/chkout.xslt ]; then
        cp public/stylesheets/chkout.xslt tmp/chkout.xslt
fi
# 4.2 Deploy express
yes | express --sessions --css stylus
# 4.3 Install deps
sudo npm install
# 4.4 Deploy/Restore Files
if [ -f tmp/app.js ]; then
        mv tmp/app.js ./app.js
else
        cp install/app.js ./app.js
fi

if [ -f tmp/index.js ]; then
        mv tmp/index.js routes/index.js
else
        cp install/index.js routes/index.js
fi

if [ -f tmp/index.jade ]; then
        mv tmp/index.jade views/index.jade
else
        cp install/index.jade views/index.jade
fi

if [ -f tmp/layout.jade ]; then
        mv tmp/layout.jade views/layout.jade
else
        cp install/layout.jade views/layout.jade
fi

if [ -f tmp/containers.css ]; then
        mv tmp/containers.css public/stylesheets/containers.css
else
        cp install/containers.css public/stylesheets/containers.css
fi

if [ -f tmp/chkout.js ]; then
	mv tmp/chkout.js routes/chkout.js
else
	cp install/chkout.js routes/chkout.js 
fi

if [ -f tmp/orders.js ]; then
        mv tmp/orders.js routes/orders.js
else      
	cp install/orders.js routes/orders.js
fi

if [ -f tmp/printOrder.js ]; then
        mv tmp/printOrder.js routes/printOrder.js
else      
	cp install/printOrder.js routes/printOrder.js
fi

if [ -f tmp/chkout.xml ]; then
        mv tmp/chkout.xml views/chkout.xml
else      
	cp install/chkout.xml views/chkout.xml
fi

if [ -f tmp/orders.jade ]; then
        mv tmp/orders.jade views/orders.jade
else
	cp install/orders.jade views/orders.jade
fi

if [ -f tmp/chkout.xslt ]; then
        mv tmp/chkout.xslt public/stylesheets/chkout.xslt
else
	cp install/chkout.xslt public/stylesheets/chkout.xslt
fi

rmdir tmp
