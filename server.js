const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();


let db = new sqlite3.Database('gradovi', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the local database.');
  });
  
  db.serialize(() => {
    db.each(`SELECT * FROM grad`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row.id + "\t" + row.broj_stanovnika);
    });
  });
  
app.use(bodyParser.json());


app.get('/gradovi', function(request, response){

    let niz = [];
    var i = 0;
    let string = "ID Naziv Broj stanovnika\n";
    db.each(`select * from grad`, function(error, results){
        if ( error ){
            response.status(400).send('Error in database operation');
        } else {
            /*
            console.log(results[0]);
            let obj = {
                "ID": results.id,
                "naziv": results.naziv,
                "broj_stanovnika": results.broj_stanovnika
            }
            console.log(obj);
            niz[i] = obj;
            console.log("Ovdje sam napokon" + i + " :" + niz[i].naziv);
            i++;
            //response.send(results);
            console.log("Duzina niza van db: " + niz.length);
    //for(var j = 0; j < i; j++) console.log(niz[j].ID);
    response.send(niz[i].naziv);*/
    string += results.id + " " + results.naziv + " " + results.broj_stanovnika + "\n";
    console.log(string);
        }
    });
    response.send(string);
   // console.log("Duzina niza van db: " + niz.length);
    //for(var j = 0; j < i; j++) console.log(niz[j].ID);
});
app.listen(6543, () => console.log('server started'));

/*
db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
*/