var Sequelize = require('sequelize');
var sequelize = new Sequelize('northwind', 'nodejs', 'nodejs', {dialect: 'mysql',});
var Project = require('sequelize-import')('/master-detail-www/models', sequelize, { exclude: ['metode.js']});


function izbran(){
    var radios = document.getElementsByName("categories");
    var length = radios.length;
    var category;
    
    for (var i=0; i<length; i++){
        if(radios[i].checked){
            category = radios[i].value;
            alert(category);
            break;
        }
    }
}


function dodaj(){
    alert("add");
}

function zbrisi(){
    var radios = document.getElementsByName("products");
    var length = radios.length;
    var izbran = false;
    var izbranID;
    
    for(var i=0; i<length; i++){
        if(radios[i].checked){
            izbran = true;
            izbranID = radios[i].value; 
            break;
        }
    }
    if(izbran){
        alert(izbranID);
        // Project.Products
        //     .find({ where: { ProductID: izbranID }})
        //     .success(function(item) {
        //         alert(item.ProductName);
        //     })
        //     .error();
    } else {
        alert("Ni izbranega izdelka!")
    }
}
 
function posodobi(){
    alert("posodobi");
}

function shrani(){
    var ime = document.getElementById("name").value;
    var cena = document.getElementById("price").value;
    var kolicina = document.getElementById("quantity").value;
    alert("shrani");
}