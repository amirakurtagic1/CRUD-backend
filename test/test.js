let server = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
const { assert } = require('chai');

console.log(server);
chai.should();
chai.use(chaiHttp);

const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('gradovi', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the local database.');
  });

before(function() {
  // runs once before the first test in this block
  /*db.run(`DELETE FROM grad WHERE 1=1`,function(error){
          console.log("");
      }
  );*/
  db.run(`INSERT INTO grad(id,naziv,broj_stanovnika) VALUES("1","Sarajevo","275524")`, function(err) {
    if (err) {
      return console.log(err.message);
    }
  });
  db.run(`INSERT INTO grad(id,naziv,broj_stanovnika) VALUES("2","Breza","17000")`, function(err) {
    if (err) {
      return console.log(err.message);
    }
  });
  db.run(`INSERT INTO grad(id,naziv,broj_stanovnika) VALUES("3","Mostar","113169")`, function(err) {
    if (err) {
      return console.log(err.message);
    }
  });
}); 

beforeEach(function(){
  console.log("Test se pokreće prije svakog");
});

afterEach(function(){
  console.log("Test se pokreće poslije svakog testa");
});

after(function(){
  db.run(`DELETE FROM grad WHERE 1=1`,function(error){
    console.log("");
}
);
    console.log("Poslije svih pokreni ovaj test");
});


describe('/GET sve gradove', () => {
  it('Trebao bi dohvatiti sve gradove', (done) => {
    chai.request(server)
        .get('/gradovi')
        .end((err, res) => {
          console.log(res.body);
              res.should.have.status(200);
          done();
        });
  });
});

describe('/GET grad sa id = 1', () => {
  it('Trebao bi dohvatiti grad Sarajevo, jer šaljemo id = 1', (done) => {
    chai.request(server)
        .get('/gradovi/1')
        .end((err, res) => {
          console.log(res.body.naziv);
              res.should.have.status(200);
              assert.equal(res.body.naziv, 'Sarajevo');
          done();
        });
  });
});

describe('/POST grad', () => {
  it('Trebao bi dodati novi grad: Vareš', (done) => {
      let city = {
          "id": 4,
          "naziv": "Vareš",
          "broj_stanovnika": 10000
      }
    chai.request(server)
        .post('/grad')
        .send(city)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              assert.equal(res.body.message, 'Grad je dodan!');
          done();
        });
  });
});

describe('/PUT/:1 grad', () => {
  it('Trebao bi update grad Sarajevo, postaviti broj stanovnika: 100 000', (done) => {
            chai.request(server)
            .put('/gradovi1')
            .send({"broj_stanovnika": 100000})
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Grad je promijenjen!');
              done();
            });
      });
  });

  describe('/DELETE/:4 grad', () => {
    it('Trebao bi obrisati grad sa id = 4, tj Vareš', (done) => {
              chai.request(server)
              .delete('/gradovi/4')
              .end((err, res) => {
                console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Grad je obrisan!');
                done();
              });
        });
    });
