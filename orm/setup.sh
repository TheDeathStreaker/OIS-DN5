#!/bin/bash

set -e

# 1. Install Software Dependencies
# 1.1 Via apt-get
echo "Install Software Dependencies"
sudo apt-get install nodejs-legacy nodejs node-express node-mysql mysql-server mysql-client npm
# 1.2 Via Npm
npm install mysql sequelize sequelize-auto sequelize-import

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
	# Update ORM Model to match DB Schema
        sed -i s/'});'/'\ \ },{timestamps: false, freezeTableName: true,});'/g models/${file}
done

# 4.1 Deploy Files
if [ ! -f e1-index.js ]; then
	cp install/e1-index.js .
fi

if [ ! -f e2-index.js ]; then
        cp install/e2-index.js .
fi

if [ ! -f e3-index.js ]; then
        cp install/e3-index.js .
fi

if [ ! -f e4-index.js ]; then
        cp install/e4-index.js .
fi

if [ ! -f e5-index.js ]; then
        cp install/e5-index.js .
fi

if [ ! -f e6-index.js ]; then
        cp install/e6-index.js .
fi

if [ ! -f hw3.1-index.js ]; then
        cp install/hw3.1-index.js .
fi

if [ ! -f hw3.2-index.js ]; then
        cp install/hw3.2-index.js .
fi
