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
  
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });

app.use(bodyParser.json());

/*
app.get('/gradovi', function(request, response){
    db.query('select * from grad', function(error, results){
        if ( error ){
            response.status(400).send('Error in database operation');
        } else {
            response.send(results);
        }
    });
});
*/
app.listen(6543, () => console.log('server started'));