// load dotenv library
require('dotenv').load();

var jwt    = require('jsonwebtoken'),
    config = require('../../server/config/config'),
    frisby = require('frisby'),

    // Load Chance
    Chance = require('chance'),

    // Instantiate Chance so it can be used
    chance = new Chance();

describe('Document Management System : Document Route', function() {  
// POST /documents/ `should create a new document instance`
  var user = {
    username : 'Steve',
    name : {
      first : 'Steve',
      last  : 'Jobs'
    },
    email    : 'stevejobs@apple.com',
    password : 'U)bo5uwgSp'
  };

  frisby.create('POST /api/documents `should create a new document`')
    .post('http://localhost:3000/api/users', user)
    .toss()

  frisby.create('POST')
    .post('http://localhost:3000/api/users/login', {
      username : 'Steve',
      password : 'U)bo5uwgSp'
    })       
    .expectStatus(200)
    .afterJSON(function(json) {
      var token = json.response.token;
      var UserID = json.response.user._id;

      frisby.create('POST')
        .post('http://localhost:3000/api/documents', {
          _ownerId: UserID,
          title: chance.sentence({words: 5}),
          content: chance.paragraph({sentences: 1})
        })
        .addHeader('x-access-token', token)
        .expectJSON({
          "statusCode" : 201,
          "status" : "Created",
          "statusMessage" : "document save successful"
        })
        .expectJSONTypes('response', {
           title    : String,
           content : String
        })
       .toss()
    })
  .toss()
// END

// GET /documents/ `should find all documents`
  frisby.create('GET /documents/ `should find all documents`')
    .post('http://localhost:3000/api/users/login', {
      username : 'Steve',
      password : 'U)bo5uwgSp'
    })
    .expectStatus(200)
    .afterJSON(function(json) {
      var token = json.response.token;
      var UserID = json.response.user._id;

      frisby.create('POST')
        .post('http://localhost:3000/api/documents', {
          _ownerId: UserID,
          title: chance.sentence({words: 5}),
          content: chance.paragraph({sentences: 1})
        })
        .addHeader('x-access-token', token)
        .expectStatus(200)
        .toss()
      frisby.create('GET')
        .get('http://localhost:3000/api/documents')
        .addHeader('x-access-token', token)
        .expectJSON({
          "statusCode" : 200,
          "status" : 'OK'
        })
        .toss() 
  })
  .toss()
// END

// GET /documents/<id> `should find a document`
  frisby.create('GET /documents/<id> `should find a document`')
    .post('http://localhost:3000/api/users/login', {
      username : 'Steve',
      password : 'U)bo5uwgSp'
    })
    .afterJSON(function(json) {
      var token = json.response.token;

      frisby.create('GET')
        .get('http://localhost:3000/api/documents')
        .addHeader('x-access-token', token)
        .expectJSON({
          "statusCode" : 200,
          "status" : 'OK'
        })
        .afterJSON(function(json) {
         frisby.create('GET')
           .get('http://localhost:3000/api/documents/' + json.response[0]._id)
           .addHeader('x-access-token', token)
           .expectJSON({
             "statusCode" : 200,
             "status" : "OK",
           })
           .toss()
         })
       .toss() 
    })
    .toss() 
// END

// PUT /documents/<id> `should update user attributes`
  frisby.create('PUT /documents/<id> `should update user attributes`')
    .post('http://localhost:3000/api/users/login', {
      username : 'Steve',
      password : 'U)bo5uwgSp'
    })
    .afterJSON(function(json) {
      var token = json.response.token;

      frisby.create('GET')
        .get('http://localhost:3000/api/documents')
        .addHeader('x-access-token', token)
        .expectJSON({
          "statusCode" : 200,
          "status" : 'OK'
        })
        .afterJSON(function(json){
         frisby.create('PUT`')
           .put('http://localhost:3000/api/documents/' + json.response[1]._id, {
             title: chance.sentence({words: 5}),
             content: chance.paragraph({sentences: 1})
           }, { json: true })
           .addHeader('x-access-token', token)
           .expectJSON({
              "statusCode" : 200,
              "status" : "OK",
              "statusMessage" : "document update successful",
           })
           .toss() 
         })
       .toss() 
    })
    .toss()
// END

// GET /users/<id>/documents `should find all documents accessible to the user`
  frisby.create('GET /users/<id>/documents `should find all documents accessible to the user')
    .post('http://localhost:3000/api/users/login', {
      username : 'Steve',
      password : 'U)bo5uwgSp'
    })
    .afterJSON(function(json) {
      var token = json.response.token;

      frisby.create('GET')
        .get('http://localhost:3000/api/users')
        .addHeader('x-access-token', token)
        .expectJSON({
          "statusCode" : 200,
          "status" : 'OK'
        })
        .afterJSON(function(json){
         frisby.create('GET`')
           .get('http://localhost:3000/api/users/' + json.response[0]._id + '/documents')
           .addHeader('x-access-token', token)
           .expectJSON({
             "statusCode": 200,
             "statusMessage": "OK",
           })
           .toss() 
        })
        .toss()
    })
    .toss()
// END

// DELETE /documents/<id> `should delete documnent`
  frisby.create('DELETE /documents/<id> `should find a document`')
    .post('http://localhost:3000/api/users/login', {
      username : 'Steve',
      password : 'U)bo5uwgSp'
    })
    .afterJSON(function(json) {
      var token = json.response.token;

      frisby.create('GET')
        .get('http://localhost:3000/api/documents')
        .addHeader('x-access-token', token)
        .expectJSON({
          "statusCode" : 200,
          "status" : 'OK'
        })
        .afterJSON(function(json){
         frisby.create('DELETE')
           .delete('http://localhost:3000/api/documents/' + json.response[0]._id)
           .addHeader('x-access-token', token)
           .expectStatus(200)
           .expectJSON({
             "status": "OK",
             "statusMessage": "document delete successful",
             response: {
              "ok": 1,
              "n": 1
             }
           })
           .toss() 
      })
      .toss()
    })
    .toss() 
// END
});