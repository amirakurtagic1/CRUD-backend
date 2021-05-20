const express = require('express');
const bodyParser = require('body-parser');
const { json } = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();


let db = new sqlite3.Database('gradovi', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the local database.');
  });
  
  
app.use(bodyParser.json());


app.get('/gradovi', function(request, response){
  let string = "ID Naziv  Broj stanovnika <br>";
  
  db.get("SELECT MAX(id) FROM grad", (error, row) => {
    let jsonObj = row;
    
    db.each(`select * from grad`, function(error, results){
      if ( error ){
          response.status(400).send('Error in database operation');
      } else {
      string += results.id + " " + results.naziv + " " + results.broj_stanovnika + "<br>";
 // console.log(string);
      if(results.id == jsonObj["MAX(id)"]) response.send(string);
        }
    });
  });

});

app.get('/gradovi/:id', function(request, response){
  const {id} = request.params;
  console.log(id);
  db.each(`select * from grad where id=?`, [id], function(err, results){
    if (err) {
      return console.log(err.message);
    }
    response.send(results);
  });
});

app.post("/grad", function(req, res) {
  var id = req.body.id;
  var naziv = req.body.naziv;
  var broj_stanovnika = req.body.broj_stanovnika;
  console.log(id + " " + naziv + " " + broj_stanovnika);
  
  db.run(`INSERT INTO grad VALUES(?,?,?)`, [id, naziv, broj_stanovnika], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  res.status(200).send({
    message: "Grad je dodan!"
 });
});

app.put('/gradovi:id', (req, res) => {
  const { id } = req.params;

  db.run(`UPDATE grad
  SET broj_stanovnika=?
  WHERE id=?`, 
    [req.body.broj_stanovnika, id],
    function(error){
        console.log("Update complete " + this.lastID);
    }
);
  
res.status(200).send({
  message: "Grad je promijenjen!"
});
});

app.delete('/gradovi/:id', (req, res) => {
  const { id } = req.params;
  
    db.run(`DELETE FROM grad WHERE id=?`, 
      [id],
      function(error){
          console.log("");
      }
  );
  
res.status(200).send({
  message: "Grad je obrisan!"
});
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
module.exports = app;